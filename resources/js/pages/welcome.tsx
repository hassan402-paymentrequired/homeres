/* eslint-disable import/order */
import React from 'react';
import SiteHeader from './landing/components/site-header';
import CollectionsGrid from './landing/components/collection-grid';
import CustomMadeBanner from './landing/components/custom-made-banner';
import HeroSlideshow from './landing/components/hero-slide-show';
import NewArrivals from './landing/components/new-arrivals';
import StoreLocations from './landing/components/store-location';
import SiteFooter from './landing/components/site-footer';

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
      {/* Header + Navigation */}
      <SiteHeader />

      {/* Main content */}
      <main id="MainContent">
        {/* Hero Slideshow */}
        <HeroSlideshow />

        {/* Collections Grid */}
        <CollectionsGrid />

        {/* Bespoke Design Service Banner */}
        <CustomMadeBanner />

        {/* New Arrivals */}
        <NewArrivals />

        {/* Store Locations */}
        <StoreLocations />
      </main>

      {/* Footer */}
      <SiteFooter />
    </div>
  );
}
