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
    
    echo "Menjalankan 'artisan db:seed --class=PageHeroSeeder --force'...\n";
    ob_start();
    
    $kernel->call('db:seed', [
        '--class' => 'PageHeroSeeder',
        '--force' => true
    ]);
    
    $output_seed = ob_get_clean();
    echo $output_seed;
    echo "\n...Selesai seeding PageHero.\n\n";

    
    echo "</pre>";
    echo "<h1>BERHASIL: Seeder PageHero telah dijalankan.</h1>";
    echo "<p>Data 'PageHero' (home, about, dll) sudah masuk ke database.</p>";
    echo "<p style='color:red; font-weight:bold; font-size: 20px;'>FILE INI SANGAT BERBAHAYA. HAPUS 'run_hero_seeder.php' SEKARANG JUGA!</p>";

} catch (\Exception $e) {
    echo "</pre>";
    echo "<h1>GAGAL: Terjadi error saat seeding.</h1>";
    echo "<pre>" . $e->getMessage() . "</pre>";
    echo "<p style='color:red; font-weight:bold; font-size: 20px;'>HAPUS FILE 'run_hero_seeder.php' INI.</p>";
}

?>