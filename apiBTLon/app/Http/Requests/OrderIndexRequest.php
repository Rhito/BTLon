<?php

namespace App\Http\Requests;

use App\Enums\OrderStatus;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class OrderIndexRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'per_page' => ['nullable', 'integer', 'min:1'],
            'filter' => ['nullable', 'string', 'max:255'],
            'sort_order' => ['nullable', 'string', 'in:asc,desc',],
            'trashed' => ['nullable', 'in:only,with'],
            'sort_by' => ['nullable', 'string', 'in:order_code,customer_name,status,payment_method,total_amount'],
            'status' => ['nullable', 'string', Rule::enum(OrderStatus::class)],
            'date_from' => ['nullable', 'date'],
            'date_to' => ['nullable', 'date', 'after_or_equal:date_from'],
        ];
    }
}
