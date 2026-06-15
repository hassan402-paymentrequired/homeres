<?php

namespace App\Services;

use App\Models\Category;
use App\Models\ProductTemplate;

class CategoryNavGroupService
{
    private const PARENT_HANDLE = 'decor-accessories';

    private const GROUP_HANDLE = 'home-accessories';

    private const GROUP_NAME = 'HOME ACCESSORIES';

    private const NAV_GROUP_LABEL = 'Home Accessories';

    /**
     * Leaf collections shown under the Home Accessories nav column.
     *
     * @var list<string>
     */
    private const CHILD_HANDLES = [
        'candle-holders-accessories',
        'coasters',
        'boxes',
        'games',
        'watch-winders',
        'objects',
        'picture-frames',
        'bowls',
        'wallpaper',
    ];

    public function syncHomeAccessoriesGroup(): void
    {
        $parent = Category::query()
            ->where('handle', self::PARENT_HANDLE)
            ->firstOrFail();

        $group = Category::query()->updateOrCreate(
            ['handle' => self::GROUP_HANDLE],
            [
                'parent_id' => $parent->id,
                'product_template_id' => $this->resolveTemplateId('simple'),
                'name' => self::GROUP_NAME,
                'nav_group_label' => self::NAV_GROUP_LABEL,
                'sort_order' => 0,
                'is_active' => true,
                'show_in_nav' => true,
                'is_aggregate' => true,
            ],
        );

        foreach (self::CHILD_HANDLES as $sortOrder => $handle) {
            Category::query()
                ->where('handle', $handle)
                ->update([
                    'parent_id' => $group->id,
                    'nav_group_label' => null,
                    'sort_order' => $sortOrder,
                    'show_in_nav' => true,
                ]);
        }

        $this->renumberSiblingGroups($parent->id, $group->id);
    }

    private function renumberSiblingGroups(string $parentId, string $groupId): void
    {
        $siblingHandles = [
            'coffee-table-books-1',
            'art-mirrors',
            'textiles',
            'dining-serveware',
        ];

        foreach ($siblingHandles as $index => $handle) {
            Category::query()
                ->where('handle', $handle)
                ->where('parent_id', $parentId)
                ->update(['sort_order' => $index + 1]);
        }

        Category::query()
            ->where('id', $groupId)
            ->update(['sort_order' => 0]);
    }

    private function resolveTemplateId(string $slug): string
    {
        return ProductTemplate::query()
            ->where('slug', $slug)
            ->value('id')
            ?? ProductTemplate::query()->value('id');
    }
}
