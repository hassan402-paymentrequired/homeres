<?php

use App\Models\Product;
use App\Services\ProductImageSync;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

uses(RefreshDatabase::class);

test('product image sync stores an absolute url from the public disk path', function () {
    Storage::fake('public');
    config(['app.url' => 'https://homere.test']);

    $product = Product::factory()->create();
    $file = UploadedFile::fake()->image('sofa.jpg');

    $request = Request::create('/', 'POST', [], [], ['images' => [$file]]);

    app(ProductImageSync::class)->sync($product, $request);

    $image = $product->fresh()->images()->first();

    expect($image)->not->toBeNull()
        ->and($image->path)->not->toBeNull()
        ->and($image->url)->toStartWith('https://homere.test')
        ->and($image->url)->toContain('/storage/');
});
