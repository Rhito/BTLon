<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class OrderItemResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $mainImage = $this->product?->images?->where('is_main', true)->first()
            ?? $this->product?->images?->first();
        $rawPath = $mainImage?->thumbnail_url ?? $mainImage?->img_url;
        $imgUrl = $rawPath
            ? (str_starts_with($rawPath, 'http') ? $rawPath : asset(Storage::url($rawPath)))
            : null;
        return [
            'id' => $this->id,
            'product_id' => $this->product_id,
            'product_name' => $this->product?->name ?? 'The product has been deleted or does not exist.',
            'quantity' => (int) $this->quantity,
            'price' => (float) $this->price,
            'sub_total' => (float) ($this->price * $this->quantity),
            'thumbnail_url' => $imgUrl,
        ];
    }
}
