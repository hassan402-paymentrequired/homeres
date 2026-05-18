import React, { useRef, useEffect, useState } from 'react';

export default function CustomMadeBanner() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
if (entry.isIntersecting) {
setVisible(true);
}
},
      { threshold: 0.1 }
    );

    if (ref.current) {
observer.observe(ref.current);
}

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="studio"
      ref={ref}
      style={{
        position: 'relative',
        overflow: 'hidden',
        minHeight: '420px',
        display: 'flex',
        alignItems: 'center'
      }}>
      
      {/* Background image */}
      <img
        src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1600&q=80"
        alt="Hemere bespoke interior design studio with custom furniture and architectural details"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ filter: 'brightness(0.45)' }} />
      

      {/* Content */}
      <div
        className="relative z-10 w-full"
        style={{ padding: '60px 30px', maxWidth: '1500px', margin: '0 auto' }}>
        
        <div
          style={{
            maxWidth: '560px',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(24px)',
            transition: 'opacity 0.7s ease, transform 0.7s ease'
          }}>
          
          <p
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: '11px',
              fontWeight: 300,
              letterSpacing: '3px',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.7)',
              marginBottom: '16px'
            }}>
            
            Exclusive Service
          </p>
          <h2
            style={{
              fontFamily: '"Proza Libre", sans-serif',
              fontSize: 'clamp(24px, 3.5vw, 42px)',
              fontWeight: 500,
              letterSpacing: '0.025em',
              textTransform: 'uppercase',
              color: '#ffffff',
              lineHeight: 1.1,
              marginBottom: '20px'
            }}>
            
            HEMERE Bespoke Design Service
          </h2>
          <p
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: '13px',
              fontWeight: 300,
              letterSpacing: '0.5px',
              color: 'rgba(255,255,255,0.8)',
              lineHeight: 1.7,
              marginBottom: '32px'
            }}>
            
            From concept to completion, our design studio crafts interiors that are entirely your own.
            Custom furniture, bespoke lighting, and curated accessories — all tailored to your vision.
          </p>
          <a
            href="#contact"
            style={{
              display: 'inline-block',
              background: '#ffffff',
              color: '#060606',
              fontFamily: 'Poppins, sans-serif',
              fontSize: '12px',
              fontWeight: 500,
              letterSpacing: '2px',
              textTransform: 'uppercase',
              padding: '13px 32px',
              textDecoration: 'none',
              borderRadius: 0,
              transition: 'background 0.3s ease, color 0.3s ease'
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = '#060606';
              (e.currentTarget as HTMLAnchorElement).style.color = '#ffffff';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = '#ffffff';
              (e.currentTarget as HTMLAnchorElement).style.color = '#060606';
            }}>
            
            More information
          </a>
        </div>
      </div>
    </section>);

}