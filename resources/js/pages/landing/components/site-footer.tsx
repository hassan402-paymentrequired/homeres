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
      <div
        className="footer-wrapper"
        style={{
          maxWidth: '1500px',
          margin: '0 auto',
          padding: '48px 30px 0',
        }}
      >
        <div
          className="footer-newsletter"
          style={{
            marginBottom: '40px',
            paddingBottom: '40px',
            borderBottom: '1px solid rgba(6, 6, 6, 0.12)',
          }}
        >
          <div className="footer-newsletter-inner">
            <div className="footer-newsletter-copy">
              <h3
              style={{
                fontFamily: '"Proza Libre", sans-serif',
                fontSize: 'calc(29px * 0.57)',
                fontWeight: 500,
                letterSpacing: '0.025em',
                textTransform: 'uppercase',
                color: '#060606',
                lineHeight: 1.1,
                marginBottom: '8px',
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
                color: '#6b6b6b',
                margin: 0,
                maxWidth: '420px',
                lineHeight: 1.6,
              }}
            >
              Curated interiors. Collectible accessories. 10% off when you subscribe.
            </p>
            </div>
            {!subscribed ? (
            <form
              className="footer-newsletter-form"
              onSubmit={handleSubscribe}
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
                  border: '1px solid rgba(6, 6, 6, 0.15)',
                  borderRadius: 0,
                  padding: '12px 20px',
                  width: '100%',
                  minWidth: 0,
                  outline: 'none',
                }}
              />
              <button
                type="submit"
                className="footer-newsletter-submit"
                style={{
                  background: '#060606',
                  color: '#ffffff',
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '11px',
                  fontWeight: 500,
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  padding: '12px 24px',
                  border: '1px solid #060606',
                  cursor: 'pointer',
                  borderRadius: 0,
                  transition: 'background 0.3s ease, color 0.3s ease',
                  whiteSpace: 'nowrap',
                }}
              >
                Subscribe
              </button>
            </form>
          ) : (
            <p className="footer-newsletter-success">
              Thank you for subscribing!
            </p>
          )}
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '40px',
            paddingBottom: '32px',
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
            <div style={{ display: 'flex', gap: '10px' }}>
              {[
                { label: 'Instagram', href: "https://www.instagram.com/HOM%C3%88RE.landmark?igsh=N3c2MmcwM3Q0cnFx", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg> },
                { label: 'Pinterest', href: "https://nl.pinterest.com/HOM%C3%88RE/pins/", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2C6.48 2 2 6.48 2 12c0 4.24 2.65 7.86 6.39 9.29-.09-.78-.17-1.98.04-2.83.18-.77 1.22-5.17 1.22-5.17s-.31-.63-.31-1.56c0-1.46.85-2.55 1.9-2.55.9 0 1.33.67 1.33 1.48 0 .9-.58 2.26-.87 3.52-.25 1.05.52 1.9 1.54 1.9 1.85 0 3.09-2.37 3.09-5.17 0-2.14-1.44-3.64-3.5-3.64-2.38 0-3.78 1.79-3.78 3.63 0 .72.28 1.49.62 1.91.07.08.08.15.06.23-.06.26-.2.83-.23.95-.04.15-.13.18-.3.11-1.12-.52-1.82-2.17-1.82-3.49 0-2.84 2.06-5.44 5.94-5.44 3.12 0 5.54 2.22 5.54 5.19 0 3.1-1.95 5.59-4.66 5.59-.91 0-1.77-.47-2.06-1.03l-.56 2.09c-.2.78-.75 1.76-1.12 2.35.84.26 1.73.4 2.65.4 5.52 0 10-4.48 10-10S17.52 2 12 2z" /></svg> },
                { label: 'Facebook', href: "https://www.facebook.com/HOM%C3%88RE/", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg> },
                { label: 'LinkedIn', href: "https://nl.linkedin.com/company/HOM%C3%88REinterior?trk=similar-pages", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg> },
                { label: "Tiktok", href: "https://www.tiktok.com/@HOM%C3%88RE", icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M16 5.5v7.128a3.689 3.689 0 1 1-3.688-3.689c.181 0 .36.014.536.038v2.03a1.624 1.624 0 1 0 1.624 1.624V2h2.044a4.37 4.37 0 0 0 4.37 4.37V8.4C18.83 8.385 17.185 7.168 16 5.5z"/>
                  </svg>
                ) },
           
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
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
              { label: 'FAQ', href: '/help/faq' },
              { label: 'Shipping', href: '/help/shipping' },
              { label: 'Returns', href: '/help/returns' },
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
            {(
              [
                { label: 'Operations', email: BRAND.emails.operations },
                { label: 'Support', email: BRAND.emails.support },
              ] as const
            ).map((item) => (
            <li key={item.email} style={{ marginBottom: '12px' }}>
              <a
                href={`mailto:${item.email}`}
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
                {item.email}
              </a>
            </li>
            ))}
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
        .footer-newsletter-inner {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 32px;
          flex-wrap: wrap;
        }
        .footer-newsletter-copy {
          flex: 1 1 240px;
          min-width: 0;
        }
        .footer-newsletter-form {
          display: flex;
          flex: 1 1 320px;
          min-width: 0;
          max-width: 100%;
          gap: 0;
        }
        .footer-newsletter-form input {
          flex: 1 1 auto;
          box-sizing: border-box;
        }
        .footer-newsletter-success {
          font-family: Poppins, sans-serif;
          font-size: 13px;
          font-weight: 400;
          letter-spacing: 0.5px;
          color: #060606;
          margin: 0;
          flex: 1 1 320px;
          max-width: 100%;
        }
        .footer-newsletter-submit:hover {
          background: #2a2a2a !important;
        }
        @media (max-width: 768px) {
          .footer-newsletter {
            margin-bottom: 32px !important;
            padding-bottom: 32px !important;
          }
          .footer-newsletter-inner {
            flex-direction: column !important;
            align-items: stretch !important;
            justify-content: flex-start !important;
            gap: 20px !important;
          }
          .footer-newsletter-copy {
            flex: none !important;
            width: 100% !important;
          }
          .footer-newsletter-copy p {
            max-width: none !important;
          }
          .footer-newsletter-form,
          .footer-newsletter-success {
            flex: none !important;
            width: 100% !important;
          }
          .footer-newsletter-form {
            flex-direction: column !important;
          }
          .footer-newsletter-form input {
            width: 100% !important;
            flex: none !important;
            box-sizing: border-box !important;
          }
          .footer-newsletter-form button {
            width: 100% !important;
            border-top: 1px solid rgba(6, 6, 6, 0.15) !important;
          }
        }
        @media (max-width: 480px) {
          .footer-wrapper {
            padding-left: 16px !important;
            padding-right: 16px !important;
          }
        }
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
