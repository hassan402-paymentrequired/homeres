<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\AdminOverviewService;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(AdminOverviewService $overview): Response
    {
        return Inertia::render('admin/dashboard', $overview->dashboard());
    }
}
