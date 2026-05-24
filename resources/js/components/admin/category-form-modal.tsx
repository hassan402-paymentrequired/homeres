import { Form } from '@inertiajs/react';
import CategoryBannerField from '@/components/admin/category-banner-field';
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
import type {
    CategoryRecord,
    ProductTemplateOption,
} from '@/types/category';

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    category: CategoryRecord | null;
    parentCategory: Pick<CategoryRecord, 'id' | 'name'> | null;
    productTemplates: ProductTemplateOption[];
};

export default function CategoryFormModal({
    open,
    onOpenChange,
    category,
    parentCategory,
    productTemplates,
}: Props) {
    const isEditing = category !== null;
    const formKey = isEditing
        ? `edit-${category.id}`
        : parentCategory
          ? `create-${parentCategory.id}`
          : 'create-root';

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[min(90vh,720px)]  overflow-y-auto sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>
                        {isEditing
                            ? 'Edit category'
                            : parentCategory
                              ? `Add subcategory`
                              : 'Create category'}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? `Update "${category.name}".`
                            : parentCategory
                              ? `New subcategory under ${parentCategory.name}.`
                              : 'Top-level categories appear on the main categories index.'}
                    </DialogDescription>
                </DialogHeader>

                <Form
                    key={formKey}
                    action={
                        isEditing
                            ? `/admin/categories/${category.id}`
                            : '/admin/categories'
                    }
                    method={isEditing ? 'put' : 'post'}
                    encType="multipart/form-data"
                    className="space-y-4"
                    onSuccess={() => onOpenChange(false)}
                >
                    {({ processing, errors }) => (
                        <>
                            {!isEditing && parentCategory && (
                                <input
                                    type="hidden"
                                    name="parent_id"
                                    value={parentCategory.id}
                                />
                            )}

                            <div className="grid gap-2">
                                <Label htmlFor="category-modal-name">Name</Label>
                                <Input
                                    id="category-modal-name"
                                    name="name"
                                    defaultValue={category?.name ?? ''}
                                    required
                                    autoFocus
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="category-modal-product_template_id">
                                    Product template
                                </Label>
                                <select
                                    id="category-modal-product_template_id"
                                    name="product_template_id"
                                    defaultValue={
                                        category?.product_template_id ?? ''
                                    }
                                    className="border-input flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                                >
                                    <option value="">No template</option>
                                    {productTemplates.map((template) => (
                                        <option
                                            key={template.id}
                                            value={template.id}
                                        >
                                            {template.name}
                                        </option>
                                    ))}
                                </select>
                                <InputError
                                    message={errors.product_template_id}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="category-modal-nav_group_label">
                                    Nav group label
                                </Label>
                                <Input
                                    id="category-modal-nav_group_label"
                                    name="nav_group_label"
                                    defaultValue={
                                        category?.nav_group_label ?? ''
                                    }
                                    placeholder="e.g. Bedroom"
                                />
                                <InputError message={errors.nav_group_label} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="category-modal-description">
                                    Description
                                </Label>
                                <textarea
                                    id="category-modal-description"
                                    name="description"
                                    defaultValue={category?.description ?? ''}
                                    rows={3}
                                    className="border-input placeholder:text-muted-foreground flex min-h-[72px] w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                                />
                                <InputError message={errors.description} />
                            </div>

                            <CategoryBannerField
                                bannerUrl={category?.banner_url}
                                bannerPath={category?.banner_path}
                                error={errors.banner}
                            />

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
                                            category?.is_active ?? true
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
                                            category?.show_in_nav ?? true
                                        }
                                        className="size-4 rounded border"
                                    />
                                    Show in storefront navigation
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
                                        : 'Create category'}
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}
