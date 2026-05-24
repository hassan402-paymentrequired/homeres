import { Form } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import InputError from '@/components/input-error';
import SearchableSelect from '@/components/admin/searchable-select';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
import type { BrandNavGroupOption, BrandRecord } from '@/types/brand';

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    brand: BrandRecord | null;
    navGroupOptions?: BrandNavGroupOption[];
    /** When true, opens as a navigation group (mega menu column). */
    asNavGroup?: boolean;
};

export default function BrandFormModal({
    open,
    onOpenChange,
    brand,
    navGroupOptions = [],
    asNavGroup = false,
}: Props) {
    const isEditing = brand !== null;
    const [isParent, setIsParent] = useState(
        brand?.is_parent ?? asNavGroup,
    );
    const [parentId, setParentId] = useState(brand?.parent_id ?? '');

    useEffect(() => {
        if (open) {
            setIsParent(brand?.is_parent ?? asNavGroup);
            setParentId(brand?.parent_id ?? '');
        }
    }, [open, brand, asNavGroup]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        {isEditing
                            ? isParent
                                ? 'Edit nav group'
                                : 'Edit brand'
                            : isParent
                              ? 'Create nav group'
                              : 'Create brand'}
                    </DialogTitle>
                    <DialogDescription>
                        {isParent
                            ? 'Navigation groups appear as columns in the storefront brands mega menu.'
                            : 'Brands appear in the storefront directory and link to products.'}
                    </DialogDescription>
                </DialogHeader>

                <Form
                    key={brand?.id ?? (isParent ? 'nav-group' : 'create')}
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
                            <input
                                type="hidden"
                                name="is_parent"
                                value={isParent ? '1' : '0'}
                            />

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

                            {!isParent && navGroupOptions.length > 0 && (
                                <div className="grid gap-2">
                                    <Label htmlFor="brand-modal-parent">
                                        Nav group
                                    </Label>
                                    <input
                                        type="hidden"
                                        name="parent_id"
                                        value={parentId}
                                    />
                                    <SearchableSelect
                                        id="brand-modal-parent"
                                        value={parentId}
                                        onValueChange={setParentId}
                                        placeholder="No group"
                                        searchPlaceholder="Search groups…"
                                        options={[
                                            { value: '', label: 'No group' },
                                            ...navGroupOptions.map(
                                                (group) => ({
                                                    value: group.id,
                                                    label: group.name,
                                                }),
                                            ),
                                        ]}
                                    />
                                    <InputError message={errors.parent_id} />
                                </div>
                            )}

                            {!isParent && (
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
                            )}

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
                                    Show in storefront navigation
                                </label>
                                {!asNavGroup && !isEditing && (
                                    <div className="flex items-start gap-3 rounded-lg border border-sidebar-border/60 bg-muted/20 px-3 py-2">
                                        <Checkbox
                                            id="brand-modal-is-parent"
                                            checked={isParent}
                                            onCheckedChange={(checked) => {
                                                setIsParent(checked === true);
                                                if (checked === true) {
                                                    setParentId('');
                                                }
                                            }}
                                        />
                                        <label
                                            htmlFor="brand-modal-is-parent"
                                            className="text-sm leading-snug"
                                        >
                                            Navigation group only (mega menu
                                            column, not a product brand)
                                        </label>
                                    </div>
                                )}
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
                                    {isEditing ? 'Save changes' : 'Create'}
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}
