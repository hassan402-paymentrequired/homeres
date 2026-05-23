import { Form, Head, Link } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AdminLayout from '@/layouts/admin-layout';
import type {
    CategoryBreadcrumb,
    CategoryRecord,
    ProductTemplateOption,
} from '@/types/category';

type Props = {
    category: CategoryRecord | null;
    parentCategory: CategoryRecord | null;
    productTemplates: ProductTemplateOption[];
    breadcrumbs: CategoryBreadcrumb[];
};

export default function CategoryForm({
    category,
    parentCategory,
    productTemplates,
    breadcrumbs,
}: Props) {
    const isEditing = category !== null;
    const cancelHref = isEditing
        ? `/admin/categories/${category.id}`
        : parentCategory
          ? `/admin/categories/${parentCategory.id}`
          : '/admin/categories';

    return (
        <AdminLayout
            breadcrumbs={breadcrumbs.map((crumb) => ({
                title: crumb.name,
                href: crumb.href,
            }))}
        >
            <Head title={isEditing ? `Edit ${category.name}` : 'Create category'} />

            <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 p-4 md:p-6">
                <div>
                    <h1 className="font-serif text-2xl font-medium tracking-wide">
                        {isEditing
                            ? 'Edit category'
                            : parentCategory
                              ? `Add subcategory to ${parentCategory.name}`
                              : 'Create category'}
                    </h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                        {parentCategory
                            ? 'This category will be created under the current parent.'
                            : 'Top-level categories appear on the main categories index.'}
                    </p>
                </div>

                <Form
                    action={
                        isEditing
                            ? `/admin/categories/${category.id}`
                            : '/admin/categories'
                    }
                    method={isEditing ? 'put' : 'post'}
                    className="space-y-6 rounded-xl border border-sidebar-border/70 bg-card p-6"
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

                            {!isEditing && parentCategory && (
                                <div className="rounded-lg border border-sidebar-border/60 bg-muted/30 px-4 py-3 text-sm">
                                    Parent:{' '}
                                    <span className="font-medium">
                                        {parentCategory.name}
                                    </span>
                                </div>
                            )}

                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    defaultValue={category?.name ?? ''}
                                    required
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="product_template_id">
                                    Product template
                                </Label>
                                <select
                                    id="product_template_id"
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
                                <InputError message={errors.product_template_id} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="nav_group_label">
                                    Nav group label
                                </Label>
                                <Input
                                    id="nav_group_label"
                                    name="nav_group_label"
                                    defaultValue={category?.nav_group_label ?? ''}
                                    placeholder="e.g. Bedroom"
                                />
                                <InputError message={errors.nav_group_label} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="description">Description</Label>
                                <textarea
                                    id="description"
                                    name="description"
                                    defaultValue={category?.description ?? ''}
                                    rows={4}
                                    className="border-input placeholder:text-muted-foreground flex min-h-[80px] w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
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

                            <div className="flex items-center gap-3 pt-2">
                                <Button type="submit" disabled={processing}>
                                    {isEditing
                                        ? 'Save changes'
                                        : 'Create category'}
                                </Button>
                                <Button variant="ghost" asChild>
                                    <Link href={cancelHref}>Cancel</Link>
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </AdminLayout>
    );
}
