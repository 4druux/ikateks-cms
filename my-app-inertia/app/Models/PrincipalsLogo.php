<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PrincipalsLogo extends Model
{
    use HasFactory;

    protected $table = 'principals_logo';

    protected $fillable = ['image_path'];
}