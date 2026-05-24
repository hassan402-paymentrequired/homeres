import { Form, Head, Link, usePage } from '@inertiajs/react';
import { FileUp, Package } from 'lucide-react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AdminLayout from '@/layouts/admin-layout';

type CollectionOption = {
    handle: string;
    label: string;
};

type ImportResult = {
    imported: number;
    updated: number;
    skipped: number;
    categories_created: number;
    missing_category: number;
    missing_brand: number;
    errors: string[];
};

type Props = {
    collections: CollectionOption[];
};

export default function ProductImportPage({ collections }: Props) {
    const { flash } = usePage<{
        flash: { importResult?: ImportResult };
    }>().props;

    const importResult = flash.importResult;

    return (
        <AdminLayout
            breadcrumbs={[
                { title: 'Dashboard', href: '/admin' },
                { title: 'Products', href: '/admin/products' },
                { title: 'Bulk import', href: '/admin/products/import' },
            ]}
        >
            <Head title="Bulk import products" />

            <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 p-4 md:p-6">
                <div>
                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                        Catalog
                    </p>
                    <h1 className="mt-2 font-serif text-2xl font-medium tracking-wide">
                        Bulk import products
                    </h1>
                    <p className="mt-2 max-w-xl text-sm text-muted-foreground">
                        Import scraped products from{' '}
                        <code className="rounded bg-muted px-1 py-0.5 text-xs">
                            public/output/collections
                        </code>
                        . Run a dry run first, then import with publish when
                        you are ready for the storefront.
                    </p>
                </div>

                {importResult ? (
                    <Card className="border-sidebar-border/70 py-0 shadow-none">
                        <CardHeader className="border-b border-sidebar-border/70 py-4">
                            <p className="text-sm font-medium">Last import</p>
                        </CardHeader>
                        <CardContent className="space-y-2 py-4 text-sm">
                            <p>Imported: {importResult.imported}</p>
                            <p>Updated: {importResult.updated}</p>
                            <p>Skipped: {importResult.skipped}</p>
                            <p>
                                Categories created:{' '}
                                {importResult.categories_created}
                            </p>
                            <p>
                                Missing category: {importResult.missing_category}
                            </p>
                            <p>Missing brand: {importResult.missing_brand}</p>
                            {importResult.errors.length > 0 ? (
                                <ul className="mt-2 list-disc space-y-1 pl-5 text-destructive">
                                    {importResult.errors.map((error) => (
                                        <li key={error}>{error}</li>
                                    ))}
                                </ul>
                            ) : null}
                        </CardContent>
                    </Card>
                ) : null}

                <Form
                    action="/admin/products/import"
                    method="post"
                    className="space-y-6 rounded-xl border border-sidebar-border/70 bg-card p-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="collection">Collection</Label>
                                <select
                                    id="collection"
                                    name="collection"
                                    defaultValue=""
                                    className="border-input flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                                >
                                    <option value="">All collections</option>
                                    {collections.map((collection) => (
                                        <option
                                            key={collection.handle}
                                            value={collection.handle}
                                        >
                                            {collection.label} ({collection.handle})
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.collection} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="limit">Limit per collection</Label>
                                <Input
                                    id="limit"
                                    name="limit"
                                    type="number"
                                    min={0}
                                    placeholder="0 = unlimited"
                                />
                                <InputError message={errors.limit} />
                            </div>

                            <div className="grid gap-3">
                                <label className="flex items-center gap-2 text-sm">
                                    <input
                                        type="checkbox"
                                        name="dry_run"
                                        value="1"
                                        className="size-4 rounded border"
                                    />
                                    Dry run (preview only, no database writes)
                                </label>
                                <label className="flex items-center gap-2 text-sm">
                                    <input
                                        type="checkbox"
                                        name="publish"
                                        value="1"
                                        className="size-4 rounded border"
                                    />
                                    Publish imported products on the storefront
                                </label>
                                <label className="flex items-center gap-2 text-sm">
                                    <input
                                        type="checkbox"
                                        name="refresh"
                                        value="1"
                                        className="size-4 rounded border"
                                    />
                                    Refresh existing products (prices & variants)
                                </label>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                <Button type="submit" disabled={processing}>
                                    <FileUp className="size-4" />
                                    Run import
                                </Button>
                                <Button variant="ghost" asChild>
                                    <Link href="/admin/products">
                                        <Package className="size-4" />
                                        Back to products
                                    </Link>
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </AdminLayout>
    );
}
