<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class CategoryIndexRequest extends FormRequest
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
            'per_page' => [
                'nullable',
                'integer',
                'min:1'
            ],
            'filter' => [
                'nullable',
                'string',
                'max:255'
            ],
            'sort_order' => [
                'nullable',
                'string',
                'in:asc,desc',
            ],
            'trashed' => [
                'nullable',
                'in:only,with'
            ],
            'sort_by' => [
                'nullable',
                'string',
                'in:id,name,slug,is_active'
            ],
        ];
    }
}
