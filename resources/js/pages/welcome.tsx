import { Head } from '@inertiajs/react';
import StorefrontShell from '@/components/storefront/storefront-shell';
import type { StorefrontProduct } from '@/types/storefront-product';
import CollectionsGrid from './landing/components/collection-grid';
import CustomMadeBanner from './landing/components/custom-made-banner';
import HeroSlideshow from './landing/components/hero-slide-show';
import NewArrivals from './landing/components/new-arrivals';
import WhyHomere from './landing/components/why-homere';

type Props = {
    newArrivals: StorefrontProduct[];
};

export default function HomePage({ newArrivals }: Props) {
    return (
        <StorefrontShell>
            <Head title="Luxury Home Decor" />
            <HeroSlideshow />
            <CollectionsGrid />
            <CustomMadeBanner />
            <NewArrivals products={newArrivals} />
            <WhyHomere />
        </StorefrontShell>
    );
}
