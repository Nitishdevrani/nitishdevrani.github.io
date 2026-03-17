import React, { useState } from 'react';

const API_URL = import.meta.env.PROD
    ? '/api/contact'
    : 'http://localhost:3001/api/contact';

interface FormData {
    name: string;
    email: string;
    message: string;
}

export const ContactSection: React.FC = () => {
    const [form, setForm] = useState<FormData>({ name: '', email: '', message: '' });
    const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
    const [errorMsg, setErrorMsg] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('sending');
        setErrorMsg('');

        try {
            const res = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Something went wrong');
            }

            setStatus('success');
            setForm({ name: '', email: '', message: '' });

            // Auto-hide success message after 5s
            setTimeout(() => setStatus('idle'), 5000);
        } catch (err: any) {
            setStatus('error');
            setErrorMsg(err.message || 'Failed to send message. Please try again.');
        }
    };

    return (
        <section className="section-container" id="contact">
            <h2>Contact Me</h2>
            <p style={{ maxWidth: '600px', marginBottom: '2rem' }}>
                Have a project in mind or just want to say hi? Drop me a message and I'll get back to you!
            </p>
            <h1>practiclemind@gmail.com</h1>
            or find me <a href="https://www.linkedin.com/in/nitishdevrani/" target="_blank" rel="noopener noreferrer">on LinkedIn</a>
        </section>
    );
};
