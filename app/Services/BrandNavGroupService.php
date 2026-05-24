<?php

namespace App\Services;

use App\Models\Brand;
use Illuminate\Support\Collection;

class BrandNavGroupService
{
    /**
     * @var list<array{name: string, from: string, to: string, handle: string}>
     */
    private array $groups = [
        ['name' => 'Brands A–B', 'from' => 'A', 'to' => 'B', 'handle' => 'nav-brands-a-b'],
        ['name' => 'Brands C–I', 'from' => 'C', 'to' => 'I', 'handle' => 'nav-brands-c-i'],
        ['name' => 'Brands J–R', 'from' => 'J', 'to' => 'R', 'handle' => 'nav-brands-j-r'],
        ['name' => 'Brands S–Z', 'from' => 'S', 'to' => 'Z', 'handle' => 'nav-brands-s-z'],
    ];

    public function seedGroups(): void
    {
        $sort = 0;

        foreach ($this->groups as $group) {
            $parent = Brand::query()->updateOrCreate(
                ['handle' => $group['handle']],
                [
                    'name' => $group['name'],
                    'description' => 'Storefront navigation group',
                    'sort_order' => $sort++,
                    'is_active' => true,
                    'show_in_nav' => true,
                    'is_parent' => true,
                    'parent_id' => null,
                ],
            );

            $this->assignBrandsToGroup($parent, $group['from'], $group['to']);
        }

        $this->assignOrphansToFirstGroup();
    }

    private function assignBrandsToGroup(Brand $parent, string $from, string $to): void
    {
        Brand::query()
            ->where('is_parent', false)
            ->whereNull('parent_id')
            ->ordered()
            ->get()
            ->filter(fn (Brand $brand): bool => $this->letterInRange($brand->name, $from, $to))
            ->each(fn (Brand $brand): bool => $brand->update(['parent_id' => $parent->id]));
    }

    private function assignOrphansToFirstGroup(): void
    {
        $firstGroup = Brand::query()
            ->where('is_parent', true)
            ->ordered()
            ->first();

        if ($firstGroup === null) {
            return;
        }

        Brand::query()
            ->where('is_parent', false)
            ->whereNull('parent_id')
            ->update(['parent_id' => $firstGroup->id]);
    }

    private function letterInRange(string $name, string $from, string $to): bool
    {
        $letter = strtoupper(substr(trim($name), 0, 1));

        if (! ctype_alpha($letter)) {
            return $from === 'A';
        }

        return $letter >= $from && $letter <= $to;
    }

    /**
     * @return Collection<int, Brand>
     */
    public function navGroupOptions(): Collection
    {
        return Brand::query()
            ->where('is_parent', true)
            ->ordered()
            ->get(['id', 'name']);
    }
}
