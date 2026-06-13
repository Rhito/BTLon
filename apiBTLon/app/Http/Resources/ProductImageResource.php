<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class ProductImageResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'product_id' => $this->product_id,
            'img_url' => $this->img_url ? asset(Storage::url($this->img_url)) : null,
            'thumbnail_url' => $this->thumbnail_url ? asset(Storage::url($this->thumbnail_url)) : null,
            'is_main' => (bool) $this->is_main,
        ];
    }
}
