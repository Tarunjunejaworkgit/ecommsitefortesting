'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Save, 
  HelpCircle, 
  Home, 
  Info, 
  Phone, 
  ShieldAlert, 
  Plus, 
  Trash2, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight,
  ListCollapse
} from 'lucide-react';

interface CMSPageData {
  key: string;
  title: string;
  content: string; // JSON string
}

interface AdminCMSClientProps {
  initialPages: CMSPageData[];
}

export default function AdminCMSClient({ initialPages }: AdminCMSClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'home' | 'about' | 'contact' | 'faq' | 'policies'>('home');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Helper to parse page content with defaults
  const getPageContent = (key: string, defaults: any) => {
    const found = initialPages.find(p => p.key === key);
    if (!found) return defaults;
    try {
      return JSON.parse(found.content);
    } catch (e) {
      // If content is a plain string (like policy pages shipping, returns, privacy, terms)
      if (found.content && typeof found.content === 'string') {
        return { content: found.content };
      }
      console.error('Failed to parse CMS JSON for', key, e);
      return defaults;
    }
  };

  // State management for each section
  const [homeCMS, setHomeCMS] = useState({
    heroTitle: getPageContent('home', { heroSection: { title: 'Mokshay' } }).heroSection?.title || 'Mokshay',
    heroSubtitle: getPageContent('home', { heroSection: { subtitle: 'Purity in every thread' } }).heroSection?.subtitle || 'Purity in every thread',
    heritageTitle: getPageContent('home', { heritageSection: { title: 'Our Roots' } }).heritageSection?.title || 'Our Roots',
    heritageText: getPageContent('home', { heritageSection: { text: '' } }).heritageSection?.text || 'Born from a desire to revive original craftsmanship and agricultural heritage, Mokshay partners with local collectives in Kashmir, Meghalaya, and Rajasthan.'
  });

  const [aboutCMS, setAboutCMS] = useState({
    vision: getPageContent('about', { vision: '' }).vision || 'Our vision is to introduce modern consumers to the calming, restorative properties of high-grade, single-origin traditional Indian spices, elixirs, and lifestyle accessories.',
    story: getPageContent('about', { story: '' }).story || 'Established in 2024, Mokshay was inspired by a simple idea: that wellness begins with uncompromising purity.'
  });

  const [contactCMS, setContactCMS] = useState({
    email: getPageContent('contact', { email: 'care@mokshay.com' }).email || 'care@mokshay.com',
    phone: getPageContent('contact', { phone: '+91 11 4050 6070' }).phone || '+91 11 4050 6070',
    address: getPageContent('contact', { address: 'Mokshay Heritage Pvt Ltd, 14 Connaught Place, New Delhi 110001' }).address || 'Mokshay Heritage Pvt Ltd, 14 Connaught Place, New Delhi 110001'
  });

  const [faqCMS, setFaqCMS] = useState<Array<{ q: string; a: string }>>(
    Array.isArray(getPageContent('faq', [])) ? getPageContent('faq', []) : [
      { q: 'Is your saffron organic?', a: 'Yes, our saffron is harvested using traditional organic farming techniques in Pampore, Kashmir, without chemical fertilizers.' },
      { q: 'How should I clean copperware?', a: 'Clean using lemon halves dipped in salt, or tamarind paste, to naturally polish and restore the original copper luster. Avoid abrasive steel scrubbers.' }
    ]
  );

  const [policiesCMS, setPoliciesCMS] = useState({
    shipping: getPageContent('shipping', { content: '' }).content || 'We offer free shipping on all orders above ₹999 across India. Standard delivery takes 3-7 business days depending on location.',
    returns: getPageContent('returns', { content: '' }).content || 'Due to safety and hygiene, food items are returnable only if sealed. Lifestyle crafts can be returned within 14 days of delivery if unused.',
    privacy: getPageContent('privacy', { content: '' }).content || 'Your data is secured using encryption. We never share your personal shipping or payment details with third parties.',
    terms: getPageContent('terms', { content: '' }).content || 'By purchasing from Mokshay, you agree to our terms of service, shipping conditions, and return guidelines.'
  });

  // Action helper to update database CMS Page
  const updateCMSPage = async (key: string, title: string, content: any) => {
    setLoading(true);
    setSuccess(null);
    setError(null);

    try {
      const res = await fetch('/api/admin/actions?type=cms', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, title, content }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update CMS page');
      
      setSuccess(`Successfully updated ${title} content!`);
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Error updating content block');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveHome = () => {
    updateCMSPage('home', 'Homepage Content Blocks', {
      heroSection: { title: homeCMS.heroTitle, subtitle: homeCMS.heroSubtitle },
      heritageSection: { title: homeCMS.heritageTitle, text: homeCMS.heritageText }
    });
  };

  const handleSaveAbout = () => {
    updateCMSPage('about', 'About Editorial Details', {
      vision: aboutCMS.vision,
      story: aboutCMS.story
    });
  };

  const handleSaveContact = () => {
    updateCMSPage('contact', 'Contact Details & Desk', {
      email: contactCMS.email,
      phone: contactCMS.phone,
      address: contactCMS.address
    });
  };

  const handleSaveFAQ = () => {
    updateCMSPage('faq', 'Frequently Asked Questions', faqCMS);
  };

  const handleSavePolicies = (policyKey: 'shipping' | 'returns' | 'privacy' | 'terms', title: string) => {
    updateCMSPage(policyKey, title, { content: policiesCMS[policyKey] });
  };

  // FAQ operations
  const handleAddFaqItem = () => {
    setFaqCMS([...faqCMS, { q: 'New Question?', a: 'Answer description.' }]);
  };

  const handleRemoveFaqItem = (index: number) => {
    setFaqCMS(faqCMS.filter((_, i) => i !== index));
  };

  const handleFaqChange = (index: number, field: 'q' | 'a', val: string) => {
    const updated = faqCMS.map((item, i) => {
      if (i === index) {
        return { ...item, [field]: val };
      }
      return item;
    });
    setFaqCMS(updated);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex justify-between items-center border-b border-stone-200 pb-4">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-serif text-stone-900 font-normal">CMS Content Blocks</h2>
          <p className="text-stone-400">Modify dynamic text blocks, banners, contact details, FAQs, and policies without writing code.</p>
        </div>
      </div>

      {/* Notifications */}
      {success && (
        <div className="p-4 bg-green-50 text-green-700 border border-green-200 rounded flex items-center gap-2 text-xs">
          <CheckCircle2 className="w-4 h-4 text-green-500" />
          <span className="font-semibold">{success}</span>
        </div>
      )}
      {error && (
        <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded flex items-center gap-2 text-xs">
          <AlertCircle className="w-4 h-4 text-red-500" />
          <span className="font-semibold">{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Left Tabs Column */}
        <div className="md:col-span-1 bg-white border border-stone-200 rounded overflow-hidden shadow-sm flex flex-col divide-y divide-stone-100">
          <button
            onClick={() => { setActiveTab('home'); setSuccess(null); setError(null); }}
            className={`w-full text-left px-5 py-4 flex items-center gap-3 transition font-semibold text-xs tracking-wider uppercase ${
              activeTab === 'home' ? 'bg-primary text-white' : 'text-stone-600 hover:bg-stone-50'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>Homepage Section</span>
          </button>
          
          <button
            onClick={() => { setActiveTab('about'); setSuccess(null); setError(null); }}
            className={`w-full text-left px-5 py-4 flex items-center gap-3 transition font-semibold text-xs tracking-wider uppercase ${
              activeTab === 'about' ? 'bg-primary text-white' : 'text-stone-600 hover:bg-stone-50'
            }`}
          >
            <Info className="w-4 h-4" />
            <span>About Editorial</span>
          </button>

          <button
            onClick={() => { setActiveTab('contact'); setSuccess(null); setError(null); }}
            className={`w-full text-left px-5 py-4 flex items-center gap-3 transition font-semibold text-xs tracking-wider uppercase ${
              activeTab === 'contact' ? 'bg-primary text-white' : 'text-stone-600 hover:bg-stone-50'
            }`}
          >
            <Phone className="w-4 h-4" />
            <span>Contact Desk</span>
          </button>

          <button
            onClick={() => { setActiveTab('faq'); setSuccess(null); setError(null); }}
            className={`w-full text-left px-5 py-4 flex items-center gap-3 transition font-semibold text-xs tracking-wider uppercase ${
              activeTab === 'faq' ? 'bg-primary text-white' : 'text-stone-600 hover:bg-stone-50'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>FAQ Answers</span>
          </button>

          <button
            onClick={() => { setActiveTab('policies'); setSuccess(null); setError(null); }}
            className={`w-full text-left px-5 py-4 flex items-center gap-3 transition font-semibold text-xs tracking-wider uppercase ${
              activeTab === 'policies' ? 'bg-primary text-white' : 'text-stone-600 hover:bg-stone-50'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Policy Terms</span>
          </button>
        </div>

        {/* Right Editor Area */}
        <div className="md:col-span-3 bg-white border border-stone-200 rounded p-6 shadow-sm min-h-[400px] flex flex-col justify-between">
          
          {/* Tab Content: Home */}
          {activeTab === 'home' && (
            <div className="space-y-6 text-xs text-stone-600 font-light">
              <h3 className="font-serif text-stone-900 text-lg font-normal border-b pb-2">Homepage Core Content</h3>
              
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-stone-700 font-semibold uppercase block">Brand Splash Title</label>
                  <input
                    type="text"
                    value={homeCMS.heroTitle}
                    onChange={(e) => setHomeCMS({ ...homeCMS, heroTitle: e.target.value })}
                    className="w-full border border-stone-300 p-2.5 rounded text-sm text-stone-850 font-normal focus:outline-none focus:border-primary"
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-stone-700 font-semibold uppercase block">Brand Splash Subtitle</label>
                  <input
                    type="text"
                    value={homeCMS.heroSubtitle}
                    onChange={(e) => setHomeCMS({ ...homeCMS, heroSubtitle: e.target.value })}
                    className="w-full border border-stone-300 p-2.5 rounded text-sm text-stone-850 font-normal focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-stone-700 font-semibold uppercase block">Heritage Showcase Title</label>
                  <input
                    type="text"
                    value={homeCMS.heritageTitle}
                    onChange={(e) => setHomeCMS({ ...homeCMS, heritageTitle: e.target.value })}
                    className="w-full border border-stone-300 p-2.5 rounded text-sm text-stone-850 font-normal focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-stone-700 font-semibold uppercase block">Heritage Editorial Paragraph</label>
                  <textarea
                    rows={6}
                    value={homeCMS.heritageText}
                    onChange={(e) => setHomeCMS({ ...homeCMS, heritageText: e.target.value })}
                    className="w-full border border-stone-300 p-3 rounded text-sm text-stone-850 font-normal focus:outline-none focus:border-primary leading-relaxed"
                  />
                </div>
              </div>

              <div className="pt-6 border-t flex justify-end">
                <button
                  onClick={handleSaveHome}
                  disabled={loading}
                  className="px-6 py-2.5 bg-primary hover:bg-stone-850 text-white font-semibold uppercase tracking-wider rounded flex items-center gap-1.5 disabled:bg-stone-300 transition"
                >
                  <Save className="w-4 h-4" /> Save Homepage Blocks
                </button>
              </div>
            </div>
          )}

          {/* Tab Content: About */}
          {activeTab === 'about' && (
            <div className="space-y-6 text-xs text-stone-600 font-light">
              <h3 className="font-serif text-stone-900 text-lg font-normal border-b pb-2">About Page Editorial</h3>
              
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-stone-700 font-semibold uppercase block">Brand Core Vision</label>
                  <textarea
                    rows={4}
                    value={aboutCMS.vision}
                    onChange={(e) => setAboutCMS({ ...aboutCMS, vision: e.target.value })}
                    className="w-full border border-stone-300 p-3 rounded text-sm text-stone-850 font-normal focus:outline-none focus:border-primary leading-relaxed"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-stone-700 font-semibold uppercase block">The Founders Story & Heritage</label>
                  <textarea
                    rows={8}
                    value={aboutCMS.story}
                    onChange={(e) => setAboutCMS({ ...aboutCMS, story: e.target.value })}
                    className="w-full border border-stone-300 p-3 rounded text-sm text-stone-850 font-normal focus:outline-none focus:border-primary leading-relaxed"
                  />
                </div>
              </div>

              <div className="pt-6 border-t flex justify-end">
                <button
                  onClick={handleSaveAbout}
                  disabled={loading}
                  className="px-6 py-2.5 bg-primary hover:bg-stone-850 text-white font-semibold uppercase tracking-wider rounded flex items-center gap-1.5 disabled:bg-stone-300 transition"
                >
                  <Save className="w-4 h-4" /> Save About Editorial
                </button>
              </div>
            </div>
          )}

          {/* Tab Content: Contact */}
          {activeTab === 'contact' && (
            <div className="space-y-6 text-xs text-stone-600 font-light">
              <h3 className="font-serif text-stone-900 text-lg font-normal border-b pb-2">Contact Details & Desk</h3>
              
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-stone-700 font-semibold uppercase block">Support Email</label>
                  <input
                    type="email"
                    value={contactCMS.email}
                    onChange={(e) => setContactCMS({ ...contactCMS, email: e.target.value })}
                    className="w-full border border-stone-300 p-2.5 rounded text-sm text-stone-850 font-normal focus:outline-none focus:border-primary font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-stone-700 font-semibold uppercase block">Hotline Phone</label>
                  <input
                    type="text"
                    value={contactCMS.phone}
                    onChange={(e) => setContactCMS({ ...contactCMS, phone: e.target.value })}
                    className="w-full border border-stone-300 p-2.5 rounded text-sm text-stone-850 font-normal focus:outline-none focus:border-primary font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-stone-700 font-semibold uppercase block">Physical Office / Flagship Address</label>
                  <textarea
                    rows={4}
                    value={contactCMS.address}
                    onChange={(e) => setContactCMS({ ...contactCMS, address: e.target.value })}
                    className="w-full border border-stone-300 p-3 rounded text-sm text-stone-850 font-normal focus:outline-none focus:border-primary leading-relaxed"
                  />
                </div>
              </div>

              <div className="pt-6 border-t flex justify-end">
                <button
                  onClick={handleSaveContact}
                  disabled={loading}
                  className="px-6 py-2.5 bg-primary hover:bg-stone-850 text-white font-semibold uppercase tracking-wider rounded flex items-center gap-1.5 disabled:bg-stone-300 transition"
                >
                  <Save className="w-4 h-4" /> Save Contact Details
                </button>
              </div>
            </div>
          )}

          {/* Tab Content: FAQ */}
          {activeTab === 'faq' && (
            <div className="space-y-6 text-xs text-stone-600 font-light flex-1 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center border-b pb-2 mb-4">
                  <h3 className="font-serif text-stone-900 text-lg font-normal">Frequently Asked Questions</h3>
                  <button
                    onClick={handleAddFaqItem}
                    className="px-3 py-1.5 border border-stone-300 hover:bg-stone-50 font-semibold uppercase tracking-wider text-[10px] rounded flex items-center gap-1 transition"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Q&A
                  </button>
                </div>

                <div className="space-y-4 max-h-[48vh] overflow-y-auto pr-1">
                  {faqCMS.length === 0 ? (
                    <div className="p-8 text-center text-stone-400 italic">No FAQ items defined. Click Add Q&A.</div>
                  ) : (
                    faqCMS.map((faq, idx) => (
                      <div key={idx} className="p-4 bg-stone-50 border border-stone-200 rounded space-y-3 relative group">
                        <button
                          onClick={() => handleRemoveFaqItem(idx)}
                          className="absolute top-4 right-4 text-stone-400 hover:text-red-600 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        
                        <div className="space-y-1 pr-6">
                          <label className="text-[10px] text-stone-400 uppercase font-semibold">Question #{idx + 1}</label>
                          <input
                            type="text"
                            value={faq.q}
                            onChange={(e) => handleFaqChange(idx, 'q', e.target.value)}
                            className="w-full bg-white border border-stone-300 p-2 rounded text-sm text-stone-850 font-semibold focus:outline-none focus:border-primary"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] text-stone-400 uppercase font-semibold">Answer Description</label>
                          <textarea
                            rows={3}
                            value={faq.a}
                            onChange={(e) => handleFaqChange(idx, 'a', e.target.value)}
                            className="w-full bg-white border border-stone-300 p-2 rounded text-sm text-stone-850 font-normal focus:outline-none focus:border-primary leading-relaxed"
                          />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="pt-6 border-t flex justify-end mt-4">
                <button
                  onClick={handleSaveFAQ}
                  disabled={loading}
                  className="px-6 py-2.5 bg-primary hover:bg-stone-850 text-white font-semibold uppercase tracking-wider rounded flex items-center gap-1.5 disabled:bg-stone-300 transition"
                >
                  <Save className="w-4 h-4" /> Save All FAQs
                </button>
              </div>
            </div>
          )}

          {/* Tab Content: Policies */}
          {activeTab === 'policies' && (
            <div className="space-y-6 text-xs text-stone-600 font-light">
              <h3 className="font-serif text-stone-900 text-lg font-normal border-b pb-2">Policy Pages & Legal Terms</h3>
              
              <div className="space-y-6">
                
                {/* Shipping Policy */}
                <div className="p-4 border rounded bg-stone-50/50 space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-stone-850 font-bold uppercase tracking-wider">Shipping Policy</label>
                    <button
                      onClick={() => handleSavePolicies('shipping', 'Shipping Policy')}
                      disabled={loading}
                      className="px-3.5 py-1.5 bg-stone-900 hover:bg-primary text-white font-semibold uppercase text-[9px] tracking-widest rounded flex items-center gap-1 transition"
                    >
                      <Save className="w-3 h-3" /> Save Shipping
                    </button>
                  </div>
                  <textarea
                    rows={4}
                    value={policiesCMS.shipping}
                    onChange={(e) => setPoliciesCMS({ ...policiesCMS, shipping: e.target.value })}
                    className="w-full bg-white border border-stone-300 p-2.5 rounded text-sm text-stone-850 font-normal focus:outline-none focus:border-primary leading-relaxed"
                  />
                </div>

                {/* Returns Policy */}
                <div className="p-4 border rounded bg-stone-50/50 space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-stone-850 font-bold uppercase tracking-wider">Returns & Refund Guidelines</label>
                    <button
                      onClick={() => handleSavePolicies('returns', 'Returns & Refunds Policy')}
                      disabled={loading}
                      className="px-3.5 py-1.5 bg-stone-900 hover:bg-primary text-white font-semibold uppercase text-[9px] tracking-widest rounded flex items-center gap-1 transition"
                    >
                      <Save className="w-3 h-3" /> Save Returns
                    </button>
                  </div>
                  <textarea
                    rows={4}
                    value={policiesCMS.returns}
                    onChange={(e) => setPoliciesCMS({ ...policiesCMS, returns: e.target.value })}
                    className="w-full bg-white border border-stone-300 p-2.5 rounded text-sm text-stone-850 font-normal focus:outline-none focus:border-primary leading-relaxed"
                  />
                </div>

                {/* Privacy Policy */}
                <div className="p-4 border rounded bg-stone-50/50 space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-stone-850 font-bold uppercase tracking-wider">Customer Privacy Policy</label>
                    <button
                      onClick={() => handleSavePolicies('privacy', 'Privacy Policy')}
                      disabled={loading}
                      className="px-3.5 py-1.5 bg-stone-900 hover:bg-primary text-white font-semibold uppercase text-[9px] tracking-widest rounded flex items-center gap-1 transition"
                    >
                      <Save className="w-3 h-3" /> Save Privacy
                    </button>
                  </div>
                  <textarea
                    rows={4}
                    value={policiesCMS.privacy}
                    onChange={(e) => setPoliciesCMS({ ...policiesCMS, privacy: e.target.value })}
                    className="w-full bg-white border border-stone-300 p-2.5 rounded text-sm text-stone-850 font-normal focus:outline-none focus:border-primary leading-relaxed"
                  />
                </div>

                {/* Terms and Conditions */}
                <div className="p-4 border rounded bg-stone-50/50 space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-stone-850 font-bold uppercase tracking-wider">Terms of Service</label>
                    <button
                      onClick={() => handleSavePolicies('terms', 'Terms of Service')}
                      disabled={loading}
                      className="px-3.5 py-1.5 bg-stone-900 hover:bg-primary text-white font-semibold uppercase text-[9px] tracking-widest rounded flex items-center gap-1 transition"
                    >
                      <Save className="w-3 h-3" /> Save Terms
                    </button>
                  </div>
                  <textarea
                    rows={4}
                    value={policiesCMS.terms}
                    onChange={(e) => setPoliciesCMS({ ...policiesCMS, terms: e.target.value })}
                    className="w-full bg-white border border-stone-300 p-2.5 rounded text-sm text-stone-850 font-normal focus:outline-none focus:border-primary leading-relaxed"
                  />
                </div>

              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}
