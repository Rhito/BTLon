<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
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
            'order_code' => $this->order_code,

            'customer_name' => $this->customer_name,
            'customer_email' => $this->customer_email,
            'customer_phone' => $this->customer_phone,
            'customer_address' => $this->customer_address,
            'note' => $this->note,

            'payment_method' => $this->payment_method,
            'total_amount' => (float) $this->total_amount,

            'status' => $this->status->value ?? $this->status,
            'status_text' => method_exists($this->status, 'label') ? $this->status->label() : $this->status,
            'cancel_reason' => $this->cancel_reason,

            'created_at' => $this->created_at?->format('d/m/Y H:i:s'),
            'updated_at' => $this->updated_at?->format('d/m/Y H:i:s'),

            'items' => OrderItemResource::collection($this->whenLoaded('orderItems')),
        ];
    }
}
