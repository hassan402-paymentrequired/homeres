/* eslint-disable curly */
import React, { useRef, useEffect, useState } from 'react';

interface Store {
  id: number;
  type: string;
  name: string;
  city: string;
  address: string;
  image: string;
  alt: string;
  href: string;
}

const stores: Store[] = [
{
  id: 1,
  type: 'Homère FLAGSHIP STORE',
  name: 'Homère FLAGSHIP STORE',
  city: 'Lagos',
  address: '/ Lagos mainland',
  image: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800&q=80',
  alt: 'Homère flagship store interior in Amsterdam with curated furniture displays',
  href: '#amsterdam'
},
{
  id: 2,
  type: 'Homère HOME STUDIO',
  name: 'Homère HOME STUDIO',
  city: 'Abuja',
  address: '/ Muhammad bello highway',
  image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80',
  alt: 'Homère home studio in Rotterdam showcasing interior design services',
  href: '#rotterdam'
},
{
  id: 3,
  type: 'Homère DESIGN GALLERY',
  name: 'Homère DESIGN GALLERY',
  city: 'Ikeja',
  address: '/ Government building',
  image: '/assets/images/coming.jpg',
  alt: 'Homère design gallery in Berlin featuring exclusive furniture and art pieces',
  href: '#berlin'
}];


export default function StoreLocations() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {if (entry.isIntersecting) setVisible(true);},
      { threshold: 0.1 }
    );

    if (ref.current) {observer.observe(ref.current);}

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="stores"
      ref={ref}
      style={{
        background: '#060606',
        padding: '0'
      }}>
      
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)'
        }}
        className="stores-grid">
        
        {stores.map((store, idx) =>
        <div
          key={store.id}
          className="relative overflow-hidden group"
          style={{
            opacity: visible ? 1 : 0,
            transition: `opacity 0.7s ease ${idx * 0.15}s`
          }}>
          
            {/* Background image */}
            <div style={{ aspectRatio: '4/5', position: 'relative', overflow: 'hidden' }}>
              <img
              src={store.image}
              alt={store.alt}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            
              <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.1) 60%)' }} />
            
              {/* Content overlay */}
              <div
              className="absolute bottom-0 left-0 right-0"
              style={{ padding: '32px 28px' }}>
              
                <p
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '10px',
                  fontWeight: 300,
                  letterSpacing: '2.5px',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.7)',
                  marginBottom: '8px'
                }}>
                
                  {store.type}
                </p>
                <h3
                style={{
                  fontFamily: '"Proza Libre", sans-serif',
                  fontSize: 'calc(29px * 0.63)',
                  fontWeight: 500,
                  letterSpacing: '0.025em',
                  textTransform: 'uppercase',
                  color: '#ffffff',
                  lineHeight: 1.1,
                  marginBottom: '8px'
                }}>
                
                  {store.name}
                </h3>
                <p
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '12px',
                  fontWeight: 300,
                  letterSpacing: '0.5px',
                  color: 'rgba(255,255,255,0.85)',
                  marginBottom: '16px'
                }}>
                
                  <strong style={{ fontWeight: 500 }}>{store.city}</strong>
                  {store.address}
                </p>
                <a
                href={store.href}
                style={{
                  display: 'inline-block',
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '11px',
                  fontWeight: 400,
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  color: '#ffffff',
                  textDecoration: 'none',
                  border: '1px solid rgba(255,255,255,0.6)',
                  padding: '9px 20px',
                  transition: 'background 0.3s ease, border-color 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.15)';
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = '#ffffff';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.6)';
                }}>
                
                  Opening hours
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 900px) {
          .stores-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>);

}