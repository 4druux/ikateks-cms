<?php

echo "<pre>";

$projectRoot = __DIR__ . '/../application'; 

$autoloadPath = $projectRoot . '/vendor/autoload.php';
if (!file_exists($autoloadPath)) {
    die("ERROR: File 'vendor/autoload.php' tidak ditemukan di: " . $autoloadPath);
}

$bootstrapPath = $projectRoot . '/bootstrap/app.php';
if (!file_exists($bootstrapPath)) {
    die("ERROR: File 'bootstrap/app.php' tidak ditemukan di: " . $bootstrapPath);
}

require $autoloadPath;

$app = require_once $bootstrapPath;

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);

try {
    
    echo "Menjalankan 'artisan migrate --force'...\n";
    ob_start();
    $kernel->call('migrate', ['--force' => true]);
    $output_migrate = ob_get_clean();
    echo $output_migrate;
    echo "\n...Selesai migrate.\n\n";

    echo "Menjalankan 'artisan config:cache'...\n";
    ob_start();
    $kernel->call('config:cache');
    $output_config = ob_get_clean();
    echo $output_config;
    echo "\n...Selesai config cache.\n\n";

    echo "Menjalankan 'artisan route:cache'...\n";
    ob_start();
    $kernel->call('route:cache');
    $output_route = ob_get_clean();
    echo $output_route;
    echo "\n...Selesai route cache.\n\n";

    echo "Menjalankan 'artisan view:cache'...\n";
    ob_start();
    $kernel->call('view:cache');
    $output_view = ob_get_clean();
    echo $output_view;
    echo "\n...Selesai view cache.\n\n";
    
    echo "</pre>";
    echo "<h1>BERHASIL: Migrasi telah dijalankan.</h1>";
    echo "<p>Tabel 'settings' dan migrasi lainnya sudah dibuat.</p>";
    echo "<p style='color:red; font-weight:bold; font-size: 20px;'>FILE INI SANGAT BERBAHAYA. HAPUS 'buatmigrasi.php' SEKARANG JUGA!</p>";

} catch (\Exception $e) {
    echo "</pre>";
    echo "<h1>GAGAL: Terjadi error saat migrasi.</h1>";
    echo "<pre>" . $e->getMessage() . "</pre>";
    echo "<p style='color:red; font-weight:bold; font-size: 20px;'>HAPUS FILE 'buatmigrasi.php' INI.</p>";
}

?>