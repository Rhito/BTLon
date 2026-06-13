<?php

namespace App\Models;

use App\Trait\HasCustomSlug;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable(['name', 'slug', 'description', 'is_active'])]
class Category extends Model
{
    use HasFactory, SoftDeletes, HasCustomSlug;

    public function products(): BelongsToMany
    {
        return $this->belongsToMany(Product::class, 'products_categories', 'category_id', 'product_id');
    }

    public function images(): HasMany
    {
        return $this->hasMany(ProductImage::class);
    }
}
