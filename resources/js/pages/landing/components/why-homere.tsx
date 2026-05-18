import { WHY_CHOOSE } from '@/data/brand';

export default function WhyHomere() {
    return (
        <section
            id="why-homere"
            style={{
                padding: '64px 30px',
                background: '#f5f5f3',
                borderTop: '1px solid #e8e8e1',
                borderBottom: '1px solid #e8e8e1',
            }}
        >
            <div style={{ maxWidth: '1500px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <h2
                        style={{
                            fontFamily: '"Proza Libre", sans-serif',
                            fontSize: 'calc(29px * 0.63)',
                            fontWeight: 500,
                            letterSpacing: '0.025em',
                            textTransform: 'uppercase',
                            color: '#060606',
                            margin: '0 0 12px',
                        }}
                    >
                        Why Choose Homère
                    </h2>
                    <p
                        style={{
                            fontFamily: 'Poppins, sans-serif',
                            fontSize: '13px',
                            fontWeight: 300,
                            color: '#6b6b6b',
                            maxWidth: '560px',
                            margin: '0 auto',
                            lineHeight: 1.7,
                        }}
                    >
                        Timeless elegance meets contemporary trends — curated
                        collections designed to inspire and delight.
                    </p>
                </div>
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(5, 1fr)',
                        gap: '24px',
                    }}
                    className="why-grid"
                >
                    {WHY_CHOOSE.map((item) => (
                        <div key={item.title}>
                            <h3
                                style={{
                                    fontFamily: '"Proza Libre", sans-serif',
                                    fontSize: '14px',
                                    fontWeight: 500,
                                    color: '#060606',
                                    margin: '0 0 8px',
                                    letterSpacing: '0.02em',
                                }}
                            >
                                {item.title}
                            </h3>
                            <p
                                style={{
                                    fontFamily: 'Poppins, sans-serif',
                                    fontSize: '12px',
                                    fontWeight: 300,
                                    color: '#6b6b6b',
                                    margin: 0,
                                    lineHeight: 1.7,
                                }}
                            >
                                {item.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
            <style>{`
                @media (max-width: 1100px) {
                    .why-grid { grid-template-columns: repeat(3, 1fr) !important; }
                }
                @media (max-width: 700px) {
                    .why-grid { grid-template-columns: 1fr !important; }
                }
            `}</style>
        </section>
    );
}
