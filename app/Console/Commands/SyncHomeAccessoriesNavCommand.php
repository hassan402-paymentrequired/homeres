<?php

namespace App\Console\Commands;

use App\Services\CategoryNavGroupService;
use Illuminate\Console\Command;

class SyncHomeAccessoriesNavCommand extends Command
{
    protected $signature = 'categories:sync-home-accessories-nav';

    protected $description = 'Group Home Accessories sub-collections under the HOME ACCESSORIES nav column';

    public function handle(CategoryNavGroupService $service): int
    {
        $service->syncHomeAccessoriesGroup();

        $this->info('Home Accessories navigation group synced.');

        return self::SUCCESS;
    }
}
