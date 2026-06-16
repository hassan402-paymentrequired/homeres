
import React, { useState, useEffect, useRef } from 'react';

interface Slide {
  id: number;
  image: string;
  alt: string;
  headline: string;
  subline: string;
  cta: string;
  ctaHref: string;
}

const slides: Slide[] = [
{
  id: 1,
  image: "/assets/images/banners/RNI-Films-IMG-17222E29-7C9D-4AA4-B607-37D6B87427D0.JPG",
  alt: 'Minimalist living room with warm wooden tones and soft lighting',
  headline: 'Welcome to Homère',
  subline: 'Timeless interior design with a recognisable signature',
  cta: 'Explore Collections',
  ctaHref: '/shop'
},
{
  id: 2,
  image: "/assets/images/banners/RNI-Films-IMG-E3283BD3-CE56-4F93-80B2-B28B430E385C.jpg",
  alt: 'Elegant bedroom interior with curated furniture and ambient lighting',
  headline: 'Curated Living',
  subline: 'Every piece tells a story of craftsmanship and beauty',
  cta: 'New Arrivals',
  ctaHref: '/shop/new-arrivals'
},
{
  id: 3,
  image: "/assets/images/banners/brand.jpg",
  alt: 'Modern dining area with designer chairs and statement pendant lighting',
  headline: 'Design Studio',
  subline: 'Bespoke interiors crafted to your vision',
  cta: 'Our Studio',
  ctaHref: '/services'
}];


function markSlideImageLoaded(
  setLoaded: React.Dispatch<React.SetStateAction<boolean[]>>,
  idx: number,
) {
  setLoaded((prev) => {
    if (prev[idx]) {
      return prev;
    }

    const next = [...prev];
    next[idx] = true;

    return next;
  });
}

export default function HeroSlideshow() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [loaded, setLoaded] = useState<boolean[]>(() => slides.map(() => false));
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!paused) {
      intervalRef.current = setInterval(() => {
        setCurrent((prev) => (prev + 1) % slides.length);
      }, 5000);
    }

    return () => {
      if (intervalRef.current) {
clearInterval(intervalRef.current);
}
    };
  }, [paused]);

  useEffect(() => {
    slides.forEach((slide, idx) => {
      const preload = new Image();
      preload.onload = () => markSlideImageLoaded(setLoaded, idx);
      preload.onerror = () => markSlideImageLoaded(setLoaded, idx);
      preload.src = slide.image;
    });
  }, []);

  const handleImageRef = (idx: number) => (img: HTMLImageElement | null) => {
    if (!img) {
      return;
    }

    if (img.complete && img.naturalWidth > 0) {
      markSlideImageLoaded(setLoaded, idx);
    }
  };

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ height: 'min(80vh, 700px)' }}
      aria-label="Hero slideshow">
      
      {/* Slides */}
      {slides.map((slide, idx) =>
      <div
        key={slide.id}
        className="absolute inset-0 transition-opacity duration-700"
        style={{ opacity: idx === current ? 1 : 0, zIndex: idx === current ? 1 : 0 }}
        aria-hidden={idx !== current}>
        
          <img
            ref={handleImageRef(idx)}
            src={slide.image}
            alt={slide.alt}
            className="absolute inset-0 h-full w-full object-cover object-center"
            onLoad={() => markSlideImageLoaded(setLoaded, idx)}
            onError={() => markSlideImageLoaded(setLoaded, idx)}
            style={{
              opacity: loaded[idx] ? 1 : 0,
              transition: 'opacity 0.5s ease',
            }}
          />

          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black" style={{ opacity: 0.35 }} />
          {/* Content */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-end text-center"
            style={{ padding: '0 30px clamp(96px, 14vh, 160px)' }}
          >
            <div className="max-w-page mx-auto w-full text-center">
              <p
              className="text-white mb-3"
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: '13px',
                fontWeight: 300,
                letterSpacing: '2px',
                textTransform: 'uppercase',
                opacity: idx === current ? 1 : 0,
                transform: idx === current ? 'translateY(0)' : 'translateY(10px)',
                transition: 'opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s'
              }}>
              
                {slide.subline}
              </p>
              <h2
              style={{
                fontFamily: '"Proza Libre", sans-serif',
                fontSize: 'clamp(32px, 5vw, 56px)',
                fontWeight: 500,
                letterSpacing: '0.025em',
                textTransform: 'uppercase',
                color: '#ffffff',
                lineHeight: 1.1,
                marginBottom: '24px',
                opacity: idx === current ? 1 : 0,
                transform: idx === current ? 'translateY(0)' : 'translateY(15px)',
                transition: 'opacity 0.8s ease 0.1s, transform 0.8s ease 0.1s'
              }}>
              
                {slide.headline}
              </h2>
              <a
              href={slide.ctaHref}
              className="inline-block bg-white text-black hover:bg-black hover:text-white transition-colors duration-300"
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: '12px',
                fontWeight: 500,
                letterSpacing: '2px',
                textTransform: 'uppercase',
                padding: '12px 28px',
                borderRadius: 0
              }}>
              
                {slide.cta}
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Dots */}
      <div
        className="absolute bottom-5 right-8 flex gap-2"
        style={{ zIndex: 10 }}>
        
        {slides.map((_, idx) =>
        <button
          key={idx}
          onClick={() => setCurrent(idx)}
          aria-label={`Go to slide ${idx + 1}`}
          className="transition-all duration-300"
          style={{
            width: idx === current ? '24px' : '8px',
            height: '8px',
            borderRadius: '4px',
            background: idx === current ? '#ffffff' : 'rgba(255,255,255,0.5)',
            border: 'none',
            cursor: 'pointer',
            padding: 0
          }} />

        )}
      </div>

      {/* Pause button */}
      {/* <button
        onClick={() => setPaused((p) => !p)}
        className="absolute top-4 left-4 flex items-center gap-2 text-white"
        style={{
          zIndex: 10,
          fontFamily: 'Poppins, sans-serif',
          fontSize: '11px',
          fontWeight: 300,
          letterSpacing: '1.5px',
          textTransform: 'uppercase',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          padding: '8px'
        }}
        aria-label={paused ? 'Play slideshow' : 'Pause slideshow'}>
        
        {paused ?
        <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
            <polygon points="2,1 13,7 2,13" />
          </svg> :

        <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
            <rect x="2" y="1" width="4" height="12" />
            <rect x="8" y="1" width="4" height="12" />
          </svg>
        }
        <span>{paused ? 'Play slideshow' : 'Pause slideshow'}</span>
      </button> */}
    </section>);

}