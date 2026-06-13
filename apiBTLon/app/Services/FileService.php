<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

;

class FileService
{
    /**
     * Upload a file to a specified disk and folder path.
     * @param mixed $file
     * @param string $folder
     * @param string $disk
     * @return bool|string|null
     */
    public function upload(?UploadedFile $file, string $folder = 'uploads', string $disk = 'public'): ?string
    {
        if (!$file) {
            return null;
        }
        return $file->store($folder, $disk);
    }

    public function delete(?string $path, string $disk = 'public'): bool
    {
        if (!$path) {
            return false;
        }
        return Storage::disk($disk)->delete($path);
    }
}