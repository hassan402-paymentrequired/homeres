<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\CatalogProductImporter;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ProductImportController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/products/import', [
            'collections' => $this->collectionOptions(),
        ]);
    }

    public function store(Request $request, CatalogProductImporter $importer): RedirectResponse
    {
        $validated = $request->validate([
            'collection' => ['nullable', 'string', 'max:255'],
            'limit' => ['nullable', 'integer', 'min:0', 'max:5000'],
            'dry_run' => ['boolean'],
            'publish' => ['boolean'],
            'refresh' => ['boolean'],
        ]);

        $collection = filled($validated['collection'] ?? null)
            ? (string) $validated['collection']
            : null;

        if ($collection !== null && ! $this->collectionExists($collection)) {
            return back()->withErrors([
                'collection' => 'Unknown collection handle.',
            ]);
        }

        $result = $importer->import(
            collection: $collection,
            limit: (int) ($validated['limit'] ?? 0),
            dryRun: $request->boolean('dry_run'),
            publish: $request->boolean('publish'),
            refresh: $request->boolean('refresh'),
        );

        return back()->with('importResult', $result);
    }

    /**
     * @return list<array{handle: string, label: string}>
     */
    private function collectionOptions(): array
    {
        $directory = public_path('output/collections');

        if (! is_dir($directory)) {
            return [];
        }

        return collect(File::files($directory))
            ->filter(fn (\SplFileInfo $file): bool => $file->getExtension() === 'json')
            ->map(function (\SplFileInfo $file): array {
                $handle = $file->getFilenameWithoutExtension();
                $label = Str::headline(str_replace('-', ' ', $handle));

                $decoded = json_decode((string) file_get_contents($file->getPathname()), true);

                if (is_array($decoded) && filled($decoded['label'] ?? null)) {
                    $label = (string) $decoded['label'];
                }

                return [
                    'handle' => $handle,
                    'label' => $label,
                ];
            })
            ->sortBy('label')
            ->values()
            ->all();
    }

    private function collectionExists(string $handle): bool
    {
        return is_file(public_path("output/collections/{$handle}.json"));
    }
}
