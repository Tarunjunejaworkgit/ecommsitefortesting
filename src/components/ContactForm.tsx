'use client';

import React, { useState } from 'react';
import { Send, CheckCircle } from 'lucide-react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate API submit or mock post
      await new Promise((resolve) => setTimeout(resolve, 800));
      setSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-stone-200 p-6 md:p-8 rounded shadow-sm">
      {success ? (
        <div className="py-8 text-center space-y-4">
          <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h4 className="font-serif text-stone-900 text-lg font-medium">Message Dispatched</h4>
            <p className="text-stone-500 text-xs font-light max-w-sm mx-auto">
              Thank you for writing. Our customer care team has logged your query and will reply within 12-24 hours.
            </p>
          </div>
          <button
            onClick={() => setSuccess(false)}
            className="px-5 py-2 bg-primary text-white text-xs uppercase tracking-wider font-semibold hover:bg-stone-850 transition rounded mt-2"
          >
            Send Another Message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-stone-700 font-semibold uppercase tracking-wide">Full Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full border border-stone-300 p-2.5 rounded focus:outline-none focus:border-primary text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-stone-700 font-semibold uppercase tracking-wide">Email Address *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full border border-stone-300 p-2.5 rounded focus:outline-none focus:border-primary text-sm"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-stone-700 font-semibold uppercase tracking-wide">Subject *</label>
            <input
              type="text"
              required
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="w-full border border-stone-300 p-2.5 rounded focus:outline-none focus:border-primary text-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="text-stone-700 font-semibold uppercase tracking-wide">Your Message *</label>
            <textarea
              required
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full border border-stone-300 p-2.5 rounded focus:outline-none focus:border-primary text-sm resize-none"
              placeholder="How can we assist you with our elixirs or orders?"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary text-white text-xs uppercase tracking-widest font-semibold hover:bg-stone-850 transition rounded flex items-center justify-center gap-2"
            >
              <Send className="w-3.5 h-3.5" /> {loading ? 'Sending Message...' : 'Send Inquiry'}
            </button>
          </div>

        </form>
      )}
    </div>
  );
}
