<?php

namespace App\Console\Commands;

use App\Services\BrandNavGroupService;
use Illuminate\Console\Command;

class SyncBrandNavGroupsCommand extends Command
{
    protected $signature = 'brands:sync-nav-groups';

    protected $description = 'Create or refresh storefront brand navigation groups and assign brands';

    public function handle(BrandNavGroupService $service): int
    {
        $service->seedGroups();

        $this->info('Brand navigation groups synced.');

        return self::SUCCESS;
    }
}
