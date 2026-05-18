import React, { useRef, useEffect, useState } from 'react';

interface Collection {
  id: number;
  name: string;
  image: string;
  alt: string;
  href: string;
}

const collections: Collection[] = [
{
  id: 1,
  name: 'HOME LAMP',
  image: "/assets/images/Floor lamp Cassini - gold 2.jpg",
  alt: 'Curated home accessories including decorative bowls and sculptural objects',
  href: '#home-accessories'
},
{
  id: 2,
  name: 'CANDLES & HOME FRAGRANCE',
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_13d13c4a5-1772135351858.png",
  alt: 'Luxury candles and home fragrance collection with elegant packaging',
  href: '#candles'
},
{
  id: 3,
  name: 'COFFEE TABLE BOOKS',
  image: "https://images.unsplash.com/photo-1631888722728-1578b7ba6dee",
  alt: 'Curated selection of art and design coffee table books',
  href: '#books'
},
{
  id: 4,
  name: 'FURNITURE',
  image: "/assets/images/Crystal cut ashtray 2.jpg",
  alt: 'Designer furniture pieces including sofas, chairs and tables',
  href: '#furniture'
},
{
  id: 5,
  name: 'LIGHTING',
  image: "/assets/images/Golden Chandelier-1.jpg",
  alt: 'Statement lighting fixtures including pendant lamps and floor lights',
  href: '#lighting'
},
{
  id: 6,
  name: 'CUSHIONS & HOME TEXTILES',
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_1cb39e9f2-1772985472097.png",
  alt: 'Luxurious cushions and home textiles in natural fabrics',
  href: '#textiles'
}];


export default function CollectionsGrid() {
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
      id="collections"
      ref={ref}
      style={{
        padding: '48px 30px',
        maxWidth: '1500px',
        margin: '0 auto'
      }}>
      
      <h2
        style={{
          fontFamily: '"Proza Libre", sans-serif',
          fontSize: 'calc(29px * 0.63)',
          fontWeight: 500,
          letterSpacing: '0.025em',
          textTransform: 'uppercase',
          color: '#060606',
          marginBottom: '28px',
          lineHeight: 1.1
        }}>
        
        Collections
      </h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gap: '22px'
        }}
        className="collections-grid">
        
        {collections.map((col, idx) =>
        <a
          key={col.id}
          href={col.href}
          className="group block"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(20px)',
            transition: `opacity 0.5s ease ${idx * 0.08}s, transform 0.5s ease ${idx * 0.08}s`,
            textDecoration: 'none'
          }}>
          
            {/* Image container */}
            <div
            className="overflow-hidden"
            style={{
              aspectRatio: '3/4',
              background: '#f5f5f3',
              marginBottom: '12px',
              position: 'relative'
            }}>
            
              <img
              src={col.image}
              alt={col.alt}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            
              {/* Hover overlay */}
              <div
              className="absolute inset-0 bg-black transition-opacity duration-300 group-hover:opacity-10"
              style={{ opacity: 0 }} />
            
            </div>
            {/* Label */}
            <p
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: '11px',
              fontWeight: 300,
              letterSpacing: '2px',
              textTransform: 'uppercase',
              color: '#060606',
              textAlign: 'center',
              lineHeight: 1.4
            }}>
            
              {col.name}
            </p>
          </a>
        )}
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .collections-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 640px) {
          .collections-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </section>);

}