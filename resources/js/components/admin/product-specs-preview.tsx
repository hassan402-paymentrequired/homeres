import type { ProductTemplateField } from '@/types/product';

type Props = {
    specFields: ProductTemplateField[];
    specs: Record<string, string>;
    title?: string;
};

export default function ProductSpecsPreview({
    specFields,
    specs,
    title = 'Specifications',
}: Props) {
    const rows = [...specFields]
        .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
        .map((field) => ({
            label: field.label,
            value: (specs[field.key] ?? '').trim(),
        }))
        .filter((row) => row.value !== '');

    if (rows.length === 0) {
        return null;
    }

    return (
        <div>
            <h2 className="text-sm font-medium uppercase tracking-[0.15em]">
                {title}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
                Storefront preview of structured product specs.
            </p>
            <div className="mt-4 overflow-hidden rounded-xl border border-sidebar-border/70">
                <table className="w-full text-sm">
                    <tbody>
                        {rows.map((row) => (
                            <tr
                                key={row.label}
                                className="border-b border-sidebar-border/50 last:border-0"
                            >
                                <th className="w-1/3 bg-muted/30 px-4 py-3 text-left text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
                                    {row.label}
                                </th>
                                <td className="px-4 py-3 leading-relaxed text-foreground">
                                    {row.value}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
