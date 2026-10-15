<?php
/*
 * Beal's Prestige Fencing: quote form endpoint.
 *
 * POST /api/quote.php with a JSON body from the quote form. The request is saved to MySQL
 * first, then emailed to the business through Resend (plus a short confirmation to the
 * customer when they gave an email). The visitor sees success if either the save or the
 * email worked, so a mail outage never loses a lead.
 *
 * Secrets live in api/config.php, which is created by hand on the server and never
 * committed. See api/config.example.php.
 */
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');

function respond(int $status, array $body): void
{
    http_response_code($status);
    echo json_encode($body);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    respond(405, ['ok' => false, 'error' => 'method']);
}

$cfgFile = __DIR__ . '/config.php';
$cfg = is_file($cfgFile) ? (require $cfgFile) : [];
if (!is_array($cfg)) {
    $cfg = [];
}

$raw = (string) file_get_contents('php://input');
if (strlen($raw) > 20000) {
    respond(413, ['ok' => false, 'error' => 'too_large']);
}
$in = json_decode($raw, true);
if (!is_array($in)) {
    respond(400, ['ok' => false, 'error' => 'bad_request']);
}

// Spam trap: real visitors never fill the hidden field. Pretend it worked.
if (!empty($in['botcheck'])) {
    respond(200, ['ok' => true]);
}

/* ---------- small helpers that work without mbstring ---------- */

function bpf_len(string $s): int
{
    if (function_exists('mb_strlen')) {
        return mb_strlen($s, 'UTF-8');
    }
    return (int) preg_match_all('/./us', $s);
}

function bpf_cut(string $s, int $max): string
{
    if (bpf_len($s) <= $max) {
        return $s;
    }
    if (function_exists('mb_substr')) {
        return mb_substr($s, 0, $max, 'UTF-8');
    }
    $chars = preg_split('//u', $s, -1, PREG_SPLIT_NO_EMPTY) ?: [];
    return implode('', array_slice($chars, 0, $max));
}

/** Read a string field: trimmed, control characters removed, invalid UTF-8 dropped, capped. */
function field(array $in, string $key, int $max, bool $multiline = false): string
{
    $v = $in[$key] ?? '';
    if (!is_string($v)) {
        return '';
    }
    if (!preg_match('//u', $v)) { // not valid UTF-8
        return '';
    }
    $v = $multiline
        ? preg_replace('/[^\P{C}\n]+/u', '', str_replace("\r\n", "\n", $v))
        : preg_replace('/\p{C}+/u', ' ', $v);
    return bpf_cut(trim((string) $v), $max);
}

function pick(array $in, string $key, array $allowed, string $default): string
{
    $v = $in[$key] ?? '';
    return (is_string($v) && in_array($v, $allowed, true)) ? $v : $default;
}

function h(string $s): string
{
    return htmlspecialchars($s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

/* ---------- validate ---------- */

$STYLES = [
    'Not sure yet', 'Wood stockade', 'Shadow box', 'Board on board', 'Horizontal wood',
    'Scalloped privacy', 'Arched top', 'Lattice top', '4 rail farm', '4 rail farm with wire',
    'Cross buck farm', 'White vinyl', 'Black aluminum', 'Wrought iron', 'Chain link',
];
$JOBS = ['New fence', 'Replace an old fence', 'Gate replacement or repair', 'Fence repair', 'Storm or emergency damage'];

$q = [
    'name'     => field($in, 'name', 80),
    'phone'    => field($in, 'phone', 32),
    'email'    => field($in, 'email', 160),
    'address'  => field($in, 'address', 160),
    'property' => pick($in, 'property', ['Residential', 'Commercial'], 'Residential'),
    'job'      => pick($in, 'job', $JOBS, 'New fence'),
    'style'    => pick($in, 'style', $STYLES, 'Not sure yet'),
    'height'   => pick($in, 'height', ['Not sure yet', '4 ft', '6 ft', 'Other'], 'Not sure yet'),
    'length'   => field($in, 'length', 40),
    'message'  => field($in, 'message', 2000, true),
];

$problems = [];
if (bpf_len($q['name']) < 2) {
    $problems[] = 'name';
}
$digits = preg_replace('/\D+/', '', $q['phone']);
if (strlen((string) $digits) < 10 || strlen((string) $digits) > 15) {
    $problems[] = 'phone';
}
if ($q['email'] !== '' && !filter_var($q['email'], FILTER_VALIDATE_EMAIL)) {
    $problems[] = 'email';
}
if (bpf_len($q['address']) < 2) {
    $problems[] = 'address';
}
if ($problems) {
    respond(422, ['ok' => false, 'error' => 'validation', 'fields' => $problems]);
}

$ip = (string) ($_SERVER['REMOTE_ADDR'] ?? '');
$ipHash = hash('sha256', $ip . '|' . (string) ($cfg['salt'] ?? 'bpf'));
$ua = bpf_cut((string) ($_SERVER['HTTP_USER_AGENT'] ?? ''), 255);

/* ---------- save to MySQL first ---------- */

$pdo = null;
$saved = false;
$rowId = null;

if (!empty($cfg['db_name']) && class_exists('PDO') && in_array('mysql', PDO::getAvailableDrivers(), true)) {
    try {
        $pdo = new PDO(
            sprintf('mysql:host=%s;dbname=%s;charset=utf8mb4', $cfg['db_host'] ?? 'localhost', $cfg['db_name']),
            (string) ($cfg['db_user'] ?? ''),
            (string) ($cfg['db_pass'] ?? ''),
            [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_EMULATE_PREPARES => false]
        );
        $pdo->exec("CREATE TABLE IF NOT EXISTS quote_requests (
            id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            created_at DATETIME NOT NULL,
            name VARCHAR(80) NOT NULL,
            phone VARCHAR(32) NOT NULL,
            email VARCHAR(160) NOT NULL DEFAULT '',
            address VARCHAR(160) NOT NULL,
            property VARCHAR(20) NOT NULL,
            job VARCHAR(60) NOT NULL,
            style VARCHAR(60) NOT NULL,
            height VARCHAR(20) NOT NULL,
            length VARCHAR(40) NOT NULL DEFAULT '',
            message TEXT NOT NULL,
            ip_hash CHAR(64) NOT NULL,
            user_agent VARCHAR(255) NOT NULL DEFAULT '',
            emailed TINYINT(1) NOT NULL DEFAULT 0,
            INDEX (ip_hash, created_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

        // Throttle: 5 requests per 10 minutes per visitor
        $st = $pdo->prepare('SELECT COUNT(*) FROM quote_requests WHERE ip_hash = ? AND created_at > (NOW() - INTERVAL 10 MINUTE)');
        $st->execute([$ipHash]);
        if ((int) $st->fetchColumn() >= 5) {
            respond(429, ['ok' => false, 'error' => 'too_many']);
        }

        $st = $pdo->prepare('INSERT INTO quote_requests
            (created_at, name, phone, email, address, property, job, style, height, length, message, ip_hash, user_agent)
            VALUES (NOW(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
        $st->execute([
            $q['name'], $q['phone'], $q['email'], $q['address'], $q['property'], $q['job'],
            $q['style'], $q['height'], $q['length'], $q['message'], $ipHash, $ua,
        ]);
        $rowId = (int) $pdo->lastInsertId();
        $saved = true;
    } catch (Throwable $e) {
        error_log('[quote] mysql: ' . $e->getMessage());
    }
} else {
    error_log('[quote] mysql: not configured or pdo_mysql missing');
    // Without the database, fall back to a simple file-based throttle
    $tf = rtrim(sys_get_temp_dir(), '/\\') . '/bpf-quote-' . substr($ipHash, 0, 24);
    $hits = array_filter(
        is_file($tf) ? (array) json_decode((string) @file_get_contents($tf), true) : [],
        static fn($t) => is_int($t) && $t > time() - 600
    );
    if (count($hits) >= 5) {
        respond(429, ['ok' => false, 'error' => 'too_many']);
    }
    $hits[] = time();
    @file_put_contents($tf, json_encode(array_values($hits)));
}

/* ---------- email through Resend ---------- */

/** POST JSON to Resend. Returns [httpStatus, body]. Logs are labelled with the service. */
function resend_send(string $apiKey, array $payload): array
{
    $json = (string) json_encode($payload);
    $headers = ['Authorization: Bearer ' . $apiKey, 'Content-Type: application/json'];

    if (function_exists('curl_init')) {
        $ch = curl_init('https://api.resend.com/emails');
        curl_setopt_array($ch, [
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => $json,
            CURLOPT_HTTPHEADER => $headers,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 15,
        ]);
        $body = curl_exec($ch);
        $status = (int) curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
        if ($body === false) {
            error_log('[quote] resend curl: ' . curl_error($ch));
        }
        curl_close($ch);
        return [$status, (string) $body];
    }

    if (ini_get('allow_url_fopen')) {
        $ctx = stream_context_create(['http' => [
            'method' => 'POST', 'header' => implode("\r\n", $headers), 'content' => $json,
            'timeout' => 15, 'ignore_errors' => true,
        ]]);
        $body = @file_get_contents('https://api.resend.com/emails', false, $ctx);
        $status = 0;
        foreach ($http_response_header ?? [] as $line) {
            if (preg_match('#^HTTP/\S+\s+(\d{3})#', $line, $m)) {
                $status = (int) $m[1];
            }
        }
        return [$status, (string) $body];
    }

    error_log('[quote] resend: neither php-curl nor allow_url_fopen is available');
    return [0, ''];
}

$emailed = false;
$apiKey = (string) ($cfg['resend_api_key'] ?? '');
$mailTo = (string) ($cfg['mail_to'] ?? '');
$mailFrom = (string) ($cfg['mail_from'] ?? '');
$phoneTel = '+1' . substr((string) $digits, -10);

if ($apiKey !== '' && $mailTo !== '' && $mailFrom !== '') {
    $rows = [
        'Name' => $q['name'], 'Phone' => $q['phone'], 'Email' => $q['email'] ?: '-',
        'Property address' => $q['address'], 'Property type' => $q['property'], 'Needs' => $q['job'],
        'Fence style' => $q['style'], 'Height' => $q['height'], 'Approx. length' => $q['length'] ?: '-',
    ];
    $tr = '';
    $text = '';
    foreach ($rows as $label => $value) {
        $tr .= '<tr><td style="padding:6px 14px 6px 0;color:#545F50;white-space:nowrap">' . h($label) . '</td>'
             . '<td style="padding:6px 0;font-weight:600">' . h($value) . '</td></tr>';
        $text .= $label . ': ' . $value . "\n";
    }
    $msgHtml = $q['message'] !== '' ? nl2br(h($q['message'])) : '<em>No extra details.</em>';
    $text .= "\n" . ($q['message'] !== '' ? $q['message'] : 'No extra details.') . "\n";

    $lead = [
        'from' => $mailFrom,
        'to' => [$mailTo],
        'subject' => 'New quote request: ' . $q['style'] . ' (' . $q['property'] . ') from ' . $q['name'],
        'html' => '<div style="font-family:Arial,sans-serif;font-size:15px;color:#0F1E0F">'
            . '<h2 style="margin:0 0 4px;color:#005200">New quote request</h2>'
            . '<p style="margin:0 0 16px;color:#545F50">From the bealsprestigefence.com quote form</p>'
            . '<table style="border-collapse:collapse">' . $tr . '</table>'
            . '<p style="margin:18px 0 6px;color:#545F50">Details</p><p style="margin:0">' . $msgHtml . '</p>'
            . '<p style="margin:22px 0 0"><a href="tel:' . h($phoneTel) . '" style="background:#005200;color:#FFFADD;padding:10px 18px;border-radius:999px;text-decoration:none;font-weight:bold">Call ' . h($q['name']) . '</a></p>'
            . '</div>',
        'text' => "New quote request from bealsprestigefence.com\n\n" . $text,
    ];
    if ($q['email'] !== '') {
        $lead['reply_to'] = $q['email'];
    }

    [$status, $body] = resend_send($apiKey, $lead);
    if ($status >= 200 && $status < 300) {
        $emailed = true;
    } else {
        error_log('[quote] resend lead email failed: HTTP ' . $status . ' ' . bpf_cut($body, 300));
    }

    // Short confirmation to the customer (best effort)
    if ($q['email'] !== '') {
        $businessPhone = (string) ($cfg['business_phone'] ?? '(770) 540-6190');
        $businessTel = '+1' . substr((string) preg_replace('/\D+/', '', $businessPhone), -10);
        $first = explode(' ', $q['name'])[0];
        [$status2, $body2] = resend_send($apiKey, [
            'from' => $mailFrom,
            'to' => [$q['email']],
            'reply_to' => $mailTo,
            'subject' => "We got your quote request - Beal's Prestige Fencing",
            'html' => '<div style="font-family:Arial,sans-serif;font-size:15px;color:#0F1E0F">'
                . '<p>Hi ' . h($first) . ',</p>'
                . '<p>Thanks for reaching out to Beal&#39;s Prestige Fencing. We received your request for a free quote on a <strong>' . h($q['style']) . '</strong> fence and will get back to you soon.</p>'
                . '<p>Need us sooner? Call or text <a href="tel:' . h($businessTel) . '" style="color:#005200;font-weight:bold">' . h($businessPhone) . '</a>. We answer 24/7.</p>'
                . '<p style="color:#545F50">Beal&#39;s Prestige Fencing<br>Your Property. Your Privacy. Our Craftsmanship.</p>'
                . '</div>',
            'text' => "Hi {$first},\n\nThanks for reaching out to Beal's Prestige Fencing. We received your request for a free quote on a {$q['style']} fence and will get back to you soon.\n\nNeed us sooner? Call or text {$businessPhone}. We answer 24/7.\n\nBeal's Prestige Fencing",
        ]);
        if ($status2 < 200 || $status2 >= 300) {
            error_log('[quote] resend confirmation email failed: HTTP ' . $status2 . ' ' . bpf_cut($body2, 300));
        }
    }
} else {
    error_log('[quote] resend: not configured');
}

if ($saved && $emailed && $pdo && $rowId) {
    try {
        $pdo->prepare('UPDATE quote_requests SET emailed = 1 WHERE id = ?')->execute([$rowId]);
    } catch (Throwable $e) {
        error_log('[quote] mysql update: ' . $e->getMessage());
    }
}

if ($saved || $emailed) {
    respond(200, ['ok' => true]);
}
respond(503, ['ok' => false, 'error' => 'unavailable']);
