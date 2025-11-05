<?php

$target = '/home/ikateksc/application/storage/app/public';
$link = '/home/ikateksc/public_html/storage';

if (is_link($link)) {
    if (readlink($link) === $target) {
        echo "BERHASIL: Link 'storage' sudah ada dan menunjuk ke target yang benar.";
    } else {
        echo "ERROR: Link 'storage' sudah ada, TAPI menunjuk ke target yang salah. Hapus dulu link 'storage' di public_html.";
    }
} 
elseif (!file_exists($link)) {
    if (symlink($target, $link)) {
        echo "BERHASIL: Link 'storage' baru saja dibuat!";
    } else {
        echo "GAGAL: Tidak bisa membuat link. Cek folder permissions atau hubungi support hosting.";
    }
} 
else {
    echo "ERROR: Sebuah folder (bukan link) bernama 'storage' sudah ada. Hapus folder 'storage' di public_html terlebih dahulu.";
}

?>