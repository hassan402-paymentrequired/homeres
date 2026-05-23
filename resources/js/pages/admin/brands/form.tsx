import { Form, Head, Link } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AdminLayout from '@/layouts/admin-layout';
import type { BrandBreadcrumb, BrandRecord } from '@/types/brand';

type Props = {
    brand: BrandRecord | null;
    breadcrumbs: BrandBreadcrumb[];
};

export default function BrandForm({ brand, breadcrumbs }: Props) {
    const isEditing = brand !== null;
    const cancelHref = isEditing
        ? `/admin/brands/${brand.id}`
        : '/admin/brands';

    return (
        <AdminLayout
            breadcrumbs={breadcrumbs.map((crumb) => ({
                title: crumb.name,
                href: crumb.href,
            }))}
        >
            <Head title={isEditing ? `Edit ${brand.name}` : 'Create brand'} />

            <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 p-4 md:p-6">
                <div>
                    <h1 className="font-serif text-2xl font-medium tracking-wide">
                        {isEditing ? 'Edit brand' : 'Create brand'}
                    </h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Brands appear in the storefront directory and link to
                        products in the catalog.
                    </p>
                </div>

                <Form
                    action={
                        isEditing
                            ? `/admin/brands/${brand.id}`
                            : '/admin/brands'
                    }
                    method={isEditing ? 'put' : 'post'}
                    className="space-y-6 rounded-xl border border-sidebar-border/70 bg-card p-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    defaultValue={brand?.name ?? ''}
                                    required
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="description">Description</Label>
                                <textarea
                                    id="description"
                                    name="description"
                                    defaultValue={brand?.description ?? ''}
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

                            <div className="flex items-center gap-3 pt-2">
                                <Button type="submit" disabled={processing}>
                                    {isEditing ? 'Save changes' : 'Create brand'}
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
