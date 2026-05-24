<?php

namespace App\Services;

use App\Enums\InvoiceStatus;
use App\Enums\OrderStatus;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Invoice;
use App\Models\Order;
use App\Models\Product;
use App\Models\ProductTemplate;
use DateTimeInterface;

class AdminOverviewService
{
    /**
     * @return array<string, mixed>
     */
    public function dashboard(): array
    {
        $snapshot = $this->snapshot();

        return [
            'stats' => $snapshot['stats'],
            'recent_orders' => $this->recentOrders(),
            'recent_invoices' => $this->recentInvoices(),
            'orders_by_status' => $snapshot['orders_by_status'],
            'invoices_by_status' => $snapshot['invoices_by_status'],
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function analytics(): array
    {
        $snapshot = $this->snapshot();

        return [
            'stats' => $snapshot['stats'],
            'orders_by_status' => $snapshot['orders_by_status'],
            'invoices_by_status' => $snapshot['invoices_by_status'],
            'monthly_order_totals' => $this->monthlyOrderTotals(months: 6),
            'recent_orders' => $this->recentOrders(limit: 10),
            'recent_invoices' => $this->recentInvoices(limit: 10),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function snapshot(): array
    {
        $thirtyDaysAgo = now()->subDays(30);

        return [
            'stats' => [
                'categories_count' => Category::query()->count(),
                'brands_count' => Brand::query()->count(),
                'products_count' => Product::query()->count(),
                'draft_products_count' => Product::query()->where('is_active', false)->count(),
                'product_templates_count' => ProductTemplate::query()->count(),
                'orders_count' => Order::query()->count(),
                'orders_pending_count' => Order::query()->where('status', OrderStatus::Pending)->count(),
                'orders_last_30_days' => Order::query()->where('placed_at', '>=', $thirtyDaysAgo)->count(),
                'invoices_count' => Invoice::query()->count(),
                'invoices_draft_count' => Invoice::query()->where('status', InvoiceStatus::Draft)->count(),
                'invoices_paid_count' => Invoice::query()->where('status', InvoiceStatus::Paid)->count(),
                'orders_revenue_total' => $this->sumOrderTotals(),
                'orders_revenue_last_30_days' => $this->sumOrderTotals(since: $thirtyDaysAgo),
                'invoices_collected_total' => $this->sumInvoiceTotals(InvoiceStatus::Paid),
                'invoices_outstanding_total' => $this->sumInvoiceTotals([InvoiceStatus::Sent, InvoiceStatus::Draft]),
            ],
            'orders_by_status' => $this->countsByStatus(Order::query(), 'status', OrderStatus::cases()),
            'invoices_by_status' => $this->countsByStatus(Invoice::query(), 'status', InvoiceStatus::cases()),
        ];
    }

    private function sumOrderTotals(?DateTimeInterface $since = null): float
    {
        $query = Order::query()
            ->whereNot('status', OrderStatus::Cancelled)
            ->whereNotNull('total');

        if ($since !== null) {
            $query->where('placed_at', '>=', $since);
        }

        return (float) ($query->sum('total') ?? 0);
    }

    /**
     * @param  InvoiceStatus|array<int, InvoiceStatus>  $statuses
     */
    private function sumInvoiceTotals(InvoiceStatus|array $statuses): float
    {
        $statusValues = is_array($statuses)
            ? array_map(fn (InvoiceStatus $status): string => $status->value, $statuses)
            : [$statuses->value];

        return (float) (Invoice::query()
            ->whereIn('status', $statusValues)
            ->whereNotNull('total')
            ->sum('total') ?? 0);
    }

    /**
     * @param  array<int, \BackedEnum>  $cases
     * @return array<int, array{value: string, label: string, count: int}>
     */
    private function countsByStatus(mixed $query, string $column, array $cases): array
    {
        $counts = $query
            ->select($column)
            ->selectRaw('count(*) as aggregate')
            ->groupBy($column)
            ->pluck('aggregate', $column);

        return array_map(
            fn (\BackedEnum $case): array => [
                'value' => $case->value,
                'label' => method_exists($case, 'label') ? $case->label() : $case->value,
                'count' => (int) ($counts[$case->value] ?? 0),
            ],
            $cases,
        );
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function recentOrders(int $limit = 5): array
    {
        return Order::query()
            ->recent()
            ->limit($limit)
            ->get()
            ->map(fn (Order $order): array => [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'customer_name' => $order->customer_name,
                'status' => $order->status->value,
                'status_label' => $order->status->label(),
                'total' => $order->total !== null ? (float) $order->total : null,
                'has_price_on_request_items' => $order->has_price_on_request_items,
                'placed_at' => $order->placed_at->toIso8601String(),
            ])
            ->values()
            ->all();
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function recentInvoices(int $limit = 5): array
    {
        return Invoice::query()
            ->recent()
            ->limit($limit)
            ->get()
            ->map(fn (Invoice $invoice): array => [
                'id' => $invoice->id,
                'invoice_number' => $invoice->invoice_number,
                'customer_name' => $invoice->customer_name,
                'status' => $invoice->status->value,
                'status_label' => $invoice->status->label(),
                'total' => $invoice->total !== null ? (float) $invoice->total : null,
                'has_price_on_request_items' => $invoice->has_price_on_request_items,
                'issued_at' => $invoice->issued_at?->toIso8601String(),
                'due_at' => $invoice->due_at?->toIso8601String(),
            ])
            ->values()
            ->all();
    }

    /**
     * @return array<int, array{month: string, label: string, total: float, orders_count: int}>
     */
    private function monthlyOrderTotals(int $months = 6): array
    {
        $start = now()->startOfMonth()->subMonths($months - 1);

        $grouped = Order::query()
            ->where('placed_at', '>=', $start)
            ->whereNot('status', OrderStatus::Cancelled)
            ->get(['placed_at', 'total'])
            ->groupBy(fn (Order $order): string => $order->placed_at->format('Y-m'));

        $result = [];

        for ($i = 0; $i < $months; $i++) {
            $date = $start->copy()->addMonths($i);
            $key = $date->format('Y-m');
            $monthOrders = $grouped->get($key, collect());

            $result[] = [
                'month' => $key,
                'label' => $date->format('M Y'),
                'total' => (float) $monthOrders->sum(fn (Order $order): float => (float) ($order->total ?? 0)),
                'orders_count' => $monthOrders->count(),
            ];
        }

        return $result;
    }
}
