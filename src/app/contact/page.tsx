import React from 'react';
import StorefrontLayout from '@/components/StorefrontLayout';
import ContactForm from '@/components/ContactForm';
import { Mail, Phone, MapPin, MessageSquare, Clock } from 'lucide-react';
import { getCMSPage } from '@/lib/services';

export default async function ContactPage() {
  const cmsPage = await getCMSPage('contact');
  const cmsContact = cmsPage ? JSON.parse(cmsPage.content) : null;

  const email = cmsContact?.email || 'care@mokshay.com';
  const phone = cmsContact?.phone || '+91 11 4050 6070';
  const address = cmsContact?.address || 'Mokshay Heritage Pvt Ltd, 14 Connaught Place, New Delhi 110001';

  const faqs = [
    {
      q: 'How do I track my shipping progress?',
      a: 'Once dispatched, we email a tracking code and carrier link. You can also view live delivery milestones on our dedicated Track Order page by entering your order number.',
    },
    {
      q: 'Do you ship internationally?',
      a: 'We currently offer direct shipping across all states in India. For global wholesale shipments, please submit a bulk purchase inquiry or email trade@mokshay.com.',
    },
    {
      q: 'What makes Mongra saffron different?',
      a: 'Kashmiri Mongra is the highest quality grade. It consists exclusively of the red tips of the saffron stigmas, containing the maximum concentration of crocin (color), picrocrocin (flavor), and safranal (aroma).',
    },
  ];

  return (
    <StorefrontLayout>
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 space-y-12">
        
        {/* Header Title */}
        <div className="border-b border-stone-200 pb-6 space-y-2 text-center md:text-left">
          <h1 className="text-3xl md:text-5xl font-serif text-stone-900 font-normal">
            Connect with Mokshay
          </h1>
          <p className="text-stone-500 text-sm font-light max-w-2xl">
            Whether you have queries regarding our cold-pressed elixirs, order fulfillment status, or B2B distributions, our customer care collective is here to assist.
          </p>
        </div>

        {/* Info Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Column 1: Contact Details */}
          <div className="space-y-6 lg:col-span-1">
            <div className="bg-stone-50 border border-stone-200 rounded p-6 space-y-6 text-xs text-stone-600 font-light">
              <h3 className="font-serif text-stone-900 text-base font-semibold border-b border-stone-200 pb-3">Corporate Care</h3>
              
              <div className="flex gap-3 items-start">
                <Mail className="w-5 h-5 text-accent flex-shrink-0" />
                <div className="space-y-0.5">
                  <span className="font-semibold uppercase tracking-wider text-stone-800">Email Relations</span>
                  <p className="text-stone-500">{email}</p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <Phone className="w-5 h-5 text-accent flex-shrink-0" />
                <div className="space-y-0.5">
                  <span className="font-semibold uppercase tracking-wider text-stone-800">Phone Support</span>
                  <p className="text-stone-500">{phone}</p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <MapPin className="w-5 h-5 text-accent flex-shrink-0" />
                <div className="space-y-0.5">
                  <span className="font-semibold uppercase tracking-wider text-stone-800">Experience Center</span>
                  <p className="text-stone-500 leading-relaxed">{address}</p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <Clock className="w-5 h-5 text-accent flex-shrink-0" />
                <div className="space-y-0.5">
                  <span className="font-semibold uppercase tracking-wider text-stone-800">Business Hours</span>
                  <p className="text-stone-500">Mon - Sat: 10:00 AM - 6:00 PM IST</p>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Form */}
          <div className="space-y-4 lg:col-span-2">
            <h3 className="font-serif text-stone-900 text-xl font-medium mb-4">Send a Message</h3>
            <ContactForm />
          </div>

        </div>

        {/* Bottom FAQs Row */}
        <div className="border-t border-stone-200 pt-12 space-y-6 max-w-4xl mx-auto">
          <div className="text-center space-y-1.5">
            <MessageSquare className="w-6 h-6 text-accent mx-auto" />
            <h3 className="text-2xl font-serif text-stone-900 font-normal">Contact FAQs</h3>
            <p className="text-stone-500 text-xs">Quick answers to common inquiries.</p>
          </div>
          
          <div className="space-y-4 text-xs">
            {faqs.map((faq, index) => (
              <details
                key={index}
                className="group border border-stone-200 rounded bg-white p-4 transition [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex items-center justify-between cursor-pointer font-serif text-stone-900 text-sm font-semibold select-none">
                  <span>{faq.q}</span>
                  <span className="text-stone-400 group-open:rotate-180 transition duration-300">
                    &darr;
                  </span>
                </summary>
                <p className="text-stone-550 font-light mt-3 leading-relaxed border-t border-stone-100 pt-3">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>

      </div>
    </StorefrontLayout>
  );
}
