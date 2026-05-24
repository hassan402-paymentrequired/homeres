import {
    resolveStorefrontSpecsLayout,
    resolveStorefrontSpecsTitle,
} from '@/lib/product-template-storefront';
import type {
    StorefrontProductSpec,
    StorefrontProductTemplate,
} from '@/types/storefront-product';

type Props = {
    template: StorefrontProductTemplate | null | undefined;
    specs: StorefrontProductSpec[];
};

export default function ProductTemplateSpecs({ template, specs }: Props) {
    const title = resolveStorefrontSpecsTitle(template);
    const layout = resolveStorefrontSpecsLayout(template);
    const isTwoColumn = layout === 'two_column';

    if (specs.length === 0) {
        return null;
    }

    return (
        <div className="pdp-template-specs">
            <p className="pdp-label">{title}</p>
            <dl
                className={`pdp-spec-grid${isTwoColumn ? ' pdp-spec-grid--two-column' : ''}`}
            >
                {specs.map((spec) => (
                    <div key={spec.key} className="pdp-spec-row">
                        <dt>{spec.label}</dt>
                        <dd>{spec.value}</dd>
                    </div>
                ))}
            </dl>
        </div>
    );
}
