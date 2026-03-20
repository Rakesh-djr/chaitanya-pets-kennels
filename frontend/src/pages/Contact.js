import React, { useState } from 'react';
import toast from 'react-hot-toast';

export default function Contact() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.name || !form.message) {
      toast.error('Please fill in required fields');
      return;
    }
    setSubmitting(true);
    // In production, send to backend or email service
    await new Promise(r => setTimeout(r, 1000));
    const waMsg = encodeURIComponent(`Hi, I'm ${form.name}. ${form.message}${form.phone ? `. My number: ${form.phone}` : ''}`);
    window.open(`https://wa.me/919666985145?text=${waMsg}`, '_blank');
    toast.success('Opening WhatsApp to send your message!');
    setForm({ name: '', phone: '', email: '', message: '' });
    setSubmitting(false);
  };

  const contactInfo = [
    { icon: '📍', label: 'Address', value: '12-11-1653/A, Vidya Nagar, Amber Nagar, Warasiguda, Hyderabad', link: 'https://maps.google.com/?q=Warasiguda+Hyderabad' },
    { icon: '📞', label: 'Phone', value: '+91 96669 85145', link: 'tel:9666985145' },
    { icon: '💬', label: 'WhatsApp', value: '+91 96669 85145', link: 'https://wa.me/919666985145' },
    { icon: '⏰', label: 'Hours', value: 'Mon – Sunday: 9:00 AM – 8:00 PM', link: null },
  ];

  return (
    <div className="min-h-screen bg-cream dark:bg-brown-950 pt-24 pb-16">
      {/* Header */}
      <div className="relative py-16 text-center mb-10" style={{background: 'linear-gradient(135deg, #5c3d08 0%, #a0522d 50%, #d4a017 100%)'}}>
        <div className="max-w-3xl mx-auto px-4">
          <p className="font-accent text-xl text-gold-300 mb-2">Get In Touch</p>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-white mb-4">Contact Us</h1>
          <p className="text-white/80">We'd love to hear from you. Reach out any time!</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10">
          {/* Left - Info & Map */}
          <div>
            <h2 className="font-display text-2xl font-bold text-brown-800 dark:text-amber-100 mb-6">Visit Our Kennels</h2>

            <div className="space-y-4 mb-8">
              {contactInfo.map((item, i) => (
                <div key={i} className="flex gap-4 bg-white dark:bg-brown-900 rounded-xl p-4 border border-amber-100 dark:border-brown-800 shadow-sm hover:shadow-md transition-shadow">
                  <span className="text-2xl flex-shrink-0">{item.icon}</span>
                  <div>
                    <div className="text-xs font-semibold text-brown-500 dark:text-amber-400/70 uppercase tracking-wider mb-0.5">{item.label}</div>
                    {item.link ? (
                      <a href={item.link} target={item.link.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
                        className="text-brown-700 dark:text-amber-200 font-medium hover:text-gold-600 dark:hover:text-gold-400 transition-colors">
                        {item.value}
                      </a>
                    ) : (
                      <span className="text-brown-700 dark:text-amber-200 font-medium">{item.value}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Google Maps Embed */}
            <div className="rounded-2xl overflow-hidden shadow-xl border border-amber-100 dark:border-brown-800">
              <iframe
                title="Chaitanya Pets Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.2679960745!2d78.52!3d17.42!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTfCsDI1JzEyLjAiTiA3OMKwMzEnMTIuMCJF!5e0!3m2!1sen!2sin!4v1000000000000!5m2!1sen!2sin"
                width="100%"
                height="280"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <a
              href="https://maps.google.com/?q=Warasiguda+Hyderabad"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold mt-4 text-white transition-all hover:scale-105 shadow-lg"
              style={{background: 'linear-gradient(135deg, #4285F4, #34A853)'}}
            >
              📍 Open in Google Maps
            </a>
          </div>

          {/* Right - Contact Form */}
          <div>
            <h2 className="font-display text-2xl font-bold text-brown-800 dark:text-amber-100 mb-6">Send Us a Message</h2>
            <div className="bg-white dark:bg-brown-900 rounded-2xl p-8 shadow-sm border border-amber-100 dark:border-brown-800">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-brown-600 dark:text-amber-400 mb-2 uppercase tracking-wider">Name *</label>
                    <input
                      type="text"
                      placeholder="Your full name"
                      value={form.name}
                      onChange={e => setForm(p => ({...p, name: e.target.value}))}
                      required
                      className="w-full px-4 py-3 rounded-xl border-2 border-amber-200 dark:border-brown-700 bg-amber-50 dark:bg-brown-800 text-brown-800 dark:text-amber-100 focus:outline-none focus:border-gold-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-brown-600 dark:text-amber-400 mb-2 uppercase tracking-wider">Phone</label>
                    <input
                      type="tel"
                      placeholder="+91 XXXXX XXXXX"
                      value={form.phone}
                      onChange={e => setForm(p => ({...p, phone: e.target.value}))}
                      className="w-full px-4 py-3 rounded-xl border-2 border-amber-200 dark:border-brown-700 bg-amber-50 dark:bg-brown-800 text-brown-800 dark:text-amber-100 focus:outline-none focus:border-gold-500 transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-brown-600 dark:text-amber-400 mb-2 uppercase tracking-wider">Email</label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={form.email}
                    onChange={e => setForm(p => ({...p, email: e.target.value}))}
                    className="w-full px-4 py-3 rounded-xl border-2 border-amber-200 dark:border-brown-700 bg-amber-50 dark:bg-brown-800 text-brown-800 dark:text-amber-100 focus:outline-none focus:border-gold-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-brown-600 dark:text-amber-400 mb-2 uppercase tracking-wider">Message *</label>
                  <textarea
                    placeholder="Tell us about the breed you're interested in, any questions..."
                    rows={6}
                    value={form.message}
                    onChange={e => setForm(p => ({...p, message: e.target.value}))}
                    required
                    className="w-full px-4 py-3 rounded-xl border-2 border-amber-200 dark:border-brown-700 bg-amber-50 dark:bg-brown-800 text-brown-800 dark:text-amber-100 focus:outline-none focus:border-gold-500 transition-all resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 rounded-xl font-bold text-white text-lg disabled:opacity-60 hover:opacity-90 transition-all hover:scale-105 shadow-lg"
                  style={{background: 'linear-gradient(135deg, #d4a017, #b8860b)'}}
                >
                  {submitting ? '⏳ Sending...' : '💬 Send via WhatsApp'}
                </button>
              </form>

              <div className="mt-6 pt-6 border-t border-amber-100 dark:border-brown-800 text-center">
                <p className="text-brown-500 dark:text-amber-400/70 text-sm mb-3">Or reach us directly</p>
                <a
                  href="https://wa.me/919666985145"
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-white text-sm"
                  style={{background: 'linear-gradient(135deg, #25d366, #128c7e)'}}
                >
                  💬 Chat on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
