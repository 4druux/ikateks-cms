<?php

namespace Database\Seeders;

use App\Models\PageHero;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PageHeroSeeder extends Seeder
{
    public function run(): void
    {
        PageHero::firstOrCreate(
            ['page_key' => 'home'],
            [
                'title' => 'Build Success Together',
                'title_id' => 'Membangun Kesukesan Bersama',
                'subtitle' => 'PT. Ikateks Citra Persada',
                'subtitle_id' => 'PT. Ikateks Citra Persada',
                'description' => 'ICP - Building success together by empowering innovation and strengthening partnerships in the textile industry.',
                'description_id' => 'ICP - Membangun kesuksesan bersama dengan memberdayakan inovasi dan memperkuat kemitraan di industri tekstil.',
                'media_type' => 'video',
                'media_path' => 'heroes/hero.mp4' 
            ]
        );

        PageHero::firstOrCreate(
            ['page_key' => 'about'],
            [
                'title' => 'About Us',
                'title_id' => 'Tentang Kami',
                'description' => 'ICP - Building success together by empowering innovation and strengthening partnerships in the textile industry.',
                'description_id' => 'ICP - Membangun kesuksesan bersama dengan memberdayakan inovasi dan memperkuat kemitraan di industri tekstil.',
                'media_type' => 'image',
                'media_path' => 'heroes/office-3.jpg'
            ]
        );

        PageHero::firstOrCreate(
            ['page_key' => 'product'],
            [
                'title' => 'Products',
                'title_id' => 'Produk',
                'description' => 'We provide a wide array of textile products, from raw fibers to finished technical fabrics, tailored to meet your specific needs.',
                'description_id' => 'Kami menyediakan beragam produk tekstil, dari serat mentah hingga kain teknis jadi, yang disesuaikan untuk memenuhi kebutuhan spesifik Anda.',
                'media_type' => 'image',
                'media_path' => 'heroes/office-3.jpg'
            ]
        );

        PageHero::firstOrCreate(
            ['page_key' => 'principals'],
            [
                'title' => 'Principals',
                'title_id' => 'Prinsipals',
                'description' => 'Expert solutions that drive innovation and quality across the entire textile value chain.',
                'description_id' => 'Solusi ahli yang mendorong inovasi dan kualitas di seluruh rantai nilai tekstil.',
                'media_type' => 'image',
                'media_path' => 'heroes/office-4.jpg'
            ]
        );

        PageHero::firstOrCreate(
            ['page_key' => 'news'],
            [
                'title' => 'News',
                'title_id' => 'Berita',
                'description' => 'We bring deep technical expertise across multiple domains to deliver comprehensive solutions that drive digital transformation and business growth.',
                'description_id' => 'Kami membawa keahlian teknis yang mendalam di berbagai domain untuk memberikan solusi komprehensif yang mendorong transformasi digital dan pertumbuhan bisnis.',
                'media_type' => 'image',
                'media_path' => 'heroes/office-1.jpg'
            ]
        );

        PageHero::firstOrCreate(
            ['page_key' => 'customers'],
            [
                'title' => 'Trusted By Industry',
                'title_id' => 'Dipercaya Oleh Industri',
                'description' => 'We have established over a hundred clients, helping them navigate digital transformation and achieve measurable success.',
                'description_id' => 'Kami telah bermitra dengan lebih dari seratus klien, membantu mereka menavigasi transformasi digital dan mencapai kesuksesan yang terukur.',
                'media_type' => 'image',
                'media_path' => 'heroes/office-3.jpg'
            ]
        );

        PageHero::firstOrCreate(
            ['page_key' => 'contact'],
            [
                'title' => 'Contact Us',
                'title_id' => 'Hubungi Kami',
                'description' => 'Lets build something great together. Reach out to our team to discuss your project or ask us anything.',
                'description_id' => 'Mari kita bangun sesuatu yang hebat bersama. Hubungi tim kami untuk mendiskusikan proyek Anda atau tanyakan apa pun.',
                'media_type' => 'image',
                'media_path' => 'heroes/contact.jpg'
            ]
        );

        PageHero::firstOrCreate(
            ['page_key' => 'privacy'],
            [
                'title' => 'Privacy Policy',
                'title_id' => 'Kebijakan Privasi',
                'description' => 'Your privacy is important to us. Learn how we collect, use, and protect your personal data.',
                'description_id' => 'Privasi Anda penting bagi kami. Pelajari bagaimana kami mengumpulkan, menggunakan, dan melindungi data pribadi Anda.',
                'media_type' => 'image',
                'media_path' => 'heroes/contact.jpg'
            ]
        );
    }
}