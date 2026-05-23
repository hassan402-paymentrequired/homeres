import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { notify } from '@/lib/notification';

type FlashProps = {
    success?: string | null;
    error?: string | null;
    warning?: string | null;
    info?: string | null;
};

export default function FlashNotifications() {
    const { flash } = usePage<{ flash?: FlashProps }>().props;

    useEffect(() => {
        if (!flash) {
            return;
        }

        notify.fromFlash(flash);
    }, [flash?.success, flash?.error, flash?.warning, flash?.info]);

    return null;
}
