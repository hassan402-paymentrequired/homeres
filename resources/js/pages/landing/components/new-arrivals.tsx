import React, { useRef, useEffect, useState } from 'react';
import type { QuickViewProduct } from './product-quick-view';
import ProductQuickView from './product-quick-view';

interface Product {
  id: number;
  name: string;
  brand: string;
  price: string;
  image: string;
  alt: string;
  href: string;
  isNew?: boolean;
  category?: string;
  description?: string;
}

const newArrivals: Product[] = [
{
  id: 1,
  name: 'Floor lamp Cassini - gold',
  brand: 'HEMERE',
  price: '₦ 14485.00',
  image: "/assets/images/Floor lamp Cassini - gold 2.jpg",
  alt: 'Matte travertine decorative vessel with organic form, 28cm height',
  href: '/products/P-006',
  isNew: true,
  category: 'Home Accessories',
  description: 'A hand-formed vessel in matte travertine stone. Each piece is unique, with natural variations in tone and texture. Perfect as a standalone object or paired with dried botanicals.'
},
{
  id: 2,
  name: 'Candle — Amber Oud 220g',
  brand: 'HEMERE',
  price: '₦ 6448.00',
  image: "/assets/images/Golden Minnie Mouse - standing.jpg",
  alt: 'Luxury amber oud scented candle in glass vessel, 220g',
  href: '/products/P-010',
  isNew: true,
  category: 'Candles & Fragrance',
  description: 'A rich, resinous amber oud fragrance in a hand-poured soy wax candle. 220g with an approximate burn time of 45 hours. The glass vessel can be repurposed after use.'
},
{
  id: 3,
  name: 'Cub winder - cover brown',
  brand: 'HEMERE',
  price: '₦ 9445.00',
  image: "/assets/images/Cub winder - cover brown .jpg",
  alt: 'Ivory boucle cushion with textured weave, 50x50cm',
  href: '/products/P-002',
  category: 'Textiles',
  description: 'A generously filled cushion in tightly woven ivory boucle. Feather and down inner. Removable cover with concealed zip.'
},
{
  id: 4,
  name: 'Globo tray',
  brand: 'HEMERE',
  price: '₦ 14445.00',
  image: "/assets/images/Globo tray 2.jpg",
  alt: 'Smoked glass statement vase with elongated silhouette, 22cm wide 40cm tall',
  href: '/products/P-007',
  isNew: true,
  category: 'Home Accessories',
  description: 'A statement vase in deep smoked glass with an elongated silhouette. Mouth-blown by artisans in the Czech Republic. Ideal for single-stem arrangements.'
},
{
  id: 5,
  name: 'Book — The Art of Interiors',
  brand: 'HEMERE',
  price: '₦ 5448.00',
  image: "/assets/images/Globe Top gold .jpg",
  alt: 'Coffee table book featuring curated interior design photography',
  href: '/products/P-008',
  category: 'Coffee Table Books',
  description: 'A curated collection of the world\'s most considered interiors. 320 pages of photography, essays, and conversations with leading designers.'
}];


export default function NewArrivals() {
  const [visible, setVisible] = useState(false);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<QuickViewProduct | null>(null);


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
      id="new-arrivals"
      ref={ref}
      style={{
        padding: '48px 30px',
        maxWidth: '1500px',
        margin: '0 auto'
      }}>
      
      {/* Section header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          marginBottom: '28px'
        }}>
        
        <h2
          style={{
            fontFamily: '"Proza Libre", sans-serif',
            fontSize: 'calc(29px * 0.63)',
            fontWeight: 500,
            letterSpacing: '0.025em',
            textTransform: 'uppercase',
            color: '#060606',
            lineHeight: 1.1,
            margin: 0
          }}>
          
          New Arrivals
        </h2>
        <a
          href="#collections"
          style={{
            fontFamily: 'Poppins, sans-serif',
            fontSize: '11px',
            fontWeight: 300,
            letterSpacing: '2px',
            textTransform: 'uppercase',
            color: '#060606',
            textDecoration: 'none',
            borderBottom: '1px solid #060606',
            paddingBottom: '1px'
          }}>
          
          View all
        </a>
      </div>

      {/* Product grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '22px'
        }}
        className="products-grid">
        
        {newArrivals.map((product, idx) =>
        <div
          key={product.id}
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(20px)',
            transition: `opacity 0.5s ease ${idx * 0.1}s, transform 0.5s ease ${idx * 0.1}s`
          }}>
          
            {/* Image wrapper */}
            <div
            className="relative overflow-hidden"
            style={{
              aspectRatio: '3/4',
              background: '#f5f5f3',
              borderRadius: '10px',
              marginBottom: '12px'
            }}
            onMouseEnter={() => setHoveredId(product.id)}
            onMouseLeave={() => setHoveredId(null)}>
            
              <img
              src={product.image}
              alt={product.alt}
              className="w-full h-full object-cover transition-transform duration-700"
              style={{ transform: hoveredId === product.id ? 'scale(1.05)' : 'scale(1)' }} />
            

              {/* New badge */}
              {product.isNew &&
            <span
              style={{
                position: 'absolute',
                top: '10px',
                left: '10px',
                background: '#060606',
                color: '#ffffff',
                fontFamily: 'Poppins, sans-serif',
                fontSize: '10px',
                fontWeight: 500,
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                padding: '4px 8px'
              }}>
              
                  New
                </span>
            }

              {/* Hover actions */}
              <div
              className="absolute bottom-0 left-0 right-0 flex flex-col gap-2 p-3 transition-all duration-300"
              style={{
                opacity: hoveredId === product.id ? 1 : 0,
                transform: hoveredId === product.id ? 'translateY(0)' : 'translateY(8px)'
              }}>
              
                <button
                style={{
                  background: '#000000',
                  color: '#ffffff',
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '11px',
                  fontWeight: 500,
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase',
                  padding: '10px 16px',
                  border: 'none',
                  cursor: 'pointer',
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  borderRadius: 0
                }}>
                
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="9" cy="21" r="1" />
                    <circle cx="20" cy="21" r="1" />
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                  </svg>
                  Add to cart
                </button>
                <button
                onClick={() => setQuickViewProduct({ id: product.id, name: product.name, brand: product.brand, price: product.price, image: product.image, alt: product.alt, isNew: product.isNew, category: product.category, description: product.description })}
                style={{
                  background: 'rgba(255,255,255,0.92)',
                  color: '#060606',
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '11px',
                  fontWeight: 500,
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase',
                  padding: '10px 16px',
                  border: 'none',
                  cursor: 'pointer',
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  borderRadius: 0
                }}>
                
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  Quick view
                </button>
              </div>
            </div>

            {/* Product info */}
            <a
            href={product.href}
            style={{ textDecoration: 'none', display: 'block' }}>
            
              <div style={{ marginBottom: '4px' }}>
                <p
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '12px',
                  fontWeight: 300,
                  letterSpacing: '0.5px',
                  color: '#060606',
                  margin: 0,
                  lineHeight: 1.4
                }}>
                
                  {product.name}
                </p>
                <p
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '11px',
                  fontWeight: 300,
                  letterSpacing: '1px',
                  color: '#6b6b6b',
                  margin: '2px 0 0',
                  textTransform: 'uppercase'
                }}>
                
                  {product.brand}
                </p>
              </div>
              <p
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: '12px',
                fontWeight: 400,
                letterSpacing: '0.5px',
                color: '#060606',
                margin: '6px 0 0'
              }}>
              
                {product.price}
              </p>
            </a>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 1200px) {
          .products-grid { grid-template-columns: repeat(4, 1fr) !important; }
        }
        @media (max-width: 900px) {
          .products-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 640px) {
          .products-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>

      {quickViewProduct && <ProductQuickView product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />}
    </section>);

}