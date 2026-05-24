import { ImagePlus, X } from 'lucide-react';
import { useId, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { resolveAdminProductImageSrc } from '@/lib/admin-product-image';

type Props = {
    bannerUrl?: string | null;
    bannerPath?: string | null;
    error?: string;
};

export default function CategoryBannerField({
    bannerUrl,
    bannerPath,
    error,
}: Props) {
    const inputId = useId();
    const pickerRef = useRef<HTMLInputElement>(null);
    const [removeBanner, setRemoveBanner] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const existingUrl =
        !removeBanner && (previewUrl ?? resolveAdminProductImageSrc({
            url: bannerUrl,
            path: bannerPath,
        }));

    return (
        <div className="grid gap-3">
            <input
                type="hidden"
                name="remove_banner"
                value={removeBanner ? '1' : '0'}
            />

            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <Label htmlFor={inputId}>Category banner</Label>
                    <p className="mt-1 text-xs text-muted-foreground">
                        Shown at the top of this category on the storefront. Use a
                        wide image (JPG, PNG, or WebP, max 5 MB).
                    </p>
                </div>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => pickerRef.current?.click()}
                >
                    <ImagePlus className="size-4" />
                    {existingUrl ? 'Replace image' : 'Upload image'}
                </Button>
            </div>

            <input
                ref={pickerRef}
                id={inputId}
                type="file"
                name="banner"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="sr-only"
                onChange={(event) => {
                    const file = event.target.files?.[0];

                    if (!file) {
                        return;
                    }

                    setRemoveBanner(false);
                    setPreviewUrl(URL.createObjectURL(file));
                }}
            />

            {existingUrl ? (
                <div className="relative overflow-hidden rounded-lg border border-sidebar-border/70">
                    <img
                        src={existingUrl}
                        alt="Category banner preview"
                        className="aspect-[21/9] w-full object-cover"
                    />
                    <button
                        type="button"
                        className="absolute top-2 right-2 inline-flex size-8 items-center justify-center rounded-full border border-sidebar-border/70 bg-background/90 shadow-sm"
                        onClick={() => {
                            setRemoveBanner(true);
                            setPreviewUrl(null);

                            if (pickerRef.current) {
                                pickerRef.current.value = '';
                            }
                        }}
                        aria-label="Remove banner"
                    >
                        <X className="size-4" />
                    </button>
                </div>
            ) : (
                <button
                    type="button"
                    onClick={() => pickerRef.current?.click()}
                    className="flex min-h-32 w-full flex-col items-center justify-center rounded-lg border border-dashed border-sidebar-border/70 bg-muted/20 px-4 py-6 text-center transition hover:border-foreground/20 hover:bg-muted/30"
                >
                    <ImagePlus className="size-7 text-muted-foreground" />
                    <p className="mt-2 text-sm font-medium">No banner yet</p>
                </button>
            )}

            {error ? <p className="text-sm text-destructive">{error}</p> : null}
        </div>
    );
}
