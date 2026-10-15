<?php
/*
 * Copy this to api/config.php ON THE SERVER (Hostinger File Manager) and fill in the values.
 * Never commit config.php: it holds the database password and the Resend API key.
 * Typing it as one line in the browser editor avoids auto-indent and auto-closed quotes.
 */
return [
    'db_host'        => 'localhost',
    'db_name'        => 'u000000000_bealsfence',     // Hostinger adds an account prefix
    'db_user'        => 'u000000000_bealsfence',
    'db_pass'        => 'the database password',
    'mail_to'        => 'bealspf@gmail.com',          // where quote requests are sent
    'mail_from'      => "Beal's Prestige Fencing <quotes@bealsprestigefence.com>", // must be on the domain verified in Resend
    'resend_api_key' => 're_...',
    'business_phone' => '(770) 540-6190',             // shown in the customer confirmation email
    'salt'           => 'any random text',            // used to hash visitor IPs for rate limiting
];
