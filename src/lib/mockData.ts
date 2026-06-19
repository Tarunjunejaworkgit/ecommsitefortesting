export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
}

export interface ProductVariant {
  id: string;
  productId: string;
  name: string;
  price: number;
  sku: string | null;
  stock: number;
}

export interface ProductImage {
  id: string;
  productId: string;
  url: string;
  altText: string | null;
  isFeatured: boolean;
  order: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice: number | null;
  status: string;
  sku: string | null;
  sizeInfo: string | null;
  returnInfo: string | null;
  shippingInfo: string | null;
  specifications: string | null;
  rating: number;
  categoryId: string;
  category?: Category;
  variants?: ProductVariant[];
  images?: ProductImage[];
}

export interface Programme {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  featuredImage: string | null;
  startDate: string;
  endDate: string | null;
  location: string;
  status: string;
  maxRegistrations: number | null;
  price: number;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  featuredImage: string | null;
  isFeatured: boolean;
  status: string;
  seoTitle: string | null;
  seoDescription: string | null;
  categoryId: string;
  categoryName?: string;
  createdAt: string;
}

export interface Deal {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  discountValue: number;
  discountType: string;
  code: string | null;
  bannerImage: string | null;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string | null;
  company: string | null;
  content: string;
  rating: number;
  avatarImage: string | null;
  isFeatured: boolean;
}

export interface HeroBanner {
  id: string;
  title: string;
  subtitle: string | null;
  ctaText: string | null;
  ctaLink: string | null;
  backgroundImage: string;
  order: number;
  isActive: boolean;
}

// Seed Mock Data Arrays
export const mockCategories: Category[] = [
  { id: 'cat-1', name: 'Saffron & Elixirs', slug: 'saffron-elixirs', description: 'Hand-harvested Kashmiri Kesar and revitalizing herbal elixirs of purity.', image: '/seed/category-saffron.jpg' },
  { id: 'cat-2', name: 'Wellness Oils', slug: 'wellness-oils', description: 'Cold-pressed Ayurvedic therapeutic oils and essential essences.', image: '/seed/category-oils.jpg' },
  { id: 'cat-3', name: 'Sacred Spices', slug: 'sacred-spices', description: 'Single-origin, premium grade spices grown in native microclimates.', image: '/seed/category-spices.jpg' },
  { id: 'cat-4', name: 'Lifestyle & Handicrafts', slug: 'lifestyle-handicrafts', description: 'Artisanal wellness accessories, handmade copperware, and pottery.', image: '/seed/category-crafts.jpg' },
];

export const mockProducts: Product[] = [
  {
    id: 'prod-1',
    name: 'Kashmiri Mongra Saffron (Grade A++)',
    slug: 'kashmiri-mongra-saffron-grade-a',
    description: 'Our Grade A++ Kashmiri Mongra Saffron is hand-harvested by local farming collectives in Pampore, Kashmir. Revered for its deep red stigmas, rich aroma, and highly concentrated crocin levels, it represents the absolute pinnacle of purity and heritage.',
    price: 950.00,
    compareAtPrice: 1200.00,
    status: 'ACTIVE',
    sku: 'MOK-SAF-001',
    sizeInfo: 'Available in 1g, 2g, and 5g premium glass vials.',
    returnInfo: 'Due to the edible and premium nature of this product, returns are accepted within 7 days only if the security seal remains unbroken.',
    shippingInfo: 'Ships within 24-48 hours. Delivered in premium gift-grade boxes.',
    specifications: JSON.stringify([
      { label: 'Origin', value: 'Pampore, Kashmir, India' },
      { label: 'Grade', value: 'Grade A++ Mongra' },
      { label: 'Harvest Period', value: 'October - November' },
      { label: 'Aroma Profile', value: 'Honeyed, hay-like, rich' },
    ]),
    rating: 4.9,
    categoryId: 'cat-1',
    variants: [
      { id: 'var-1a', productId: 'prod-1', name: '1 Gram Vial', price: 950.00, sku: 'MOK-SAF-001-1G', stock: 150 },
      { id: 'var-1b', productId: 'prod-1', name: '2 Gram Vial', price: 1800.00, sku: 'MOK-SAF-001-2G', stock: 90 },
      { id: 'var-1c', productId: 'prod-1', name: '5 Gram Vial', price: 4200.00, sku: 'MOK-SAF-001-5G', stock: 45 },
    ],
    images: [
      { id: 'img-1a', productId: 'prod-1', url: '/seed/saffron-1.jpg', altText: 'Kashmiri Mongra Saffron vial on linen background', isFeatured: true, order: 0 },
      { id: 'img-1b', productId: 'prod-1', url: '/seed/saffron-2.jpg', altText: 'Harvesting saffron flowers in Kashmir', isFeatured: false, order: 1 },
      { id: 'img-1c', productId: 'prod-1', url: '/seed/saffron-3.jpg', altText: 'Saffron threads close-up showing deep crimson color', isFeatured: false, order: 2 },
    ]
  },
  {
    id: 'prod-2',
    name: 'Kumkumadi Radiance Facial Oil',
    slug: 'kumkumadi-radiance-facial-oil',
    description: 'A miraculous, classical Ayurvedic formulation of 26 rare herbs, featuring Kashmiri Saffron, Sandalwood, and Vetiver. Cold-infused over 72 hours, this night serum restores natural radiance, improves skin texture, and minimizes fine lines.',
    price: 2450.00,
    compareAtPrice: 2950.00,
    status: 'ACTIVE',
    sku: 'MOK-OIL-002',
    sizeInfo: '30ml dropper bottle.',
    returnInfo: 'Returns accepted within 14 days if the product is unused and in original packaging.',
    shippingInfo: 'Ships within 1-2 business days. Environmentally conscious paper packaging.',
    specifications: JSON.stringify([
      { label: 'Key Herbs', value: 'Kashmiri Saffron, Sandalwood, Manjistha, Vetiver' },
      { label: 'Skin Type', value: 'All skin types, especially mature/dull skin' },
      { label: 'Method', value: 'Classical Taila Paka (oil boiling method)' },
      { label: 'Volume', value: '30 ml / 1.01 fl. oz.' },
    ]),
    rating: 4.8,
    categoryId: 'cat-2',
    variants: [
      { id: 'var-2a', productId: 'prod-2', name: '30ml Dropper', price: 2450.00, sku: 'MOK-OIL-002-30M', stock: 120 },
    ],
    images: [
      { id: 'img-2a', productId: 'prod-2', url: '/seed/oil-1.jpg', altText: 'Kumkumadi Oil bottle with dropper', isFeatured: true, order: 0 },
      { id: 'img-2b', productId: 'prod-2', url: '/seed/oil-2.jpg', altText: 'Kumkumadi oil being applied on face', isFeatured: false, order: 1 },
    ]
  },
  {
    id: 'prod-3',
    name: 'Lakadong Turmeric Powder (High Curcumin)',
    slug: 'lakadong-turmeric-powder-high-curcumin',
    description: 'Sourced directly from the Jaintia Hills of Meghalaya, our Lakadong Turmeric boasts an exceptionally high curcumin content of 7-9%. Known for its potent anti-inflammatory properties and intense earthy aroma, it is the ultimate health spice.',
    price: 380.00,
    compareAtPrice: 450.00,
    status: 'ACTIVE',
    sku: 'MOK-SPC-003',
    sizeInfo: '250g and 500g handcrafted canvas bags.',
    returnInfo: 'Returns accepted within 7 days on unopened items.',
    shippingInfo: 'Ships within 24-48 hours.',
    specifications: JSON.stringify([
      { label: 'Origin', value: 'Lakadong, Meghalaya, India' },
      { label: 'Curcumin Level', value: '7.5% to 8.8% (Lab tested)' },
      { label: 'Harvesting Method', value: 'Traditional organic slash-and-mulch' },
    ]),
    rating: 4.7,
    categoryId: 'cat-3',
    variants: [
      { id: 'var-3a', productId: 'prod-3', name: '250 Gram Bag', price: 380.00, sku: 'MOK-SPC-003-250G', stock: 200 },
      { id: 'var-3b', productId: 'prod-3', name: '500 Gram Bag', price: 700.00, sku: 'MOK-SPC-003-500G', stock: 110 },
    ],
    images: [
      { id: 'img-3a', productId: 'prod-3', url: '/seed/turmeric-1.jpg', altText: 'Turmeric powder in canvas bag next to roots', isFeatured: true, order: 0 },
    ]
  },
  {
    id: 'prod-4',
    name: 'Artisanal Hammered Copper Carafe',
    slug: 'artisanal-hammered-copper-carafe',
    description: 'Forged from 100% pure high-grade copper by traditional Thathera artisans in Rajasthan. Storing water in copper vessels (known as Tamra Jal) is an ancient Ayurvedic practice that balances three doshas and naturally purifies your drinking water.',
    price: 1850.00,
    compareAtPrice: 2200.00,
    status: 'ACTIVE',
    sku: 'MOK-CRA-004',
    sizeInfo: '1 Litre capacity with matching copper tumbler.',
    returnInfo: '14-day return policy. Product must not have signs of water usage or discoloration.',
    shippingInfo: 'Ships in 2-3 business days. Heavy bubble wrapping for protection.',
    specifications: JSON.stringify([
      { label: 'Material', value: '99.8% Pure Solid Copper (Seamless)' },
      { label: 'Capacity', value: '1.2 Litres' },
      { label: 'Craft', value: 'Hand-hammered Thathera technique' },
      { label: 'Weight', value: 'approx 480 grams' },
    ]),
    rating: 4.9,
    categoryId: 'cat-4',
    variants: [
      { id: 'var-4a', productId: 'prod-4', name: '1.2L Carafe + Tumbler', price: 1850.00, sku: 'MOK-CRA-004-SET', stock: 60 },
    ],
    images: [
      { id: 'img-4a', productId: 'prod-4', url: '/seed/copper-1.jpg', altText: 'Hammered copper carafe on wooden table', isFeatured: true, order: 0 },
      { id: 'img-4b', productId: 'prod-4', url: '/seed/copper-2.jpg', altText: 'Artisan hammering copper vessel', isFeatured: false, order: 1 },
    ]
  }
];

export const mockProgrammes: Programme[] = [
  {
    id: 'prog-1',
    title: 'Sacred Himalayan Breathwork & Meditation',
    slug: 'sacred-himalayan-breathwork-meditation',
    description: 'A transformative 3-day virtual retreat introducing classical pranayama techniques and Vedic focus exercises for mental clarity.',
    content: 'Restore your inner balance with traditional Himalayan yogic techniques. Led by Acharya Vasant, this online program explores the science of breath control (Pranayama) to detoxify the nervous system, reduce stress, and prepare the mind for deep silent meditation. Each day includes live guided sessions, interactive Q&A, and downloadable meditation tracks.',
    featuredImage: '/seed/prog-breathwork.jpg',
    startDate: '2026-07-15T06:00:00Z',
    endDate: '2026-07-17T08:00:00Z',
    location: 'Virtual Zoom Workshop',
    status: 'ACTIVE',
    maxRegistrations: 100,
    price: 1500.00
  },
  {
    id: 'prog-2',
    title: 'Ayurvedic Dinacharya Masterclass',
    slug: 'ayurvedic-dinacharya-masterclass',
    description: 'Learn the art of daily self-care rituals, dietary alignment, and toxic clearing (amahara) based on seasonal changes.',
    content: 'Dinacharya is the Ayurvedic concept of daily routine. This 2-hour intensive masterclass provides practical tools to align your body with nature\'s circadian rhythms. Discover how to identify your primary constitution (dosha), structure meals for optimal digestion, execute self-massage (Abhyanga), and establish an energizing morning routine.',
    featuredImage: '/seed/prog-ayurveda.jpg',
    startDate: '2026-08-01T10:00:00Z',
    endDate: '2026-08-01T12:00:00Z',
    location: 'Mokshay Experience Center, New Delhi & Live Broadcast',
    status: 'ACTIVE',
    maxRegistrations: 50,
    price: 750.00
  }
];

export const mockBlogPosts: BlogPost[] = [
  {
    id: 'blog-1',
    title: 'The Alchemy of Saffron: Cultivating Wellness Thread by Thread',
    slug: 'alchemy-of-saffron-cultivating-wellness',
    content: '<p>For centuries, saffron has been revered not just as a precious culinary ingredient, but as a potent medicine in the pharmacopeia of Ayurveda. Known as <i>Kumkuma</i>, saffron is regarded as a <i>Tridoshashara</i> herb—possessing the unique ability to balance all three doshas (Vata, Pitta, and Kapha) when consumed in moderation.</p><h3>The Roots of purity</h3><p>In the high-altitude plateaus of Pampore, Kashmir, the soil and weather orchestrate the perfect conditions for crocus sativus flowers. The stigmas must be plucked precisely at dawn when the flowers open, a manual labor of love requiring tens of thousands of blooms to yield a single pound of pure Mongra threads.</p><h3>Ayurvedic Health Benefits</h3><ul><li><b>Enhances Ojas:</b> In Ayurveda, Ojas is the vital energy representing physical strength and immune resilience. Saffron acts as a supreme tonic to nourish all bodily tissues (dhatus).</li><li><b>Improves Mood:</b> Modern clinical trials confirm what ancient healers knew—saffron compounds act as natural mood-lifters by promoting serotonin synthesis.</li><li><b>Improves Skin Complexion:</b> Applying saffron infused in milk or oils helps clarify blood impurities, giving the skin a luminous, healthy glow.</li></ul>',
    excerpt: 'Discover the historical roots, harvesting challenges, and therapeutic science behind Kashmiri Saffron in traditional Ayurvedic sciences.',
    featuredImage: '/seed/blog-saffron.jpg',
    isFeatured: true,
    status: 'PUBLISHED',
    seoTitle: 'Ayurvedic Health Benefits of Kashmiri Saffron | Mokshay',
    seoDescription: 'Explore how Kashmiri Saffron balances doshas, boosts ojas, and elevates skincare according to classical Ayurveda.',
    categoryId: 'blog-cat-1',
    categoryName: 'Ayurvedic Wellness',
    createdAt: '2026-06-15T09:00:00Z'
  },
  {
    id: 'blog-2',
    title: 'Tamra Jal: Why Ancient India Stored Water in Copper',
    slug: 'tamra-jal-ancient-copper-water-science',
    content: '<p>In traditional Indian households, it was a common sight to find copper carafes placed at bedside tables. This practice of storing water in copper containers overnight, known as <i>Tamra Jal</i>, is recently gaining global scientific validation.</p><h3>The Oligodynamic Effect</h3><p>When water is stored in copper for over eight hours, micro-amounts of copper dissolve into it. This process, known as the oligodynamic effect, has a powerful purifying action. It naturally eliminates harmful bacteria, viruses, and fungi, making the water completely safe to drink.</p><h3>Balancing the Doshas</h3><p>According to classical texts like the Ashtanga Hridaya, copper-infused water gently alkalizes the body, tones the digestive tract, and balances all three bio-energies. It stimulates peristalsis, assists in weight management, and acts as a powerful cell antioxidant.</p>',
    excerpt: 'Uncover the ancient science of storing water in copper vessels and its therapeutic benefits on gut health, alkalinity, and digestion.',
    featuredImage: '/seed/blog-copper.jpg',
    isFeatured: false,
    status: 'PUBLISHED',
    seoTitle: 'Scientific Benefits of Drinking Copper Water | Mokshay',
    seoDescription: 'Learn about the oligodynamic effect and Ayurvedic benefits of Tamra Jal, copper water storage.',
    categoryId: 'blog-cat-2',
    categoryName: 'Heritage & Craftsmanship',
    createdAt: '2026-06-18T10:00:00Z'
  }
];

export const mockDeals: Deal[] = [
  {
    id: 'deal-1',
    title: 'Auspicious Beginnings',
    subtitle: 'Enjoy 15% off on your first wellness order.',
    description: 'Embark on your journey to holistic wellness with our handpicked elixirs and spices.',
    discountValue: 15.0,
    discountType: 'PERCENTAGE',
    code: 'MOKSHAY15',
    bannerImage: '/seed/deal-welcome.jpg',
    startDate: '2026-06-19T00:00:00Z',
    endDate: '2026-09-19T23:59:59Z',
    isActive: true
  },
  {
    id: 'deal-2',
    title: 'Solstice Sanctuary Package',
    subtitle: 'Free Copper Tumbler with orders above ₹5,000.',
    description: 'Receive our handcrafted copper tumbler as a gift to complete your daily hydration ritual.',
    discountValue: 0.0,
    discountType: 'FIXED',
    code: 'TAMRA',
    bannerImage: '/seed/deal-gift.jpg',
    startDate: '2026-06-19T00:00:00Z',
    endDate: '2026-07-19T23:59:59Z',
    isActive: true
  }
];

export const mockTestimonials: Testimonial[] = [
  { id: 't-1', name: 'Arundhati Roy', role: 'Yoga Practitioner', company: 'Prana Shala', content: 'The Mongra Saffron from Mokshay is unlike anything I have purchased before. The threads are long, deep crimson, and the honeyed fragrance is so pure it fills the room instantly. A staple for my daily saffron milk.', rating: 5, avatarImage: '/seed/test-arundhati.jpg', isFeatured: true },
  { id: 't-2', name: 'Dr. Vikram Sharma', role: 'Ayurvedic Physician', company: 'AyuCare Clinic', content: 'As a practitioner, I am extremely critical of oil formulations. Mokshay’s Kumkumadi Oil matches the exact parameters described in classical texts. The results in skin glow and soothing inflammation are outstanding.', rating: 5, avatarImage: '/seed/test-vikram.jpg', isFeatured: true }
];

export const mockHeroBanners: HeroBanner[] = [
  {
    id: 'hb-1',
    title: 'Calm for the Soul, Heritage for the Home',
    subtitle: 'Experience pure, single-origin Kashmiri Mongra Saffron and cold-pressed therapeutic Ayurvedic elixirs crafted with meticulous attention.',
    ctaText: 'Explore Collections',
    ctaLink: '/shop',
    backgroundImage: '/seed/hero-home.jpg',
    order: 0,
    isActive: true
  },
  {
    id: 'hb-2',
    title: 'Traditional Ayurvedic Wisdom, Modern Grace',
    subtitle: 'Sourced directly from native collectives. Free from chemicals, completely traceably grown.',
    ctaText: 'Shop All Products',
    ctaLink: '/shop',
    backgroundImage: '/seed/hero-spices.jpg',
    order: 1,
    isActive: true
  }
];

export const mockCMSPages: Record<string, any> = {
  home: {
    heroSection: { title: 'Mokshay', subtitle: 'Purity in every thread' },
    heritageSection: { title: 'Our Roots', text: 'Born from a desire to revive original craftsmanship and agricultural heritage, Mokshay partners with local collectives in Kashmir, Meghalaya, and Rajasthan.' },
  },
  about: {
    vision: 'Our vision is to introduce modern consumers to the calming, restorative properties of high-grade, single-origin traditional Indian spices, elixirs, and lifestyle accessories.',
    story: 'Established in 2024, Mokshay was inspired by a simple idea: that wellness begins with uncompromising purity.',
  },
  faq: [
    { q: 'Is your saffron organic?', a: 'Yes, our saffron is harvested using traditional organic farming techniques in Pampore, Kashmir, without chemical fertilizers.' },
    { q: 'How should I clean copperware?', a: 'Clean using lemon halves dipped in salt, or tamarind paste, to naturally polish and restore the original copper luster. Avoid abrasive steel scrubbers.' },
  ],
  shipping: { content: 'We offer free shipping on all orders above ₹999 across India. Standard delivery takes 3-7 business days depending on location.' },
  returns: { content: 'Due to safety and hygiene, food items are returnable only if sealed. Lifestyle crafts can be returned within 14 days of delivery if unused.' },
  privacy: { content: 'Your data is secured using encryption. We never share your personal shipping or payment details with third parties.' },
  terms: { content: 'By purchasing from Mokshay, you agree to our terms of service, shipping conditions, and return guidelines.' },
  contact: { email: 'care@mokshay.com', phone: '+91 11 4050 6070', address: 'Mokshay Heritage Pvt Ltd, 14 Connaught Place, New Delhi 110001' }
};
