/* eslint-disable curly */
'use client';
import { Link } from '@inertiajs/react';
import React, { useState } from 'react';
import { BRAND } from '@/data/brand';

export default function SiteFooter() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();

    if (email) setSubscribed(true);
  };

  return (
    <footer
      style={{
        background: '#e8e8e1',
        color: '#0f0f0f',
      }}
    >
      {/* Newsletter strip */}
      <div
        style={{
          background: '#060606',
          padding: '40px 30px',
        }}
      >
        <div
          style={{
            maxWidth: '1500px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '32px',
            flexWrap: 'wrap',
          }}
        >
          <div>
            <h3
              style={{
                fontFamily: '"Proza Libre", sans-serif',
                fontSize: 'calc(29px * 0.57)',
                fontWeight: 500,
                letterSpacing: '0.025em',
                textTransform: 'uppercase',
                color: '#ffffff',
                lineHeight: 1.1,
                marginBottom: '6px',
              }}
            >
              Join the Homère list
            </h3>
            <p
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: '12px',
                fontWeight: 300,
                letterSpacing: '0.5px',
                color: 'rgba(255,255,255,0.65)',
                margin: 0,
              }}
            >
              Curated interiors. Collectible accessories. 10% off when you subscribe.
            </p>
          </div>
          {!subscribed ? (
            <form
              onSubmit={handleSubscribe}
              style={{ display: 'flex', gap: '0', flexShrink: 0 }}
            >
              <input
                type="email"
                placeholder="E-mail address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '12px',
                  fontWeight: 300,
                  letterSpacing: '0.5px',
                  color: '#060606',
                  background: '#ffffff',
                  border: 'none',
                  borderRadius: 0,
                  padding: '12px 20px',
                  width: '280px',
                  outline: 'none',
                }}
              />
              <button
                type="submit"
                style={{
                  background: '#ffffff',
                  color: '#060606',
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '11px',
                  fontWeight: 500,
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  padding: '12px 24px',
                  border: '1px solid #ffffff',
                  borderLeft: '1px solid #e8e8e1',
                  cursor: 'pointer',
                  borderRadius: 0,
                  transition: 'background 0.3s ease, color 0.3s ease',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = '#060606';
                  (e.currentTarget as HTMLButtonElement).style.color = '#ffffff';
                  (e.currentTarget as HTMLButtonElement).style.borderColor = '#ffffff';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = '#ffffff';
                  (e.currentTarget as HTMLButtonElement).style.color = '#060606';
                  (e.currentTarget as HTMLButtonElement).style.borderColor = '#ffffff';
                }}
              >
                Subscribe
              </button>
            </form>
          ) : (
            <p
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: '13px',
                fontWeight: 400,
                letterSpacing: '1px',
                color: '#ffffff',
                margin: 0,
              }}
            >
              Thank you for subscribing!
            </p>
          )}
        </div>
      </div>

      {/* Main footer */}
      <div
        style={{
          maxWidth: '1500px',
          margin: '0 auto',
          padding: '48px 30px 32px',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '40px',
        }}
        className="footer-grid"
      >
        {/* Column 1: Brand */}
        <div>
          <Link
            href="/"
            style={{
              fontFamily: '"Proza Libre", sans-serif',
              fontSize: '20px',
              fontWeight: 500,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#060606',
              textDecoration: 'none',
              display: 'block',
              marginBottom: '16px',
            }}
          >
            Homère
          </Link>
          <p
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: '12px',
              fontWeight: 300,
              letterSpacing: '0.5px',
              color: '#4a4a4a',
              lineHeight: 1.7,
              marginBottom: '20px',
            }}
          >
Discover the art of elegant living with Homère Nigeria Limited. Transform your home into a sanctuary of style and comfort today          </p>
          {/* Social links */}
          <div style={{ marginBottom: '8px' }}>
            <p
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: '11px',
                fontWeight: 400,
                letterSpacing: '2px',
                textTransform: 'uppercase',
                color: '#060606',
                marginBottom: '12px',
              }}
            >
              Follow us
            </p>
            <div style={{ display: 'flex', gap: '14px' }}>
              {[
                { label: 'Instagram', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg> },
                { label: 'Pinterest', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2C6.48 2 2 6.48 2 12c0 4.24 2.65 7.86 6.39 9.29-.09-.78-.17-1.98.04-2.83.18-.77 1.22-5.17 1.22-5.17s-.31-.63-.31-1.56c0-1.46.85-2.55 1.9-2.55.9 0 1.33.67 1.33 1.48 0 .9-.58 2.26-.87 3.52-.25 1.05.52 1.9 1.54 1.9 1.85 0 3.09-2.37 3.09-5.17 0-2.14-1.44-3.64-3.5-3.64-2.38 0-3.78 1.79-3.78 3.63 0 .72.28 1.49.62 1.91.07.08.08.15.06.23-.06.26-.2.83-.23.95-.04.15-.13.18-.3.11-1.12-.52-1.82-2.17-1.82-3.49 0-2.84 2.06-5.44 5.94-5.44 3.12 0 5.54 2.22 5.54 5.19 0 3.1-1.95 5.59-4.66 5.59-.91 0-1.77-.47-2.06-1.03l-.56 2.09c-.2.78-.75 1.76-1.12 2.35.84.26 1.73.4 2.65.4 5.52 0 10-4.48 10-10S17.52 2 12 2z" /></svg> },
                { label: 'Facebook', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg> },
                { label: 'LinkedIn', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg> },
              ].map((social) => (
                <a
                  key={social.label}
                  href="#"
                  aria-label={social.label}
                  style={{
                    color: '#060606',
                    transition: 'color 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.color = '#6b6b6b';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.color = '#060606';
                  }}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Column 2: Customer Service */}
        <div>
          <h3
            style={{
              fontFamily: '"Proza Libre", sans-serif',
              fontSize: 'calc(29px * 0.57)',
              fontWeight: 500,
              letterSpacing: '0.025em',
              textTransform: 'uppercase',
              color: '#060606',
              lineHeight: 1.1,
              marginBottom: '20px',
            }}
          >
            Customer Service
          </h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {[
              { label: 'About Us', href: '/about' },
              { label: 'Design Studio', href: '/services' },
              { label: 'Contact', href: '/contact' },
              { label: 'Shop All', href: '/shop' },
              { label: 'FAQ', href: '/contact' },
            ].map((item) => (
              <li key={item.label} style={{ marginBottom: '10px' }}>
                <Link
                  href={item.href}
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: '12px',
                    fontWeight: 300,
                    letterSpacing: '0.5px',
                    color: '#4a4a4a',
                    textDecoration: 'none',
                    transition: 'color 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.color = '#060606';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.color = '#4a4a4a';
                  }}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Get in touch */}
        <div>
          <h3
            style={{
              fontFamily: '"Proza Libre", sans-serif',
              fontSize: 'calc(29px * 0.57)',
              fontWeight: 500,
              letterSpacing: '0.025em',
              textTransform: 'uppercase',
              color: '#060606',
              lineHeight: 1.1,
              marginBottom: '20px',
            }}
          >
            Get in touch
          </h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li style={{ marginBottom: '12px' }}>
              <a
                href={BRAND.phoneHref}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '12px',
                  fontWeight: 300,
                  letterSpacing: '0.5px',
                  color: '#4a4a4a',
                  textDecoration: 'none',
                  transition: 'color 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color = '#060606';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color = '#4a4a4a';
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.77a16 16 0 0 0 6.29 6.29l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                {BRAND.phone}
              </a>
            </li>
            <li style={{ marginBottom: '12px' }}>
              <a
                href={`mailto:${BRAND.email}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '12px',
                  fontWeight: 300,
                  letterSpacing: '0.5px',
                  color: '#4a4a4a',
                  textDecoration: 'none',
                  transition: 'color 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color = '#060606';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color = '#4a4a4a';
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                {BRAND.email}
              </a>
            </li>
          </ul>
        </div>

        {/* Column 4: Stores */}
        <div>
          <h3
            style={{
              fontFamily: '"Proza Libre", sans-serif',
              fontSize: 'calc(29px * 0.57)',
              fontWeight: 500,
              letterSpacing: '0.025em',
              textTransform: 'uppercase',
              color: '#060606',
              lineHeight: 1.1,
              marginBottom: '20px',
            }}
          >
            Our Stores
          </h3>
          <div style={{ marginBottom: '16px' }}>
            <p
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: '12px',
                fontWeight: 500,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                color: '#060606',
                margin: '0 0 2px',
              }}
            >
              Victoria Island, Lagos
            </p>
            <p
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: '12px',
                fontWeight: 300,
                letterSpacing: '0.5px',
                color: '#4a4a4a',
                margin: 0,
                lineHeight: 1.6,
              }}
            >
              {BRAND.address}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        style={{
          borderTop: '1px solid rgba(6,6,6,0.12)',
          padding: '20px 30px',
          maxWidth: '1500px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <p
          style={{
            fontFamily: 'Poppins, sans-serif',
            fontSize: '11px',
            fontWeight: 300,
            letterSpacing: '0.5px',
            color: '#6b6b6b',
            margin: 0,
          }}
        >
          &copy; 2026 {BRAND.legalName}
        </p>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          {['Visa', 'Mastercard', 'PayPal', 'Apple Pay', 'Google Pay'].map((method) => (
            <span
              key={method}
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: '10px',
                fontWeight: 400,
                letterSpacing: '0.5px',
                color: '#6b6b6b',
                background: 'rgba(6,6,6,0.06)',
                padding: '3px 8px',
                borderRadius: '3px',
              }}
            >
              {method}
            </span>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .footer-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 560px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}
