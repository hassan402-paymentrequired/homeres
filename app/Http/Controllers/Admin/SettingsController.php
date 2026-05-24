<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateStoreSettingsRequest;
use App\Models\StoreSetting;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class SettingsController extends Controller
{
    public function edit(): Response
    {
        $settings = StoreSetting::current();

        return Inertia::render('admin/settings/form', [
            'settings' => $this->serialize($settings),
            'breadcrumbs' => [
                ['id' => '', 'name' => 'Dashboard', 'href' => route('admin.dashboard')],
                ['id' => 'settings', 'name' => 'Settings', 'href' => route('admin.settings.edit')],
            ],
        ]);
    }

    public function update(UpdateStoreSettingsRequest $request): RedirectResponse
    {
        StoreSetting::current()->update($request->validated());

        return redirect()
            ->route('admin.settings.edit')
            ->with('success', 'Settings saved.');
    }

    /**
     * @return array<string, mixed>
     */
    private function serialize(StoreSetting $settings): array
    {
        return [
            'store_name' => $settings->store_name,
            'contact_email' => $settings->contact_email,
            'contact_phone' => $settings->contact_phone,
            'default_product_status' => $settings->default_product_status,
            'invoice_due_days' => (int) ($settings->invoice_due_days ?? 14),
            'invoice_default_notes' => $settings->invoice_default_notes,
            'invoice_payment_instructions' => $settings->invoice_payment_instructions,
        ];
    }
}
