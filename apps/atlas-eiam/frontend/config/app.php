<?php
/**
 * ==========================================================================
 * Project Atlas — Enterprise White-Labeled Suite
 * Developed by Buana Studios
 * --------------------------------------------------------------------------
 * Lead Architect : Hikmatullah Sakti Buana (Abu Hafidz)
 * Contact Email  : sakti@buana.studio
 * Telegram       : @thesaktibuana
 * Website        : https://buana.studio
 * ==========================================================================
 */

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

define('APP_NAME', 'Atlas');
define('APP_CODENAME', 'Atlas');
define('APP_TAGLINE', 'White Labeled Enterprise Suite by Buana Studios');
define('APP_VERSION', '1.0.0');
define('APP_AUTHOR', 'Hikmatullah Sakti Buana');
define('APP_AUTHOR_HANDLE', '@thesaktibuana');
define('APP_AUTHOR_EMAIL', 'sakti@buana.studio');
define('SETTINGS_FILE', __DIR__ . '/settings.json');

// Settings Helpers
function get_site_settings() {
    if (file_exists(SETTINGS_FILE)) {
        $json = file_get_contents(SETTINGS_FILE);
        $data = json_decode($json, true);
        if (is_array($data)) return $data;
    }
    return [
        'brand_name' => 'Atlas',
        'sub_brand' => 'Buana Studios',
        'hero_image' => 'assets/images/hero_1.jpg',
        'tab_login_text' => 'Log in',
        'tab_register_text' => 'Create account',
        'email_label' => 'Email',
        'email_placeholder' => 'E.g; sakti@buana.studio',
        'password_label' => 'Password',
        'password_placeholder' => '••••••••••••',
        'remember_text' => 'Keep me logged in on this device',
        'button_text' => 'Log in',
        'button_color' => '#38bdf8',
        'forgot_password_text' => 'I forgot my password',
        'spotlight_name' => 'Hikmatullah Sakti Buana',
        'spotlight_role' => 'Founder & Lead Architect @ Buana Studios',
        'spotlight_avatar' => 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hikmatullah'
    ];
}

function save_site_settings($newSettings) {
    $current = get_site_settings();
    $merged = array_merge($current, $newSettings);
    file_put_contents(SETTINGS_FILE, json_encode($merged, JSON_PRETTY_PRINT));
    return $merged;
}

// Initial Mock Data Seeder for Ekstrakurikuler / Activities if session data not set
if (!isset($_SESSION['ekskul_list'])) {
    $_SESSION['ekskul_list'] = [
        ['id' => 1, 'nama' => 'Aikido', 'nama_arab' => 'أيكيدو', 'deskripsi' => 'Seni bela diri Aikido', 'nilai_count' => 0, 'status' => 'Aktif'],
        ['id' => 2, 'nama' => 'Archery', 'nama_arab' => 'الرماية', 'deskripsi' => 'Olahraga panahan', 'nilai_count' => 0, 'status' => 'Aktif'],
        ['id' => 3, 'nama' => 'Badminton', 'nama_arab' => 'كرة الريشة', 'deskripsi' => 'Klub bulutangkis', 'nilai_count' => 0, 'status' => 'Aktif'],
        ['id' => 4, 'nama' => 'Basket', 'nama_arab' => 'كرة السلة', 'deskripsi' => 'Tim basket', 'nilai_count' => 0, 'status' => 'Aktif'],
        ['id' => 5, 'nama' => 'Brazilian Jiu Jitsu', 'nama_arab' => 'جيو جيتسو', 'deskripsi' => 'Bela diri ground fighting', 'nilai_count' => 0, 'status' => 'Aktif'],
        ['id' => 6, 'nama' => 'Calligraphy', 'nama_arab' => 'الخط العربي', 'deskripsi' => 'Seni khat & kaligrafi', 'nilai_count' => 5, 'status' => 'Aktif'],
        ['id' => 7, 'nama' => 'Horse Riding', 'nama_arab' => 'ركوب الخيل', 'deskripsi' => 'Keterampilan berkuda', 'nilai_count' => 0, 'status' => 'Aktif'],
        ['id' => 8, 'nama' => 'Swimming', 'nama_arab' => 'السباحة', 'deskripsi' => 'Olahraga renang', 'nilai_count' => 12, 'status' => 'Aktif'],
        ['id' => 9, 'nama' => 'Taekwondo', 'nama_arab' => 'التايكوندو', 'deskripsi' => 'Seni bela diri Taekwondo', 'nilai_count' => 0, 'status' => 'Aktif'],
        ['id' => 10, 'nama' => 'Volley', 'nama_arab' => 'كرة الطائرة', 'deskripsi' => 'Klub voli', 'nilai_count' => 0, 'status' => 'Aktif']
    ];
}

// Helper Functions
function get_active_page() {
    return $_GET['page'] ?? 'dashboard';
}

function set_flash_message($type, $msg) {
    $_SESSION['flash'] = ['type' => $type, 'message' => $msg];
}

function get_flash_message() {
    if (isset($_SESSION['flash'])) {
        $flash = $_SESSION['flash'];
        unset($_SESSION['flash']);
        return $flash;
    }
    return null;
}
