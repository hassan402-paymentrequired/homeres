<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;

class SiteLockHashPasswordCommand extends Command
{
    protected $signature = 'site-lock:hash-password {password : The password to hash}';

    protected $description = 'Generate a bcrypt hash for SITE_LOCK_PASSWORD';

    public function handle(): int
    {
        $hash = Hash::make($this->argument('password'));

        $this->line('Add this to your .env file:');
        $this->newLine();
        $this->line("SITE_LOCK_PASSWORD={$hash}");
        $this->newLine();
        $this->comment('Plain-text passwords also work, but bcrypt hashes are recommended for production.');

        return self::SUCCESS;
    }
}
