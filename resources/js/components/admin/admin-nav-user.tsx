import { Link, router, usePage } from '@inertiajs/react';
import { ChevronsUpDown, LogOut } from 'lucide-react';
import { UserInfo } from '@/components/user-info';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import type { Admin, Auth } from '@/types';

export function AdminNavUser() {
    const { auth } = usePage<{ auth: Auth }>().props;
    const { state } = useSidebar();
    const isMobile = useIsMobile();
    const admin = auth.admin;

    if (!admin) {
        return null;
    }

    const handleLogout = () => {
        router.post('/admin/logout');
    };

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="group text-sidebar-accent-foreground data-[state=open]:bg-sidebar-accent"
                            data-test="admin-sidebar-menu-button"
                        >
                            <UserInfo user={adminAsUser(admin)} />
                            <ChevronsUpDown className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                        align="end"
                        side={
                            isMobile
                                ? 'bottom'
                                : state === 'collapsed'
                                  ? 'left'
                                  : 'bottom'
                        }
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                <UserInfo user={adminAsUser(admin)} showEmail />
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link
                                href="/admin/settings"
                                className="block w-full cursor-pointer"
                                prefetch
                            >
                                Settings
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <button
                                type="button"
                                className="flex w-full cursor-pointer items-center px-2 py-1.5 text-sm"
                                onClick={handleLogout}
                                data-test="admin-logout-button"
                            >
                                <LogOut className="mr-2 size-4" />
                                Log out
                            </button>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}

function adminAsUser(admin: Admin) {
    return {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        email_verified_at: admin.email_verified_at,
        created_at: admin.created_at,
        updated_at: admin.updated_at,
    };
}
