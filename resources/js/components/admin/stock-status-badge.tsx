import type { StockStatus } from '@/types/product';
import { Badge } from '@/components/ui/badge';

const STOCK_VARIANT: Record<
    StockStatus,
    'default' | 'secondary' | 'outline' | 'destructive'
> = {
    in_store: 'default',
    in_stock_remote: 'secondary',
    out_of_stock: 'outline',
};

type Props = {
    label: string;
    status: StockStatus;
};

export default function StockStatusBadge({ label, status }: Props) {
    return <Badge variant={STOCK_VARIANT[status]}>{label}</Badge>;
}
