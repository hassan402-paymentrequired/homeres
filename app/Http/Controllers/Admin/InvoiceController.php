<?php

namespace App\Http\Controllers\Admin;

use App\Enums\InvoiceStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\SendInvoiceRequest;
use App\Http\Requests\Admin\StoreInvoiceRequest;
use App\Http\Requests\Admin\UpdateInvoiceComposeRequest;
use App\Http\Requests\Admin\UpdateInvoiceRequest;
use App\Models\Invoice;
use App\Models\InvoiceItem;
use App\Models\Order;
use App\Models\StoreSetting;
use App\Services\InvoiceComposeService;
use App\Services\InvoiceNumberGenerator;
use App\Services\InvoiceSender;
use App\Support\AdminPagination;
use App\Support\InvoicePreviewBuilder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class InvoiceController extends Controller
{
    public function __construct(
        private InvoiceNumberGenerator $numberGenerator,
    ) {}

    public function index(): Response
    {
        $invoices = Invoice::query()
            ->with(['order:id,order_number'])
            ->withCount('items')
            ->recent()
            ->paginate(AdminPagination::PER_PAGE)
            ->through(fn (Invoice $invoice): array => $this->serializeSummary($invoice));

        return Inertia::render('admin/invoices/index', [
            'invoices' => $invoices,
        ]);
    }

    public function create(Request $request, InvoiceComposeService $composeService): Response
    {
        $prefill = null;
        $orderId = $request->string('order_id')->toString();

        if ($orderId !== '') {
            $order = Order::query()->with('items')->find($orderId);

            if ($order !== null) {
                $prefill = $composeService->prefillFromOrder($order);
            }
        }

        if ($prefill === null && $request->filled('duplicate')) {
            $source = Invoice::query()->with('items')->find($request->string('duplicate')->toString());

            if ($source !== null) {
                $prefill = $composeService->prefillFromInvoice($source);
            }
        }

        $settings = StoreSetting::current();

        if ($prefill === null && filled($settings->invoice_default_notes)) {
            $prefill = [
                'order_id' => null,
                'invoice_number' => $this->numberGenerator->generate(),
                'customer_name' => '',
                'customer_email' => null,
                'customer_phone' => null,
                'billing_address' => null,
                'billing_city' => null,
                'billing_state' => null,
                'due_date' => $settings->defaultInvoiceDueDate()->toDateString(),
                'discount' => 0,
                'tax' => 0,
                'customer_note' => $settings->invoice_default_notes,
                'lines' => [],
            ];
        }

        return Inertia::render('admin/invoices/create', $this->composePageProps(
            suggestedNumber: $prefill['invoice_number'] ?? $this->numberGenerator->generate(),
            prefill: $prefill,
            editInvoice: null,
        ));
    }

    public function store(StoreInvoiceRequest $request, InvoiceComposeService $composeService): RedirectResponse
    {
        $invoice = $composeService->store($request->validated());

        $message = $request->validated('intent') === 'send'
            ? 'Invoice created and sent.'
            : 'Invoice saved as draft.';

        return redirect()
            ->route('admin.invoices.show', $invoice)
            ->with('success', $message);
    }

    public function edit(Invoice $invoice, InvoiceComposeService $composeService): Response
    {
        abort_unless($invoice->status === InvoiceStatus::Draft, 403);

        return Inertia::render('admin/invoices/create', $this->composePageProps(
            suggestedNumber: $invoice->invoice_number,
            prefill: null,
            editInvoice: $composeService->editPayload($invoice),
        ));
    }

    public function updateCompose(
        UpdateInvoiceComposeRequest $request,
        Invoice $invoice,
        InvoiceComposeService $composeService,
    ): RedirectResponse {
        abort_unless($invoice->status === InvoiceStatus::Draft, 403);

        $invoice = $composeService->update($invoice, $request->validated());

        $message = $request->validated('intent') === 'send'
            ? 'Invoice updated and sent.'
            : 'Invoice draft saved.';

        return redirect()
            ->route('admin.invoices.show', $invoice)
            ->with('success', $message);
    }

    public function show(Invoice $invoice): Response
    {
        $invoice->load([
            'order:id,order_number',
            'items' => fn ($query) => $query->orderBy('sort_order'),
        ]);

        return Inertia::render('admin/invoices/show', [
            'invoice' => $this->serialize($invoice),
            'preview' => InvoicePreviewBuilder::fromInvoice($invoice),
            'statusOptions' => $this->statusOptions(),
            'canSend' => $invoice->status !== InvoiceStatus::Void,
            'canEdit' => $invoice->status === InvoiceStatus::Draft,
            'canDuplicate' => true,
            'breadcrumbs' => $this->breadcrumbs($invoice),
        ]);
    }

    public function send(
        SendInvoiceRequest $request,
        Invoice $invoice,
        InvoiceSender $invoiceSender,
    ): RedirectResponse {
        $validated = $request->validated();

        $invoiceSender->send(
            $invoice,
            $validated['recipient_email'],
            $validated['message'] ?? null,
        );

        return redirect()
            ->route('admin.invoices.show', $invoice)
            ->with('success', "Invoice sent to {$validated['recipient_email']}.");
    }

    public function update(UpdateInvoiceRequest $request, Invoice $invoice): RedirectResponse
    {
        $validated = $request->validated();
        $status = InvoiceStatus::from($validated['status']);

        $attributes = [
            'status' => $status,
            'admin_note' => $validated['admin_note'] ?? null,
            'due_at' => isset($validated['due_at'])
                ? Carbon::parse($validated['due_at'])
                : $invoice->due_at,
        ];

        $attributes = array_merge($attributes, $this->statusTimestamps($invoice, $status));

        $invoice->update($attributes);

        return redirect()
            ->route('admin.invoices.show', $invoice)
            ->with('success', 'Invoice updated.');
    }

    /**
     * @return array<string, mixed>
     */
    private function statusTimestamps(Invoice $invoice, InvoiceStatus $status): array
    {
        $timestamps = [];

        if ($status === InvoiceStatus::Sent && $invoice->issued_at === null) {
            $timestamps['issued_at'] = now();
        }

        if ($status === InvoiceStatus::Paid && $invoice->paid_at === null) {
            $timestamps['paid_at'] = now();
        }

        if ($status === InvoiceStatus::Draft) {
            $timestamps['issued_at'] = null;
            $timestamps['paid_at'] = null;
        }

        if ($status === InvoiceStatus::Void) {
            $timestamps['paid_at'] = null;
        }

        return $timestamps;
    }

    /**
     * @return array<string, mixed>
     */
    private function serializeSummary(Invoice $invoice): array
    {
        return [
            'id' => $invoice->id,
            'invoice_number' => $invoice->invoice_number,
            'status' => $invoice->status->value,
            'status_label' => $invoice->status->label(),
            'customer_name' => $invoice->customer_name,
            'customer_email' => $invoice->customer_email,
            'order_id' => $invoice->order_id,
            'order_number' => $invoice->order?->order_number,
            'items_count' => $invoice->items_count,
            'total' => $invoice->total !== null ? (float) $invoice->total : null,
            'has_price_on_request_items' => $invoice->has_price_on_request_items,
            'currency' => $invoice->currency,
            'issued_at' => $invoice->issued_at?->toIso8601String(),
            'due_at' => $invoice->due_at?->toIso8601String(),
            'paid_at' => $invoice->paid_at?->toIso8601String(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function serialize(Invoice $invoice): array
    {
        return [
            'id' => $invoice->id,
            'invoice_number' => $invoice->invoice_number,
            'status' => $invoice->status->value,
            'status_label' => $invoice->status->label(),
            'order_id' => $invoice->order_id,
            'order_number' => $invoice->order?->order_number,
            'customer_name' => $invoice->customer_name,
            'customer_email' => $invoice->customer_email,
            'customer_phone' => $invoice->customer_phone,
            'billing_address' => $invoice->billing_address,
            'billing_city' => $invoice->billing_city,
            'billing_state' => $invoice->billing_state,
            'customer_note' => $invoice->customer_note,
            'admin_note' => $invoice->admin_note,
            'subtotal' => $invoice->subtotal !== null ? (float) $invoice->subtotal : null,
            'discount' => (float) ($invoice->discount ?? 0),
            'tax' => (float) ($invoice->tax ?? 0),
            'shipping_total' => $invoice->shipping_total !== null ? (float) $invoice->shipping_total : null,
            'total' => $invoice->total !== null ? (float) $invoice->total : null,
            'has_price_on_request_items' => $invoice->has_price_on_request_items,
            'currency' => $invoice->currency,
            'issued_at' => $invoice->issued_at?->toIso8601String(),
            'due_at' => $invoice->due_at?->toIso8601String(),
            'paid_at' => $invoice->paid_at?->toIso8601String(),
            'items' => $invoice->items->map(fn (InvoiceItem $item): array => $this->serializeItem($item))->values()->all(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function serializeItem(InvoiceItem $item): array
    {
        return [
            'id' => $item->id,
            'product_name' => $item->product_name,
            'variant_name' => $item->variant_name,
            'sku' => $item->sku,
            'unit_price' => $item->unit_price !== null ? (float) $item->unit_price : null,
            'price_on_request' => $item->price_on_request,
            'quantity' => $item->quantity,
            'line_total' => $item->line_total !== null ? (float) $item->line_total : null,
        ];
    }

    /**
     * @return array<int, array{value: string, label: string}>
     */
    private function statusOptions(): array
    {
        return array_map(
            fn (InvoiceStatus $status): array => [
                'value' => $status->value,
                'label' => $status->label(),
            ],
            InvoiceStatus::cases(),
        );
    }

    /**
     * @return array<string, mixed>
     */
    private function composePageProps(
        string $suggestedNumber,
        ?array $prefill,
        ?array $editInvoice,
    ): array {
        return [
            'storeName' => StoreSetting::current()->displayName(),
            'suggested_invoice_number' => $suggestedNumber,
            'prefill' => $prefill,
            'edit_invoice' => $editInvoice,
            'payment_defaults' => InvoicePreviewBuilder::paymentDefaults(),
            'breadcrumbs' => [
                ['id' => '', 'name' => 'Dashboard', 'href' => route('admin.dashboard')],
                ['id' => 'invoices', 'name' => 'Invoices', 'href' => route('admin.invoices.index')],
                [
                    'id' => 'compose',
                    'name' => $editInvoice !== null ? 'Edit invoice' : 'New invoice',
                    'href' => $editInvoice !== null
                        ? route('admin.invoices.edit', $editInvoice['id'])
                        : route('admin.invoices.create'),
                ],
            ],
        ];
    }

    /**
     * @return array<int, array{id: string, name: string, href: string}>
     */
    private function breadcrumbs(Invoice $invoice): array
    {
        return [
            ['id' => '', 'name' => 'Dashboard', 'href' => route('admin.dashboard')],
            ['id' => 'invoices', 'name' => 'Invoices', 'href' => route('admin.invoices.index')],
            ['id' => $invoice->id, 'name' => $invoice->invoice_number, 'href' => route('admin.invoices.show', $invoice)],
        ];
    }
}
