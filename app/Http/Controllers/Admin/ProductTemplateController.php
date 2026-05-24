<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreProductTemplateRequest;
use App\Http\Requests\Admin\UpdateProductTemplateRequest;
use App\Models\Category;
use App\Models\ProductTemplate;
use App\Services\ProductTemplateFieldNormalizer;
use App\Services\ProductTemplateSlugGenerator;
use App\Support\AdminPagination;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductTemplateController extends Controller
{
    public function __construct(
        private ProductTemplateSlugGenerator $slugGenerator,
        private ProductTemplateFieldNormalizer $fieldNormalizer,
    ) {}

    public function index(): Response
    {
        $templates = ProductTemplate::query()
            ->withCount('categories')
            ->orderBy('name')
            ->paginate(AdminPagination::PER_PAGE)
            ->through(fn (ProductTemplate $template): array => $this->serializeRow($template));

        return Inertia::render('admin/product-templates/index', [
            'templates' => $templates,
        ]);
    }

    public function show(ProductTemplate $productTemplate): Response
    {
        $productTemplate->loadCount('categories');

        $categories = Category::query()
            ->where('product_template_id', $productTemplate->id)
            ->ordered()
            ->paginate(AdminPagination::PER_PAGE)
            ->through(fn (Category $category): array => [
                'id' => $category->id,
                'name' => $category->name,
            ]);

        return Inertia::render('admin/product-templates/show', [
            'template' => $this->serialize($productTemplate),
            'stats' => [
                'categories_count' => (int) $productTemplate->categories_count,
            ],
            'categories' => $categories,
            'breadcrumbs' => $this->breadcrumbs($productTemplate),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/product-templates/form', [
            'template' => null,
            'breadcrumbs' => [
                ['id' => '', 'name' => 'Product templates', 'href' => route('admin.product-templates.index')],
                ['id' => 'create', 'name' => 'Add template', 'href' => route('admin.product-templates.create')],
            ],
        ]);
    }

    public function store(StoreProductTemplateRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $template = ProductTemplate::query()->create([
            ...$this->normalizePayload($request, $validated),
            'slug' => $this->slugGenerator->generate($validated['name']),
            'is_system' => false,
        ]);

        return redirect()
            ->route('admin.product-templates.show', $template)
            ->with('success', 'Product template created.');
    }

    public function edit(ProductTemplate $productTemplate): Response
    {
        return Inertia::render('admin/product-templates/form', [
            'template' => $this->serialize($productTemplate),
            'breadcrumbs' => [
                ...$this->breadcrumbs($productTemplate),
                ['id' => 'edit', 'name' => 'Edit', 'href' => route('admin.product-templates.edit', $productTemplate)],
            ],
        ]);
    }

    public function update(UpdateProductTemplateRequest $request, ProductTemplate $productTemplate): RedirectResponse
    {
        $productTemplate->update($this->normalizePayload($request, $request->validated()));

        return redirect()
            ->route('admin.product-templates.show', $productTemplate)
            ->with('success', 'Product template updated.');
    }

    public function destroy(ProductTemplate $productTemplate): RedirectResponse
    {
        if ($productTemplate->categories()->exists()) {
            return back()->with('error', 'Reassign categories to another template before deleting this one.');
        }

        $productTemplate->delete();

        return redirect()
            ->route('admin.product-templates.index')
            ->with('success', 'Product template deleted.');
    }

    /**
     * @return array<string, mixed>
     */
    private function serialize(ProductTemplate $template): array
    {
        return [
            'id' => $template->id,
            'slug' => $template->slug,
            'name' => $template->name,
            'description' => $template->description,
            'spec_fields' => $template->spec_fields ?? [],
            'variant_options' => $template->variant_options ?? [],
            'rules' => $this->normalizeRules($template->rules ?? []),
            'is_system' => $template->is_system,
            'created_at' => $template->created_at?->toIso8601String(),
            'updated_at' => $template->updated_at?->toIso8601String(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function serializeRow(ProductTemplate $template): array
    {
        $specFields = $template->spec_fields ?? [];
        $variantOptions = $template->variant_options ?? [];

        return [
            ...$this->serialize($template),
            'categories_count' => (int) ($template->categories_count ?? 0),
            'spec_fields_count' => count($specFields),
            'variant_options_count' => count($variantOptions),
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
            'spec_fields' => $this->fieldNormalizer->normalize(
                is_array($validated['spec_fields'] ?? null) ? $validated['spec_fields'] : [],
            ),
            'variant_options' => $this->fieldNormalizer->normalize(
                is_array($validated['variant_options'] ?? null) ? $validated['variant_options'] : [],
            ),
            'rules' => [
                'pricing_mode' => $validated['rules']['pricing_mode'] ?? 'fixed',
                'requires_brand' => $request->boolean('rules.requires_brand'),
                'min_images' => (int) ($validated['rules']['min_images'] ?? 0),
            ],
        ];
    }

    /**
     * @param  array<string, mixed>  $rules
     * @return array<string, mixed>
     */
    private function normalizeRules(array $rules): array
    {
        return [
            'pricing_mode' => $rules['pricing_mode'] ?? 'fixed',
            'requires_brand' => (bool) ($rules['requires_brand'] ?? false),
            'min_images' => (int) ($rules['min_images'] ?? 0),
        ];
    }

    /**
     * @return array<int, array{id: string, name: string, href: string}>
     */
    private function breadcrumbs(ProductTemplate $template): array
    {
        return [
            ['id' => '', 'name' => 'Product templates', 'href' => route('admin.product-templates.index')],
            ['id' => $template->id, 'name' => $template->name, 'href' => route('admin.product-templates.show', $template)],
        ];
    }
}
