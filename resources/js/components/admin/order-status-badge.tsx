import type { OrderStatus } from '@/types/order';
import { Badge } from '@/components/ui/badge';

const STATUS_VARIANT: Record<
    OrderStatus,
    'default' | 'secondary' | 'outline' | 'destructive'
> = {
    pending: 'outline',
    confirmed: 'secondary',
    processing: 'default',
    fulfilled: 'default',
    cancelled: 'destructive',
};

type Props = {
    label: string;
    status: OrderStatus;
};

export default function OrderStatusBadge({ label, status }: Props) {
    return <Badge variant={STATUS_VARIANT[status]}>{label}</Badge>;
}
