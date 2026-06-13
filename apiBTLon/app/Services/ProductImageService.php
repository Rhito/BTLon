<?php

namespace App\Services;

use App\Models\Product;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Format;

class ProductImageService
{
    protected FileService $fileService;
    protected ImageManager $imageManager;

    public function __construct(FileService $fileService)
    {
        $this->fileService = $fileService;
        $this->imageManager = ImageManager::usingDriver(Driver::class);
    }

    public function upload(UploadedFile $file): array
    {
        $filename = Str::uuid() . '.jpg';

        $mainImage = $this->imageManager->decodeSplFileInfo($file)
            ->scaleDown(width: 1200);

        $mainImageData = (string) $mainImage->encodeUsingFormat(Format::JPEG, quality: 85);

        $imagePath = "products/images/{$filename}";
        Storage::disk('public')->put($imagePath, $mainImageData);

        $thumbnail = $this->imageManager->decodeSplFileInfo($file)
            ->cover(300, 300);

        // $thumbnail = $this->imageManager->decodeSplFileInfo($file)
        //     ->contain(300, 300)
        //     ->resizeCanvas(300, 300, background: 'ffffff');

        $thumbnailData = (string) $thumbnail->encodeUsingFormat(Format::JPEG, quality: 75);

        $thumbnailPath = "products/thumbnails/{$filename}";
        Storage::disk('public')->put($thumbnailPath, $thumbnailData);

        return [
            'img_url' => $imagePath,
            'thumbnail_url' => $thumbnailPath,
        ];
    }

    public function uploadMany(array $files): array
    {
        $results = [];

        foreach ($files as $file) {
            $results[] = $this->upload($file);
        }

        return $results;
    }

    public function createProductImages(
        Product $product,
        array $files,
        int $mainImageIndex = 0
    ): void {

        if ($product->images()->count() + count($files) > 10) {
            throw new \Exception('A product can have a maximum of 10 images.');
        }

        $images = $this->uploadMany($files);

        $hasMain = $product->images()->where('is_main', true)->exists();

        foreach ($images as $index => $image) {
            $isMain = $index === $mainImageIndex;
            $product->images()->create([
                'img_url' => $image['img_url'],
                'thumbnail_url' => $image['thumbnail_url'],
                'is_main' => !$hasMain && $isMain,
            ]);

            if (!$hasMain && $isMain) {
                $hasMain = true;
            }
        }
    }


    public function deleteImage(string $imgUrl, string $thumbnailUrl): void
    {
        Storage::disk('public')->delete($imgUrl);
        Storage::disk('public')->delete($thumbnailUrl);
    }

    public function deleteMany($images): void
    {
        foreach ($images as $image) {
            $this->deleteImage($image->img_url, $image->thumbnail_url);
        }
    }

    public function removeProductImage(Product $product, int $imageId): void
    {
        $image = $product->images()->findOrFail($imageId);
        $wasMain = $image->is_main;

        $this->deleteImage($image->img_url, $image->thumbnail_url);
        $image->delete();

        if ($wasMain) {
            $product->images()
                ->oldest()
                ->first()
                    ?->update(['is_main' => true]);
        }
    }

    public function updateProductImage(
        Product $product,
        int $imageId,
        ?UploadedFile $newFile = null,
        ?bool $setAsMain = null
    ): void {
        $image = $product->images()->findOrFail($imageId);

        // Thay file ảnh
        if ($newFile) {
            $this->deleteImage($image->img_url, $image->thumbnail_url);
            $uploaded = $this->upload($newFile);
            $image->update([
                'img_url' => $uploaded['img_url'],
                'thumbnail_url' => $uploaded['thumbnail_url'],
            ]);
        }

        // Đổi ảnh chính
        if ($setAsMain === true && !$image->is_main) {
            $product->images()
                ->where('is_main', true)
                ->update(['is_main' => false]);

            $image->update(['is_main' => true]);
        }
    }
}