<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreBrandRequest;
use App\Http\Requests\Admin\UpdateBrandRequest;
use App\Models\Brand;
use App\Services\BrandCatalog;
use App\Services\BrandHandleGenerator;
use App\Support\AdminPagination;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BrandController extends Controller
{
    public function __construct(
        private BrandCatalog $catalog,
        private BrandHandleGenerator $handleGenerator,
    ) {}

    public function index(): Response
    {
        $brands = Brand::query()
            ->ordered()
            ->paginate(AdminPagination::PER_PAGE)
            ->through(fn (Brand $brand): array => $this->serializeCard($brand));

        return Inertia::render('admin/brands/index', [
            'brands' => $brands,
        ]);
    }

    public function show(Brand $brand): Response
    {
        return Inertia::render('admin/brands/show', [
            'brand' => $this->serializeCard($brand),
            'stats' => $this->stats($brand),
            'breadcrumbs' => $this->breadcrumbs($brand),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/brands/form', [
            'brand' => null,
            'breadcrumbs' => [
                ['id' => '', 'name' => 'Brands', 'href' => route('admin.brands.index')],
                ['id' => 'create', 'name' => 'Add brand', 'href' => route('admin.brands.create')],
            ],
        ]);
    }

    public function store(StoreBrandRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $brand = Brand::query()->create([
            ...$this->normalizePayload($request, $validated),
            'handle' => $this->handleGenerator->generate($validated['name']),
            'sort_order' => $this->nextSortOrder(),
        ]);

        return redirect()
            ->route('admin.brands.show', $brand)
            ->with('success', 'Brand created.');
    }

    public function edit(Brand $brand): Response
    {
        return Inertia::render('admin/brands/form', [
            'brand' => $this->serialize($brand),
            'breadcrumbs' => [
                ...$this->breadcrumbs($brand),
                ['id' => 'edit', 'name' => 'Edit', 'href' => route('admin.brands.edit', $brand)],
            ],
        ]);
    }

    public function update(UpdateBrandRequest $request, Brand $brand): RedirectResponse
    {
        $brand->update($this->normalizePayload($request, $request->validated()));

        return redirect()
            ->route('admin.brands.show', $brand)
            ->with('success', 'Brand updated.');
    }

    public function destroy(Brand $brand): RedirectResponse
    {
        $brand->delete();

        return redirect()
            ->route('admin.brands.index')
            ->with('success', 'Brand deleted.');
    }

    /**
     * @return array<string, mixed>
     */
    private function serialize(Brand $brand): array
    {
        return [
            'id' => $brand->id,
            'name' => $brand->name,
            'description' => $brand->description,
            'is_active' => $brand->is_active,
            'show_in_nav' => $brand->show_in_nav,
            'created_at' => $brand->created_at?->toIso8601String(),
            'updated_at' => $brand->updated_at?->toIso8601String(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function serializeCard(Brand $brand): array
    {
        return [
            ...$this->serialize($brand),
            'product_count' => $this->catalog->productCountFor($brand->handle),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function stats(Brand $brand): array
    {
        return [
            'product_count' => $this->catalog->productCountFor($brand->handle),
        ];
    }

    /**
     * @return array<int, array{id: string, name: string, href: string}>
     */
    private function breadcrumbs(Brand $brand): array
    {
        return [
            ['id' => '', 'name' => 'Brands', 'href' => route('admin.brands.index')],
            ['id' => $brand->id, 'name' => $brand->name, 'href' => route('admin.brands.show', $brand)],
        ];
    }

    /**
     * @param  array<string, mixed>  $validated
     * @return array<string, mixed>
     */
    private function normalizePayload(Request $request, array $validated): array
    {
        return [
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'is_active' => $request->boolean('is_active'),
            'show_in_nav' => $request->boolean('show_in_nav'),
        ];
    }

    private function nextSortOrder(): int
    {
        $max = Brand::query()->max('sort_order');

        return ((int) $max) + 1;
    }
}
