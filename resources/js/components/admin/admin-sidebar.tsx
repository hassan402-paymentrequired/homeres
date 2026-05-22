import { Link } from '@inertiajs/react';
import { ExternalLink } from 'lucide-react';
import { AdminNavUser } from '@/components/admin/admin-nav-user';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { ADMIN_NAV_ITEMS } from '@/data/admin-navigation';
import { home } from '@/routes';

export function AdminSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/admin" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={ADMIN_NAV_ITEMS} />
                <SidebarGroup className="px-2 py-0">
                    <SidebarGroupLabel>Storefront</SidebarGroupLabel>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild tooltip={{ children: 'View storefront' }}>
                                <a href={home().url} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink />
                                    <span>View storefront</span>
                                </a>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <AdminNavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
