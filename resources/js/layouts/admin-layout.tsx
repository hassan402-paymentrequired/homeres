import AdminSidebarLayout from '@/layouts/admin/admin-sidebar-layout';
import FlashNotifications from '@/components/flash-notifications';
import type { AppLayoutProps } from '@/types';

export default function AdminLayout({
    breadcrumbs = [],
    children,
}: AppLayoutProps) {
    return (
        <AdminSidebarLayout breadcrumbs={breadcrumbs}>
            <FlashNotifications />
            {children}
        </AdminSidebarLayout>
    );
}
