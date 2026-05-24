import { Form } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { BrandRecord } from '@/types/brand';

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    brand: BrandRecord | null;
};

export default function BrandFormModal({ open, onOpenChange, brand }: Props) {
    const isEditing = brand !== null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? 'Edit brand' : 'Create brand'}
                    </DialogTitle>
                    <DialogDescription>
                        Brands appear in the storefront directory and link to
                        products in the catalog.
                    </DialogDescription>
                </DialogHeader>

                <Form
                    key={brand?.id ?? 'create'}
                    action={
                        isEditing
                            ? `/admin/brands/${brand.id}`
                            : '/admin/brands'
                    }
                    method={isEditing ? 'put' : 'post'}
                    className="space-y-4"
                    onSuccess={() => onOpenChange(false)}
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="brand-modal-name">Name</Label>
                                <Input
                                    id="brand-modal-name"
                                    name="name"
                                    defaultValue={brand?.name ?? ''}
                                    required
                                    autoFocus
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="brand-modal-description">
                                    Description
                                </Label>
                                <textarea
                                    id="brand-modal-description"
                                    name="description"
                                    defaultValue={brand?.description ?? ''}
                                    rows={3}
                                    className="border-input placeholder:text-muted-foreground flex min-h-[72px] w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                                />
                                <InputError message={errors.description} />
                            </div>

                            <div className="grid gap-3">
                                <label className="flex items-center gap-2 text-sm">
                                    <input
                                        type="hidden"
                                        name="is_active"
                                        value="0"
                                    />
                                    <input
                                        type="checkbox"
                                        name="is_active"
                                        value="1"
                                        defaultChecked={
                                            brand?.is_active ?? true
                                        }
                                        className="size-4 rounded border"
                                    />
                                    Active
                                </label>
                                <label className="flex items-center gap-2 text-sm">
                                    <input
                                        type="hidden"
                                        name="show_in_nav"
                                        value="0"
                                    />
                                    <input
                                        type="checkbox"
                                        name="show_in_nav"
                                        value="1"
                                        defaultChecked={
                                            brand?.show_in_nav ?? true
                                        }
                                        className="size-4 rounded border"
                                    />
                                    Show in storefront brand directory
                                </label>
                            </div>

                            <DialogFooter className="gap-2 sm:gap-0">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => onOpenChange(false)}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {isEditing
                                        ? 'Save changes'
                                        : 'Create brand'}
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}
