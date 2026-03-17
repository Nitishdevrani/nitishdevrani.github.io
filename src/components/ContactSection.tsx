export const ContactSection = () => {
    return (
        <section className="section-container" id="contact">
            <h2>Business Card</h2>
            <p style={{ maxWidth: '640px', marginBottom: '2rem' }}>
                Feel free to connect with me directly.
            </p>

            <div
                className="glass-card"
                style={{
                    maxWidth: '760px',
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.5rem',
                    flexWrap: 'wrap',
                }}
            >
                <img
                    src="/images/vertical-me.jpg"
                    alt="Nitish Devrani profile"
                    style={{
                        width: '120px',
                        height: '120px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '3px solid var(--accent-color)',
                        flexShrink: 0,
                    }}
                />

                <div style={{ minWidth: '260px', flex: 1 }}>
                    <h3 style={{ marginBottom: '0.75rem' }}>Nitish Devrani</h3>
                    <p style={{ marginBottom: '0.6rem' }}>Full Stack Developer</p>
                    <p style={{ marginBottom: '0.35rem' }}>
                        Email:{' '}
                        <a href="mailto:practiclemind@gmail.com">practiclemind@gmail.com</a>
                    </p>
                    <p>
                        LinkedIn:{' '}
                        <a
                            href="https://www.linkedin.com/in/nitishdevrani/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            https://www.linkedin.com/in/nitishdevrani/
                        </a>
                    </p>
                </div>
            </div>
        </section>
    );
};
