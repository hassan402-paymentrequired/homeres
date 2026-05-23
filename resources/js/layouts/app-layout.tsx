import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import FlashNotifications from '@/components/flash-notifications';
import type { BreadcrumbItem } from '@/types';

export default function AppLayout({
    breadcrumbs = [],
    children,
}: {
    breadcrumbs?: BreadcrumbItem[];
    children: React.ReactNode;
}) {
    return (
        <AppLayoutTemplate breadcrumbs={breadcrumbs}>
            <FlashNotifications />
            {children}
        </AppLayoutTemplate>
    );
}
