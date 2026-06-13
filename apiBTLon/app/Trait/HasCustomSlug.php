<?php

namespace App\Trait;

use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;

trait HasCustomSlug
{
    use HasSlug;
    /**
     * Cấu hình luật tạo slug dùng chung cho toàn bộ hệ thống
     */
    public function getSlugOptions(): SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom('name')       // Mặc định lấy từ cột 'name'
            ->saveSlugsTo('slug')             // Mặc định lưu vào cột 'slug'
            ->doNotGenerateSlugsOnUpdate();   // Giữ nguyên slug khi cập nhật để bảo vệ SEO
    }
}
