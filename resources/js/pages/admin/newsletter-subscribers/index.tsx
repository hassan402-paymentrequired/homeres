import { Head } from '@inertiajs/react';
import { Mail } from 'lucide-react';
import AdminEmptyState from '@/components/admin/admin-empty-state';
import AdminPagination from '@/components/admin/admin-pagination';
import AdminLayout from '@/layouts/admin-layout';
import type { Paginated } from '@/types/pagination';

type Subscriber = {
    id: number;
    email: string;
    source: string;
    subscribed_at: string;
};

type Stats = {
    total: number;
    from_modal: number;
    from_footer: number;
};

type Props = {
    subscribers: Paginated<Subscriber>;
    stats: Stats;
};

function formatSubscribedAt(iso: string): string {
    return new Date(iso).toLocaleString('en-NG', {
        dateStyle: 'medium',
        timeStyle: 'short',
    });
}

function formatSource(source: string): string {
    return source === 'footer' ? 'Footer' : 'Welcome modal';
}

export default function NewsletterSubscribersIndex({ subscribers, stats }: Props) {
    const items = subscribers.data;

    return (
        <AdminLayout
            breadcrumbs={[
                { title: 'Dashboard', href: '/admin' },
                { title: 'Newsletter', href: '/admin/newsletter-subscribers' },
            ]}
        >
            <Head title="Newsletter subscribers" />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4 md:p-6">
                <div>
                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                        Marketing
                    </p>
                    <h1 className="mt-2 font-serif text-2xl font-medium tracking-wide">
                        Newsletter subscribers
                    </h1>
                    <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                        Emails collected from the welcome modal and footer signup form.
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                    <div className="rounded-xl border border-sidebar-border/70 bg-muted/20 p-4">
                        <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
                            Total
                        </p>
                        <p className="mt-2 text-2xl font-medium">{stats.total}</p>
                    </div>
                    <div className="rounded-xl border border-sidebar-border/70 bg-muted/20 p-4">
                        <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
                            Welcome modal
                        </p>
                        <p className="mt-2 text-2xl font-medium">{stats.from_modal}</p>
                    </div>
                    <div className="rounded-xl border border-sidebar-border/70 bg-muted/20 p-4">
                        <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
                            Footer form
                        </p>
                        <p className="mt-2 text-2xl font-medium">{stats.from_footer}</p>
                    </div>
                </div>

                {items.length === 0 ? (
                    <AdminEmptyState
                        className="flex-1 py-16"
                        icon={Mail}
                        title="No subscribers yet"
                        description="Signups from the storefront welcome modal and footer will appear here."
                    />
                ) : (
                    <>
                        <div className="overflow-hidden rounded-xl border border-sidebar-border/70">
                            <table className="w-full text-sm">
                                <thead className="border-b border-sidebar-border/70 bg-muted/30 text-left text-xs uppercase tracking-[0.12em] text-muted-foreground">
                                    <tr>
                                        <th className="px-4 py-3 font-medium">Email</th>
                                        <th className="px-4 py-3 font-medium">Source</th>
                                        <th className="px-4 py-3 font-medium">Subscribed</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((subscriber) => (
                                        <tr
                                            key={subscriber.id}
                                            className="border-b border-sidebar-border/50 last:border-0"
                                        >
                                            <td className="px-4 py-3 font-medium">
                                                {subscriber.email}
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground">
                                                {formatSource(subscriber.source)}
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground">
                                                {formatSubscribedAt(subscriber.subscribed_at)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <AdminPagination paginator={subscribers} />
                    </>
                )}
            </div>
        </AdminLayout>
    );
}
