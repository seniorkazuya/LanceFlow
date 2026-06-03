'use client';

import { useState } from 'react';

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <form
      id="contact-form"
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        const form = e.currentTarget;
        if (form.checkValidity()) {
          setSubmitted(true);
          form.reset();
        } else {
          form.reportValidity();
        }
      }}
    >
      <div className="field">
        <label htmlFor="name">Name</label>
        <input id="name" name="name" type="text" placeholder="Your name" required />
      </div>
      <div className="field">
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" placeholder="you@email.com" required />
      </div>
      <div className="field">
        <label htmlFor="msg">Message</label>
        <textarea id="msg" name="msg" rows={4} placeholder="How can we help?" required />
      </div>
      <button className="btn btn-primary" type="submit">
        Send message
      </button>
      <p
        id="form-note"
        style={{
          marginTop: 12,
          color: 'var(--brand)',
          fontWeight: 600,
          display: submitted ? 'block' : 'none',
        }}
      >
        Thanks! We&apos;ll be in touch soon. ✓
      </p>
    </form>
  );
}
