import { ImagePlus, X } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { resolveAdminProductImageSrc } from '@/lib/admin-product-image';
import type { ProductImage } from '@/types/product';

type Props = {
    existingImages?: ProductImage[];
    onPendingFilesChange?: (files: File[]) => void;
    error?: string;
};

type PendingImage = {
    id: string;
    file: File;
    previewUrl: string;
};

let pendingIdCounter = 0;

function createPendingId(): string {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
        return crypto.randomUUID();
    }

    pendingIdCounter += 1;

    return `pending-${pendingIdCounter}`;
}

export default function ProductImagesField({
    existingImages = [],
    onPendingFilesChange,
    error,
}: Props) {
    const fileInputId = useId();
    const pickerRef = useRef<HTMLInputElement>(null);
    const [keptImages, setKeptImages] = useState(existingImages);
    const [pendingImages, setPendingImages] = useState<PendingImage[]>([]);
    const pendingImagesRef = useRef(pendingImages);

    pendingImagesRef.current = pendingImages;

    useEffect(() => {
        setKeptImages(existingImages);
    }, [existingImages]);

    useEffect(() => {
        onPendingFilesChange?.(pendingImages.map((image) => image.file));
    }, [pendingImages, onPendingFilesChange]);

    useEffect(() => {
        return () => {
            pendingImagesRef.current.forEach((image) =>
                URL.revokeObjectURL(image.previewUrl),
            );
        };
    }, []);

    const totalCount = keptImages.length + pendingImages.length;

    const handleFiles = (files: FileList | null) => {
        if (!files?.length) {
            return;
        }

        const next = Array.from(files).map((file) => ({
            id: createPendingId(),
            file,
            previewUrl: URL.createObjectURL(file),
        }));

        setPendingImages((current) => [...current, ...next]);
    };

    const removePending = (id: string) => {
        setPendingImages((current) => {
            const target = current.find((image) => image.id === id);

            if (target) {
                URL.revokeObjectURL(target.previewUrl);
            }

            return current.filter((image) => image.id !== id);
        });
    };

    return (
        <div className="grid gap-4 lg:col-span-2">
            {keptImages.map((image) => (
                <input
                    key={image.id}
                    type="hidden"
                    name="keep_images[]"
                    value={image.id}
                />
            ))}

            <input
                ref={pickerRef}
                id={fileInputId}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                multiple
                className="sr-only"
                onChange={(event) => {
                    handleFiles(event.target.files);
                    event.target.value = '';
                }}
            />

            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <Label htmlFor={fileInputId}>Product images</Label>
                    <p className="mt-1 text-xs text-muted-foreground">
                        Upload JPG, PNG, or WebP up to 5 MB. The first image is
                        used as the catalog thumbnail.
                    </p>
                </div>
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => pickerRef.current?.click()}
                >
                    <ImagePlus className="size-4" />
                    Add images
                </Button>
            </div>

            {totalCount === 0 ? (
                <button
                    type="button"
                    onClick={() => pickerRef.current?.click()}
                    className="flex min-h-40 w-full flex-col items-center justify-center rounded-lg border border-dashed border-sidebar-border/70 bg-muted/20 px-4 py-8 text-center transition hover:border-foreground/20 hover:bg-muted/30"
                >
                    <ImagePlus className="size-8 text-muted-foreground" />
                    <p className="mt-3 text-sm font-medium">No images yet</p>
                    <p className="mt-1 max-w-sm text-xs text-muted-foreground">
                        Click to add product photos for the storefront gallery
                        and admin cards.
                    </p>
                </button>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {keptImages.map((image) => (
                        <div
                            key={image.id}
                            className="overflow-hidden rounded-lg border border-sidebar-border/70 bg-card"
                        >
                            <div className="relative aspect-[4/3] bg-muted/30">
                                <img
                                    src={resolveAdminProductImageSrc(image)}
                                    alt={image.alt || 'Product image'}
                                    className="size-full object-cover"
                                />
                                <button
                                    type="button"
                                    className="absolute top-2 right-2 inline-flex size-7 items-center justify-center rounded-full border border-sidebar-border/70 bg-background/90 text-foreground shadow-sm transition hover:bg-background"
                                    onClick={() =>
                                        setKeptImages((current) =>
                                            current.filter(
                                                (item) => item.id !== image.id,
                                            ),
                                        )
                                    }
                                    aria-label="Remove image"
                                >
                                    <X className="size-4" />
                                </button>
                            </div>
                            <div className="space-y-2 p-3">
                                <Label
                                    htmlFor={`alt_${image.id}`}
                                    className="text-xs"
                                >
                                    Alt text
                                </Label>
                                <Input
                                    id={`alt_${image.id}`}
                                    name={`image_alts[${image.id}]`}
                                    defaultValue={image.alt}
                                    placeholder="Describe this image…"
                                />
                            </div>
                        </div>
                    ))}

                    {pendingImages.map((image) => (
                        <div
                            key={image.id}
                            className="overflow-hidden rounded-lg border border-sidebar-border/70 bg-card"
                        >
                            <div className="relative aspect-[4/3] bg-muted/30">
                                <img
                                    src={image.previewUrl}
                                    alt="Pending upload"
                                    className="size-full object-cover"
                                />
                                <button
                                    type="button"
                                    className="absolute top-2 right-2 inline-flex size-7 items-center justify-center rounded-full border border-sidebar-border/70 bg-background/90 text-foreground shadow-sm transition hover:bg-background"
                                    onClick={() => removePending(image.id)}
                                    aria-label="Remove image"
                                >
                                    <X className="size-4" />
                                </button>
                            </div>
                            <div className="p-3 text-xs text-muted-foreground">
                                Ready to upload — save the product to store this
                                image.
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {error ? (
                <p className="text-sm text-destructive">{error}</p>
            ) : null}
        </div>
    );
}
