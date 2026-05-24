<?php

use App\Services\ProductTemplateFieldNormalizer;

test('product template field normalizer generates keys and options', function () {
    $normalizer = app(ProductTemplateFieldNormalizer::class);

    $fields = $normalizer->normalize([
        [
            'label' => 'Heel Height',
            'type' => 'text',
            'required' => true,
        ],
        [
            'label' => 'Size',
            'key' => 'size',
            'type' => 'select',
            'options' => "Small\nMedium\nLarge",
        ],
    ]);

    expect($fields)->toHaveCount(2)
        ->and($fields[0]['key'])->toBe('heel_height')
        ->and($fields[0]['required'])->toBeTrue()
        ->and($fields[1]['options'])->toBe(['Small', 'Medium', 'Large']);
});
