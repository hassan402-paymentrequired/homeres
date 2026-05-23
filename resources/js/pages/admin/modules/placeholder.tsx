import { Head } from '@inertiajs/react';
import { Construction } from 'lucide-react';
import AdminEmptyState from '@/components/admin/admin-empty-state';
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
            <AdminEmptyState
                className="h-full flex-1"
                icon={Construction}
                title={title}
                description="This module is queued for implementation. You can inspect the admin layout and navigation while we build it out."
            />
        </AdminLayout>
    );
}
