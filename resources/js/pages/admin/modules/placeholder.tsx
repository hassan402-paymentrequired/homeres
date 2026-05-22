import { Head } from '@inertiajs/react';
import { Construction } from 'lucide-react';
import AdminLayout from '@/layouts/admin-layout';
import { ADMIN_NAV_ITEMS } from '@/data/admin-navigation';

type Props = {
    title: string;
};

export default function AdminModulePlaceholder({ title }: Props) {
    const module = ADMIN_NAV_ITEMS.find((item) => item.title === title);
    const href = module?.href ?? '/admin';

    return (
        <AdminLayout
            breadcrumbs={[
                { title: 'Dashboard', href: '/admin' },
                { title, href },
            ]}
        >
            <Head title={title} />
            <div className="flex h-full flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
                <div className="flex size-14 items-center justify-center rounded-full border border-sidebar-border/70 bg-muted/40">
                    <Construction className="size-6 text-muted-foreground" />
                </div>
                <div>
                    <h1 className="font-serif text-2xl font-medium tracking-wide">{title}</h1>
                    <p className="mt-2 max-w-md text-sm text-muted-foreground">
                        This module is queued for implementation. You can inspect the admin
                        layout and navigation while we build it out.
                    </p>
                </div>
            </div>
        </AdminLayout>
    );
}
