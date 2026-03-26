import { useState } from 'react';
import { Send } from 'lucide-react';

export function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    // TODO: Wire to API
    setSubmitted(true);
  }

  return (
    <section className="newsletter" id="newsletter-section">
      <div className="newsletter__inner container">
        <div className="newsletter__content">
          <span className="newsletter__label">STAY IN THE LOOP</span>
          <h2 className="newsletter__title">JOIN THE ORDER</h2>
          <p className="newsletter__text">
            Early access to new drops, exclusive offers, and stories from our workshop — delivered straight to your inbox.
          </p>
        </div>

        {submitted ? (
          <div className="newsletter__success animate-fadeIn">
            <span className="newsletter__success-icon">✓</span>
            <p className="newsletter__success-text">
              You're in. Welcome to the Order.
            </p>
          </div>
        ) : (
          <form className="newsletter__form" onSubmit={handleSubmit}>
            <div className="newsletter__input-wrapper">
              <input
                type="email"
                className="newsletter__input"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-label="Email address"
                id="newsletter-email"
              />
              <button type="submit" className="newsletter__submit" aria-label="Subscribe">
                <Send size={18} />
              </button>
            </div>
            <small className="newsletter__disclaimer">
              No spam, ever. Unsubscribe anytime.
            </small>
          </form>
        )}
      </div>
    </section>
  );
}
