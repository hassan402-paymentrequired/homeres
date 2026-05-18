import { TESTIMONIALS } from '@/data/brand';

export default function Testimonials() {
    return (
        <section
            id="testimonials"
            style={{
                padding: '64px 30px',
                maxWidth: '1500px',
                margin: '0 auto',
            }}
        >
            <h2
                style={{
                    fontFamily: '"Proza Libre", sans-serif',
                    fontSize: 'calc(29px * 0.63)',
                    fontWeight: 500,
                    letterSpacing: '0.025em',
                    textTransform: 'uppercase',
                    color: '#060606',
                    textAlign: 'center',
                    margin: '0 0 40px',
                }}
            >
                What Our Customers Say
            </h2>
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '32px',
                }}
                className="testimonials-grid"
            >
                {TESTIMONIALS.map((t) => (
                    <blockquote
                        key={t.author}
                        style={{
                            margin: 0,
                            padding: '32px',
                            background: '#f5f5f3',
                            borderLeft: '3px solid #060606',
                        }}
                    >
                        <p
                            style={{
                                fontFamily: 'Poppins, sans-serif',
                                fontSize: '14px',
                                fontWeight: 300,
                                color: '#060606',
                                lineHeight: 1.8,
                                margin: '0 0 16px',
                                fontStyle: 'italic',
                            }}
                        >
                            &ldquo;{t.quote}&rdquo;
                        </p>
                        <footer
                            style={{
                                fontFamily: 'Poppins, sans-serif',
                                fontSize: '11px',
                                fontWeight: 500,
                                letterSpacing: '1.5px',
                                textTransform: 'uppercase',
                                color: '#6b6b6b',
                            }}
                        >
                            — {t.author}, {t.location}
                        </footer>
                    </blockquote>
                ))}
            </div>
            <style>{`
                @media (max-width: 700px) {
                    .testimonials-grid { grid-template-columns: 1fr !important; }
                }
            `}</style>
        </section>
    );
}
