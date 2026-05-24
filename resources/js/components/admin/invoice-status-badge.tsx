import type { InvoiceStatus } from '@/types/invoice';
import { Badge } from '@/components/ui/badge';

const STATUS_VARIANT: Record<
    InvoiceStatus,
    'default' | 'secondary' | 'outline' | 'destructive'
> = {
    draft: 'outline',
    sent: 'secondary',
    paid: 'default',
    void: 'destructive',
};

type Props = {
    label: string;
    status: InvoiceStatus;
};

export default function InvoiceStatusBadge({ label, status }: Props) {
    return <Badge variant={STATUS_VARIANT[status]}>{label}</Badge>;
}
