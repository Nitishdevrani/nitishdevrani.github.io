import { Github, Linkedin, Mail } from 'lucide-react';
import { iconProps } from './icon';

const email = 'nitishdevrani@gmail.com';

export function Contact() {
  return (
    <section id="contact" className="contact">
      <div data-reveal="scale" className="wrap contact-block">
        <div className="contact-blob contact-blob-a" />
        <div className="contact-blob contact-blob-b" />
        <div className="contact-inner">
          <div className="contact-label">06 · Contact</div>
          <h2 className="contact-title">Let’s build something thoughtful.</h2>
          <div className="contact-actions">
            <a href={`mailto:${email}`} className="contact-email">
              <Mail size={22} {...iconProps} />
              {email}
            </a>
            <a href="https://github.com/Nitishdevrani" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="contact-social">
              <Github size={22} {...iconProps} />
            </a>
            <a href="https://www.linkedin.com/in/nitishdevrani/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="contact-social">
              <Linkedin size={22} {...iconProps} />
            </a>
          </div>
        </div>
      </div>
      <footer className="wrap footer">
        <span>© 2026 Nitish Devrani · Nuremberg</span>
        <a href="#top">Back to top ↑</a>
      </footer>
    </section>
  );
}
