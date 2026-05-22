import { Head, Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import AdminLayout from '@/layouts/admin-layout';
import { ADMIN_NAV_ITEMS } from '@/data/admin-navigation';
import type { ReactNode } from 'react';

function AdminDashboard() {
    const modules = ADMIN_NAV_ITEMS.filter((item) => item.title !== 'Dashboard');

    return (
        <>
            <Head title="Admin dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4 md:p-6">
                <div>
                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                        Homère admin
                    </p>
                    <h1 className="mt-2 font-serif text-2xl font-medium tracking-wide">
                        Dashboard
                    </h1>
                    <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                        Manage categories, brands, products, orders, and store settings from here.
                        Modules below will be implemented next.
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {modules.map((module) => (
                        <Link
                            key={module.href}
                            href={module.href}
                            prefetch
                            className="group rounded-xl border border-sidebar-border/70 bg-card p-5 transition hover:border-foreground/20 hover:shadow-sm"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex size-10 items-center justify-center rounded-lg border border-sidebar-border/70 bg-muted/40">
                                    <module.icon className="size-5" />
                                </div>
                                <ArrowRight className="size-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-foreground" />
                            </div>
                            <h2 className="mt-4 text-sm font-medium tracking-wide uppercase">
                                {module.title}
                            </h2>
                            {module.description && (
                                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                    {module.description}
                                </p>
                            )}
                        </Link>
                    ))}
                </div>
            </div>
        </>
    );
}

AdminDashboard.layout = (page: ReactNode) => (
    <AdminLayout breadcrumbs={[{ title: 'Dashboard', href: '/admin' }]}>
        {page}
    </AdminLayout>
);

export default AdminDashboard;
