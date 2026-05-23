import { toast } from 'sonner';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export const notify = {
    success(message: string): void {
        toast.success(message);
    },
    error(message: string): void {
        toast.error(message);
    },
    warning(message: string): void {
        toast.warning(message);
    },
    info(message: string): void {
        toast.info(message);
    },
    fromFlash(flash: Partial<Record<NotificationType, string | null>>): void {
        if (flash.success) {
            notify.success(flash.success);
        }

        if (flash.error) {
            notify.error(flash.error);
        }

        if (flash.warning) {
            notify.warning(flash.warning);
        }

        if (flash.info) {
            notify.info(flash.info);
        }
    },
} as const;
