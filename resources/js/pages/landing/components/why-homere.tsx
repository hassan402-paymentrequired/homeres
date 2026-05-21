import { useEffect, useRef, useState, type ReactNode } from 'react';
import { BRAND, TESTIMONIALS, WHY_CHOOSE } from '@/data/brand';

const ICONS: Record<string, ReactNode> = {
    'Quality Assurance': (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
                d="M12 3l7 3v6c0 4.5-3 8.5-7 9-4-.5-7-4.5-7-9V6l7-3z"
                stroke="currentColor"
                strokeWidth="1.25"
            />
            <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.25" />
        </svg>
    ),
    'Diverse Selection': (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
            <rect x="3" y="3" width="8" height="8" stroke="currentColor" strokeWidth="1.25" />
            <rect x="13" y="3" width="8" height="8" stroke="currentColor" strokeWidth="1.25" />
            <rect x="3" y="13" width="8" height="8" stroke="currentColor" strokeWidth="1.25" />
            <rect x="13" y="13" width="8" height="8" stroke="currentColor" strokeWidth="1.25" />
        </svg>
    ),
    'Exceptional Service': (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
                d="M12 20c-4-2.5-7-6-7-10a4 4 0 018 0 4 4 0 018 0c0 4-3 7.5-7 10z"
                stroke="currentColor"
                strokeWidth="1.25"
            />
        </svg>
    ),
    'Affordable Luxury': (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
                d="M12 3l2.2 6.8H21l-5.5 4 2.1 6.7L12 16.5 6.4 20.5l2.1-6.7L3 9.8h6.8L12 3z"
                stroke="currentColor"
                strokeWidth="1.25"
            />
        </svg>
    ),
    'Convenient Shopping': (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
                d="M6 6h15l-1.5 9h-12L6 6z"
                stroke="currentColor"
                strokeWidth="1.25"
            />
            <path d="M6 6L5 3H2" stroke="currentColor" strokeWidth="1.25" />
            <circle cx="9" cy="20" r="1" fill="currentColor" />
            <circle cx="18" cy="20" r="1" fill="currentColor" />
        </svg>
    ),
};

const HIGHLIGHT_INDEX = 2;
const SLIDE_INTERVAL_MS = 6000;
const WHY_SECTION_BG =
    'https://images.unsplash.com/photo-1719368420509-059a3b22579e?auto=format&fit=crop&w=2000&q=80';

function TestimonialSlider({ enabled }: { enabled: boolean }) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [paused, setPaused] = useState(false);

    const goTo = (index: number) => {
        const total = TESTIMONIALS.length;
        setActiveIndex(((index % total) + total) % total);
    };

    useEffect(() => {
        if (!enabled || paused || TESTIMONIALS.length <= 1) {
            return;
        }

        const id = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % TESTIMONIALS.length);
        }, SLIDE_INTERVAL_MS);

        return () => clearInterval(id);
    }, [enabled, paused]);

    return (
        <div
            id="testimonials"
            className="why-testimonial-slider"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            aria-roledescription="carousel"
            aria-label="Customer testimonials"
        >
            <p className="why-testimonial-label">What our customers say</p>

            <div className="why-testimonial-viewport" aria-live="polite">
                {TESTIMONIALS.map((t, idx) => (
                    <blockquote
                        key={t.author}
                        className={`why-testimonial-slide${idx === activeIndex ? ' is-active' : ''}`}
                        aria-hidden={idx !== activeIndex}
                    >
                        <p className="why-testimonial-quote">&ldquo;{t.quote}&rdquo;</p>
                        <footer className="why-testimonial-author">
                            — {t.author}, {t.location}
                        </footer>
                    </blockquote>
                ))}
            </div>

            {/* <div className="why-testimonial-controls"> */}
                {/* <button
                    type="button"
                    className="why-testimonial-nav"
                    onClick={() => goTo(activeIndex - 1)}
                    aria-label="Previous testimonial"
                >
                    ←
                </button> */}
                {/* <div className="why-testimonial-dots" role="tablist" aria-label="Testimonial slides">
                    {TESTIMONIALS.map((t, idx) => (
                        <button
                            key={t.author}
                            type="button"
                            role="tab"
                            aria-selected={idx === activeIndex}
                            aria-label={`Show testimonial from ${t.author}`}
                            className={`why-testimonial-dot${idx === activeIndex ? ' is-active' : ''}`}
                            onClick={() => goTo(idx)}
                        />
                    ))}
                </div> */}
                {/* <button
                    type="button"
                    className="why-testimonial-nav"
                    onClick={() => goTo(activeIndex + 1)}
                    aria-label="Next testimonial"
                >
                    →
                </button> */}
            {/* </div> */}
        </div>
    );
}

export default function WhyHomere() {
    const [visible, setVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                }
            },
            { threshold: 0.12 },
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <section
            id="why-homere"
            ref={ref}
            className="why-section"
            style={{
                position: 'relative',
                padding: '10px 20px',
                borderTop: '1px solid #e8e8e1',
                borderBottom: '1px solid #e8e8e1',
                overflow: 'hidden',
            }}
        >
            <div className="why-section-media" aria-hidden="true">
                <img src={WHY_SECTION_BG} alt="" loading="lazy" />
            </div>
            <div className="why-inner">
                <div
                    className="why-layout"
                    style={{
                        opacity: visible ? 1 : 0,
                        transform: visible ? 'translateY(0)' : 'translateY(28px)',
                        transition: 'opacity 0.7s ease, transform 0.7s ease',
                    }}
                >
                    <div className="why-intro-panel">
                        <p
                            style={{
                                fontFamily: 'Poppins, sans-serif',
                                fontSize: '10px',
                                fontWeight: 500,
                                letterSpacing: '2.5px',
                                textTransform: 'uppercase',
                                color: '#6b6b6b',
                                margin: '0 0 14px',
                            }}
                        >
                            The Homère difference
                        </p>
                        <h2
                            style={{
                                fontFamily: '"Proza Libre", sans-serif',
                                fontSize: 'calc(29px * 0.75)',
                                fontWeight: 500,
                                letterSpacing: '0.025em',
                                textTransform: 'uppercase',
                                color: '#060606',
                                lineHeight: 1.15,
                                margin: '0 0 16px',
                            }}
                        >
                            Why Choose Homère
                        </h2>
                        <p
                            style={{
                                fontFamily: 'Poppins, sans-serif',
                                fontSize: '14px',
                                fontWeight: 300,
                                color: '#6b6b6b',
                                lineHeight: 1.8,
                                margin: '0 0 28px',
                            }}
                        >
                            {BRAND.tagline}
                        </p>

                        <div className="why-stats">
                            <div className="why-stat">
                                <span className="why-stat-value">{BRAND.founded}</span>
                                <span className="why-stat-label">Established</span>
                            </div>
                            <div className="why-stat">
                                <span className="why-stat-value">5</span>
                                <span className="why-stat-label">Curated categories</span>
                            </div>
                            <div className="why-stat">
                                <span className="why-stat-value">VI</span>
                                <span className="why-stat-label">Lagos showroom</span>
                            </div>
                        </div>

                        <TestimonialSlider enabled={visible} />
                    </div>

                    <div className="why-benefits-panel">
                        <div className="why-bento">
                        {WHY_CHOOSE.map((item, idx) => {
                            const isHighlight = idx === HIGHLIGHT_INDEX;
                            const isLast = idx === WHY_CHOOSE.length - 1;

                            return (
                                <article
                                    key={item.title}
                                    className={`why-card${isHighlight ? ' why-card--highlight' : ''}${isLast ? ' why-card--wide' : ''}`}
                                    style={{
                                        opacity: visible ? 1 : 0,
                                        transform: visible ? 'translateY(0)' : 'translateY(20px)',
                                        transition: `opacity 0.55s ease ${0.1 + idx * 0.07}s, transform 0.55s ease ${0.1 + idx * 0.07}s, box-shadow 0.35s ease, border-color 0.35s ease`,
                                    }}
                                >
                                    <div className="why-card-top">
                                        <span className="why-card-index">
                                            {String(idx + 1).padStart(2, '0')}
                                        </span>
                                        <span className="why-card-icon">
                                            {ICONS[item.title]}
                                        </span>
                                    </div>
                                    <h3 className="why-card-title">{item.title}</h3>
                                    <p className="why-card-desc">{item.description}</p>
                                </article>
                            );
                        })}
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .why-section {
                    background: #f5f5f3;
                }
                .why-section-media {
                    position: absolute;
                    inset: 0;
                    z-index: 0;
                    pointer-events: none;
                }
                .why-section-media img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    object-position: center;
                    display: block;
                }
                .why-section-media::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(
                        to right,
                        rgba(245, 245, 243, 0.9) 0%,
                        rgba(245, 245, 243, 0.78) 30%,
                        rgba(245, 245, 243, 0.55) 50%,
                        rgba(245, 245, 243, 0.35) 70%,
                        rgba(245, 245, 243, 0.2) 100%
                    );
                }
                .why-inner {
                    max-width: 1500px;
                    margin: 0 auto;
                    position: relative;
                    z-index: 1;
                    width: 100%;
                    min-width: 0;
                }
                .why-intro-panel,
                .why-benefits-panel {
                    min-width: 0;
                    max-width: 100%;
                }
                .why-intro-panel {
                    padding: 0;
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                    min-height: 0;
                }
                .why-layout {
                    display: grid;
                    grid-template-columns: minmax(0, 1fr) minmax(0, 2fr);
                    gap: 24px;
                    align-items: stretch;
                }
                .why-benefits-panel {
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                    min-height: 0;
                }
                .why-stats {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 20px 28px;
                    margin-bottom: 28px;
                    padding-bottom: 28px;
                    border-bottom: 1px solid rgba(224, 224, 216, 0.9);
                }
                .why-stat {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }
                .why-stat-value {
                    font-family: "Proza Libre", sans-serif;
                    font-size: 28px;
                    font-weight: 500;
                    color: #060606;
                    line-height: 1;
                }
                .why-stat-label {
                    font-family: Poppins, sans-serif;
                    font-size: 10px;
                    font-weight: 400;
                    letter-spacing: 1px;
                    text-transform: uppercase;
                    color: #6b6b6b;
                }
                .why-testimonial-slider {
                    margin-top: 4px;
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    min-height: 0;
                }
                .why-testimonial-label {
                    font-family: Poppins, sans-serif;
                    font-size: 10px;
                    font-weight: 500;
                    letter-spacing: 2px;
                    text-transform: uppercase;
                    color: #6b6b6b;
                    margin: 0 0 14px;
                }
                .why-testimonial-viewport {
                    position: relative;
                    flex: 1;
                    min-height: 160px;
                }
                .why-testimonial-slide {
                    position: absolute;
                    inset: 0;
                    margin: 0;
                    padding: 28px 24px;
                    background: rgba(255, 255, 255, 0.9);
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    border: 1px solid rgba(232, 232, 225, 0.95);
                    border-left: 3px solid #060606;
                    opacity: 0;
                    visibility: hidden;
                    transition: opacity 0.55s ease, visibility 0.55s ease;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                }
                .why-testimonial-slide.is-active {
                    opacity: 1;
                    visibility: visible;
                    z-index: 1;
                }
                .why-testimonial-quote {
                    font-family: Poppins, sans-serif;
                    font-size: 14px;
                    font-weight: 300;
                    font-style: italic;
                    color: #060606;
                    line-height: 1.8;
                    margin: 0 0 16px;
                }
                .why-testimonial-author {
                    font-family: Poppins, sans-serif;
                    font-size: 11px;
                    font-weight: 500;
                    letter-spacing: 1.5px;
                    text-transform: uppercase;
                    color: #6b6b6b;
                }
                .why-testimonial-controls {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 12px;
                    margin-top: 16px;
                }
                .why-testimonial-nav {
                    flex-shrink: 0;
                    width: 36px;
                    height: 36px;
                    border: 1px solid #e0e0d8;
                    background: #ffffff;
                    color: #060606;
                    font-size: 14px;
                    cursor: pointer;
                    transition: background 0.2s ease, border-color 0.2s ease;
                }
                .why-testimonial-nav:hover {
                    background: #060606;
                    border-color: #060606;
                    color: #ffffff;
                }
                .why-testimonial-dots {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    flex: 1;
                }
                .why-testimonial-dot {
                    width: 8px;
                    height: 8px;
                    padding: 0;
                    border: none;
                    border-radius: 50%;
                    background: #d0d0c8;
                    cursor: pointer;
                    transition: background 0.25s ease, transform 0.25s ease;
                }
                .why-testimonial-dot.is-active {
                    background: #060606;
                    transform: scale(1.15);
                }
                .why-bento {
                    position: relative;
                    z-index: 1;
                    display: grid;
                    grid-template-columns: repeat(3, minmax(0, 1fr));
                    grid-template-rows: repeat(2, minmax(0, 1fr));
                    gap: 16px;
                    flex: 1;
                    min-height: 0;
                    box-sizing: border-box;
                    align-items: stretch;
                }
                .why-card {
                    background: rgba(255, 255, 255, 0.88);
                    backdrop-filter: blur(14px);
                    -webkit-backdrop-filter: blur(14px);
                    border: 1px solid rgba(232, 232, 225, 0.9);
                    padding: 20px 18px;
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    min-height: 0;
                    height: 100%;
                }
                .why-card:hover {
                    border-color: #d0d0c8;
                    box-shadow: 0 12px 32px rgba(6, 6, 6, 0.06);
                }
                .why-card--highlight {
                    background: rgba(6, 6, 6, 0.9);
                    backdrop-filter: blur(16px);
                    -webkit-backdrop-filter: blur(16px);
                    border-color: rgba(6, 6, 6, 0.95);
                    color: #ffffff;
                }
                .why-card--highlight:hover {
                    border-color: #060606;
                    box-shadow: 0 16px 40px rgba(6, 6, 6, 0.2);
                }
                .why-card--wide {
                    grid-column: span 2;
                }
                .why-card--highlight .why-card-index,
                .why-card--highlight .why-card-icon,
                .why-card--highlight .why-card-title {
                    color: #ffffff;
                }
                .why-card--highlight .why-card-desc {
                    color: rgba(255, 255, 255, 0.72);
                }
                .why-card-top {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 4px;
                }
                .why-card-index {
                    font-family: "Proza Libre", sans-serif;
                    font-size: 11px;
                    font-weight: 500;
                    letter-spacing: 0.15em;
                    color: #999;
                }
                .why-card-icon {
                    display: flex;
                    color: #060606;
                }
                .why-card-title {
                    font-family: "Proza Libre", sans-serif;
                    font-size: 15px;
                    font-weight: 500;
                    letter-spacing: 0.04em;
                    text-transform: uppercase;
                    color: #060606;
                    margin: 0;
                    line-height: 1.3;
                }
                .why-card-desc {
                    font-family: Poppins, sans-serif;
                    font-size: 12px;
                    font-weight: 300;
                    color: #6b6b6b;
                    margin: 0;
                    line-height: 1.65;
                }
                @media (max-width: 1024px) {
                    .why-layout {
                        grid-template-columns: 1fr;
                        gap: 28px;
                    }
                    .why-intro-panel,
                    .why-benefits-panel {
                        height: auto;
                    }
                    .why-testimonial-slider {
                        flex: none;
                    }
                    .why-testimonial-viewport {
                        flex: none;
                        min-height: 200px;
                    }
                    .why-bento {
                        flex: none;
                        grid-template-rows: auto auto;
                        min-height: 0;
                    }
                    .why-card {
                        height: auto;
                        min-height: 140px;
                    }
                    .why-benefits-panel {
                        min-height: 0;
                    }
                    .why-section-media::after {
                        background: linear-gradient(
                            to bottom,
                            rgba(245, 245, 243, 0.88) 0%,
                            rgba(245, 245, 243, 0.72) 100%
                        );
                    }
                    .why-intro-panel {
                        padding: 0;
                    }
                }
                @media (max-width: 640px) {
                    .why-section {
                        padding: 48px 16px !important;
                    }
                    .why-bento {
                        grid-template-columns: 1fr;
                        grid-template-rows: auto;
                    }
                    .why-card--highlight,
                    .why-card--wide {
                        grid-column: auto;
                    }
                    .why-card {
                        height: auto;
                    }
                    .why-stat-value {
                        font-size: 24px;
                    }
                    .why-testimonial-viewport {
                        min-height: 220px;
                    }
                }
            `}</style>
        </section>
    );
}
