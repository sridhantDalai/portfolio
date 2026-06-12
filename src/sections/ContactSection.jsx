import React, { useState } from 'react';
import SectionHeading from '../components/SectionHeading';
import { Markup } from '../components/Markup';
import { useSectionReveal } from '../hooks/useActiveSection.jsx';

export default function ContactSection({ data }) {
  const sectionRef = useSectionReveal('contact');
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });

  const [message, setMessage] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const subject = encodeURIComponent(
      "Portfolio Inquiry"
    );
    const body = encodeURIComponent(message);
    window.location.href =
      `mailto:${data.email}?subject=${subject}&body=${body}`;
  };

  return (
    <section ref={sectionRef} id="contact" className="bg-zinc-950 px-6 py-24 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <SectionHeading>Get in Touch</SectionHeading>
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12">
          <div>
            <h3 className="mb-6 font-mono text-2xl">{data.title}</h3>
            <p className="mb-8 text-gray-400">{data.description}</p>

            <div className="space-y-6">
              {data.infoItems.map((item) => (
                <div key={item.id} className="flex items-center">
                  <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-sm border border-zinc-500">
                    <span className="stroke-1 stroke-zinc-500">
                      <Markup html={item.icon} />
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">{item.key}</p>
                    <a href={item.link} target="_blank" rel="noreferrer" className="transition-colors hover:text-gray-500">
                      {item.value}
                    </a>
                  </div>
                </div>
              ))}

              <div className="pt-8">
                <h4 className="mb-4 font-mono text-lg">Find me on</h4>
                <div className="flex space-x-4">
                  {data.socialLinks.map((link) => (
                    <a key={link.id} href={link.link} aria-label={link.title} className="social-icon" target="_blank" rel="noreferrer">
                      <span className="h-6 w-6">
                        <Markup html={link.icon} />
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div>
              <form
                onSubmit={handleSubmit}
                className="rounded-sm border border-zinc-800 bg-black px-6 py-8 lg:px-8"
              >
                <h3 className="mb-6 font-mono text-2xl">
                  Send Message
                </h3>

                <div>
                  <label
                    htmlFor="message"
                    className="mb-2 block text-sm font-medium"
                  >
                    Message
                  </label>

                  <textarea
                    id="message"
                    rows="8"
                    className="form-input"
                    placeholder="Tell me about your project..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary mt-6 w-full"
                >
                  Open Email Client
                </button>
              </form>
          </div>
        </div>
      </div>
    </section>
  );
}
