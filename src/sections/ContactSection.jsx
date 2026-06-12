import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SectionHeading from '../components/SectionHeading';
import { Markup } from '../components/Markup';
import { useSectionReveal } from '../hooks/useActiveSection.jsx';
import { staggerSlow, itemUp, fadeScale } from '../components/motion';

export default function ContactSection({ data }) {
  const sectionRef = useSectionReveal('contact');
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (event) => {
    event.preventDefault();
    const subject = encodeURIComponent(`Portfolio message from ${formState.name || 'Website visitor'}`);
    const body = encodeURIComponent(`Name: ${formState.name}\nEmail: ${formState.email}\n\n${formState.message}`);
    window.location.href = `mailto:${data.email}?subject=${subject}&body=${body}`;
  };

  return (
    <motion.section
      ref={sectionRef}
      id="contact"
      className="bg-zinc-950 px-6 py-24 lg:px-16"
      variants={staggerSlow}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="mx-auto max-w-6xl">
        <motion.div variants={itemUp}>
          <SectionHeading>Get in Touch</SectionHeading>
        </motion.div>
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12">
          <div>
            <motion.h3 className="mb-6 font-mono text-2xl" variants={itemUp}>
              {data.title}
            </motion.h3>
            <motion.p className="mb-8 text-gray-400" variants={itemUp}>
              {data.description}
            </motion.p>

            <motion.div className="space-y-6" variants={staggerSlow}>
              {data.infoItems.map((item) => (
                <motion.div key={item.id} className="flex items-center" variants={itemUp}>
                  <motion.div className="mr-4 flex h-12 w-12 items-center justify-center rounded-sm border border-zinc-500" whileHover={{ scale: 1.06 }}>
                    <span className="stroke-1 stroke-zinc-500">
                      <Markup html={item.icon} />
                    </span>
                  </motion.div>
                  <div>
                    <p className="text-sm text-gray-400">{item.key}</p>
                    <a href={item.link} target="_blank" rel="noreferrer" className="transition-colors hover:text-gray-500">
                      {item.value}
                    </a>
                  </div>
                </motion.div>
              ))}

              <div className="pt-8">
                <h4 className="mb-4 font-mono text-lg">Find me on</h4>
                <div className="flex space-x-4">
                  {data.socialLinks.map((link) => (
                    <motion.a
                      key={link.id}
                      href={link.link}
                      aria-label={link.title}
                      className="social-icon"
                      target="_blank"
                      rel="noreferrer"
                      whileHover={{ y: -2, scale: 1.04 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="h-6 w-6">
                        <Markup html={link.icon} />
                      </span>
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          <div>
            <motion.form
              onSubmit={handleSubmit}
              className="rounded-sm border border-zinc-800 bg-black px-6 py-8 lg:px-8"
              variants={fadeScale}
            >
              <h3 className="mb-6 font-mono text-2xl">Send Message</h3>
              <div className="space-y-6">
                <div>
                  <label htmlFor="name" className="mb-2 block text-sm font-medium">
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    className="form-input"
                    placeholder="Your name"
                    value={formState.name}
                    onChange={(event) => setFormState((current) => ({ ...current, name: event.target.value }))}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-medium">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="form-input"
                    placeholder="Your email"
                    value={formState.email}
                    onChange={(event) => setFormState((current) => ({ ...current, email: event.target.value }))}
                  />
                </div>
                <div>
                  <label htmlFor="message" className="mb-2 block text-sm font-medium">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows="5"
                    className="form-input"
                    placeholder="Your message"
                    value={formState.message}
                    onChange={(event) => setFormState((current) => ({ ...current, message: event.target.value }))}
                  />
                </div>
                <motion.button type="submit" className="btn-primary w-full" whileHover={{ y: -2, scale: 1.01 }} whileTap={{ scale: 0.98 }}>
                  Open Email Client
                </motion.button>
              </div>
            </motion.form>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
