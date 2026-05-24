import { Link } from '@inertiajs/react';
import { ArrowRight, ImageIcon, Layers, Tags } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { ProductCard } from '@/types/product';

type Props = {
    product: ProductCard;
};

export default function ProductCardItem({ product }: Props) {
    return (
        <Link
            href={`/admin/products/${product.id}`}
            prefetch
            className="group flex flex-col overflow-hidden rounded-xl border border-sidebar-border/70 bg-card transition hover:border-foreground/20 hover:shadow-sm"
        >
            <div className="relative aspect-[4/3] bg-muted/30">
                {product.thumbnail_url ? (
                    <img
                        src={product.thumbnail_url}
                        alt={product.name}
                        className="size-full object-cover transition group-hover:scale-[1.02]"
                    />
                ) : (
                    <div className="flex size-full items-center justify-center text-muted-foreground">
                        <ImageIcon className="size-8 opacity-50" />
                    </div>
                )}
                {product.status === 'draft' && (
                    <Badge
                        variant="secondary"
                        className="absolute top-3 left-3"
                    >
                        Draft
                    </Badge>
                )}
            </div>

            <div className="flex flex-1 flex-col p-5">
                <div className="flex items-start justify-between gap-3">
                    <h2 className="text-sm font-medium tracking-wide">
                        {product.name}
                    </h2>
                    <ArrowRight className="size-4 shrink-0 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-foreground" />
                </div>

                <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                    {product.category && <p>{product.category.name}</p>}
                    {product.brand && (
                        <p className="inline-flex items-center gap-1">
                            <Tags className="size-3" />
                            {product.brand.name}
                        </p>
                    )}
                </div>

                <div className="mt-auto pt-4 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                        <Layers className="size-3.5" />
                        {product.variants_count} variant
                        {product.variants_count === 1 ? '' : 's'}
                    </span>
                </div>
            </div>
        </Link>
    );
}
