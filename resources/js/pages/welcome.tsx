/* eslint-disable import/order */
import { Head } from '@inertiajs/react';
import SiteHeader from './landing/components/site-header';
import CollectionsGrid from './landing/components/collection-grid';
import CustomMadeBanner from './landing/components/custom-made-banner';
import HeroSlideshow from './landing/components/hero-slide-show';
import NewArrivals from './landing/components/new-arrivals';
import StoreLocations from './landing/components/store-location';
import SiteFooter from './landing/components/site-footer';
import Testimonials from './landing/components/testimonials';
import WhyHomere from './landing/components/why-homere';

export default function HomePage() {
    return (
        <div
            style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: '12px',
                fontWeight: 300,
                color: '#060606',
                background: '#ffffff',
                minHeight: '100vh',
            }}
        >
            <Head title="Luxury Home Decor" />
            <SiteHeader />
            <main id="MainContent">
                <HeroSlideshow />
                <CollectionsGrid />
                <CustomMadeBanner />
                <NewArrivals />
                <WhyHomere />
                <Testimonials />
                <StoreLocations />
            </main>
            <SiteFooter />
        </div>
    );
}
