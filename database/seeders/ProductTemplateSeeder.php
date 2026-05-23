<?php

namespace Database\Seeders;

use App\Models\ProductTemplate;
use Illuminate\Database\Seeder;

class ProductTemplateSeeder extends Seeder
{
    /**
     * @var array<string, array<string, mixed>>
     */
    private array $templates = [
        'simple' => [
            'name' => 'Simple product',
            'description' => 'Single SKU luxury pieces with structured specs and optional made-to-order pricing.',
            'variant_options' => [],
            'spec_fields' => [
                ['key' => 'dimensions', 'label' => 'Dimensions', 'type' => 'text', 'required' => false, 'position' => 1],
                ['key' => 'materials', 'label' => 'Materials / finish', 'type' => 'textarea', 'required' => false, 'position' => 2],
                ['key' => 'general_info', 'label' => 'General info', 'type' => 'textarea', 'required' => false, 'position' => 3],
                ['key' => 'indoor_outdoor', 'label' => 'Indoor / outdoor', 'type' => 'select', 'required' => false, 'position' => 4, 'options' => ['Indoor', 'Outdoor', 'Indoor/outdoor']],
            ],
            'rules' => [
                'pricing_mode' => 'on_request',
                'requires_brand' => true,
                'min_images' => 1,
            ],
        ],
        'textile' => [
            'name' => 'Textile',
            'description' => 'Cushions, plaids, bedding, and rugs with size and colour variants.',
            'variant_options' => [
                ['key' => 'size', 'label' => 'Size', 'type' => 'select', 'required' => true, 'position' => 1],
                ['key' => 'color', 'label' => 'Colour', 'type' => 'swatch', 'required' => true, 'position' => 2],
            ],
            'spec_fields' => [
                ['key' => 'fabric_composition', 'label' => 'Fabric composition', 'type' => 'text', 'required' => false, 'position' => 1],
                ['key' => 'care_instructions', 'label' => 'Care instructions', 'type' => 'textarea', 'required' => false, 'position' => 2],
            ],
            'rules' => [
                'pricing_mode' => 'fixed',
                'requires_brand' => true,
                'min_images' => 1,
            ],
        ],
        'fragrance' => [
            'name' => 'Home fragrance',
            'description' => 'Candles, sprays, diffusers, and refills with size or capacity tiers.',
            'variant_options' => [
                ['key' => 'size', 'label' => 'Size / capacity', 'type' => 'select', 'required' => true, 'position' => 1],
            ],
            'spec_fields' => [
                ['key' => 'scent_notes', 'label' => 'Scent notes', 'type' => 'textarea', 'required' => false, 'position' => 1],
                ['key' => 'burn_time', 'label' => 'Burn time', 'type' => 'text', 'required' => false, 'position' => 2],
                ['key' => 'weight', 'label' => 'Weight', 'type' => 'text', 'required' => false, 'position' => 3],
            ],
            'rules' => [
                'pricing_mode' => 'fixed',
                'requires_brand' => true,
                'min_images' => 1,
            ],
        ],
        'lighting' => [
            'name' => 'Lighting',
            'description' => 'Lamps and fixtures with technical configuration options.',
            'variant_options' => [
                ['key' => 'color_temperature', 'label' => 'Colour temperature', 'type' => 'select', 'required' => false, 'position' => 1],
                ['key' => 'model', 'label' => 'Model / configuration', 'type' => 'select', 'required' => false, 'position' => 2],
            ],
            'spec_fields' => [
                ['key' => 'voltage', 'label' => 'Voltage', 'type' => 'text', 'required' => false, 'position' => 1],
                ['key' => 'lamp_holder', 'label' => 'Lamp holder', 'type' => 'text', 'required' => false, 'position' => 2],
                ['key' => 'max_wattage', 'label' => 'Max wattage', 'type' => 'text', 'required' => false, 'position' => 3],
                ['key' => 'bulbs_included', 'label' => 'Bulbs included', 'type' => 'select', 'required' => false, 'position' => 4, 'options' => ['Yes', 'No']],
            ],
            'rules' => [
                'pricing_mode' => 'fixed',
                'requires_brand' => true,
                'min_images' => 1,
            ],
        ],
        'outdoor' => [
            'name' => 'Outdoor furniture',
            'description' => 'Outdoor pieces with size, finish, and optional weatherproof add-ons.',
            'variant_options' => [
                ['key' => 'size', 'label' => 'Size', 'type' => 'select', 'required' => false, 'position' => 1],
                ['key' => 'color', 'label' => 'Colour', 'type' => 'swatch', 'required' => false, 'position' => 2],
                ['key' => 'waterproof_cover', 'label' => 'Waterproof cover', 'type' => 'boolean', 'required' => false, 'position' => 3],
            ],
            'spec_fields' => [
                ['key' => 'materials', 'label' => 'Materials', 'type' => 'textarea', 'required' => false, 'position' => 1],
                ['key' => 'indoor_outdoor', 'label' => 'Usage', 'type' => 'text', 'required' => false, 'position' => 2],
            ],
            'rules' => [
                'pricing_mode' => 'on_request',
                'requires_brand' => true,
                'min_images' => 1,
            ],
        ],
        'book' => [
            'name' => 'Coffee table book',
            'description' => 'Books and limited editions with minimal variant complexity.',
            'variant_options' => [],
            'spec_fields' => [
                ['key' => 'author', 'label' => 'Author / publisher', 'type' => 'text', 'required' => false, 'position' => 1],
                ['key' => 'dimensions', 'label' => 'Dimensions', 'type' => 'text', 'required' => false, 'position' => 2],
                ['key' => 'pages', 'label' => 'Pages', 'type' => 'text', 'required' => false, 'position' => 3],
            ],
            'rules' => [
                'pricing_mode' => 'fixed',
                'requires_brand' => true,
                'min_images' => 1,
            ],
        ],
    ];

    public function run(): void
    {
        foreach ($this->templates as $slug => $template) {
            ProductTemplate::query()->updateOrCreate(
                ['slug' => $slug],
                [
                    ...$template,
                    'is_system' => true,
                ],
            );
        }
    }
}
