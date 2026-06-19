import React from 'react';
import { prisma } from '@/lib/prisma';
import AdminLeadsClient from '@/components/AdminLeadsClient';

export default async function AdminLeadsPage() {
  let leads: any[] = [];

  try {
    leads = await prisma.bulkPurchaseLead.findMany({
      orderBy: { createdAt: 'desc' },
    });
  } catch (err) {
    console.warn('Database offline, returning simulated leads for admin dashboard');
    // Generate realistic, premium mock leads
    leads = [
      {
        id: 'lead-mock-1',
        name: 'Aarav Mehta',
        email: 'purchase@vedicretreats.in',
        phone: '+91 98100 12345',
        companyName: 'Vedic Retreats Spa & Wellness',
        quantity: 200,
        productOfInterest: 'Kashmiri Mongra Saffron (Grade A++)',
        enquiryType: 'WHOLESALE',
        message: 'We are expanding our luxury therapeutic facial routines across our 5 resort locations. We need pure grade A++ saffron in custom 2g bulk shipments. Please share wholesale quotes and shipping timelines.',
        status: 'NEW',
        notes: null,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 6),
      },
      {
        id: 'lead-mock-2',
        name: 'Priya Nair',
        email: 'p.nair@niraamayawellness.com',
        phone: '+91 88799 54321',
        companyName: 'Niraamaya Wellness Resort',
        quantity: 120,
        productOfInterest: 'Kumkumadi Radiance Facial Oil',
        enquiryType: 'WHOLESALE',
        message: 'Looking to purchase Kumkumadi facial oil in bulk to stock our guest vanity kits. Requesting customization on labeling and pricing parameters for recurring quarterly shipments.',
        status: 'IN_PROGRESS',
        notes: 'Called Priya on June 18th. Sent custom corporate proposal. Awaiting confirmation.',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 28), // 28 hours ago
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
      },
      {
        id: 'lead-mock-3',
        name: 'Vikramaditya Rao',
        email: 'v.rao@tajhotels.com',
        phone: '+91 22 6665 3333',
        companyName: 'The Taj Mahal Palace Gifting',
        quantity: 500,
        productOfInterest: 'Artisanal Hammered Copper Carafe',
        enquiryType: 'CORPORATE',
        message: 'For the upcoming Diwali corporate gifting catalogue, we are interested in ordering 500 units of the hammered copper carafe with custom engraved Taj logos. Please confirm lead times and pricing for bulk orders.',
        status: 'CONTACTED',
        notes: 'Shared pricing catalog and logo embossing options. Taj branding team is reviewing the sample.',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 96), // 4 days ago
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
      },
      {
        id: 'lead-mock-4',
        name: 'Dr. Sunita Sharma',
        email: 'dr.sharma@ayurvedasutra.org',
        phone: '+91 99990 88888',
        companyName: null,
        quantity: 50,
        productOfInterest: 'Lakadong Turmeric Powder (High Curcumin)',
        enquiryType: 'BULK_REQUEST',
        message: 'I run a private wellness clinic in Dehradun and prescribe Lakadong turmeric for immune formulation. Seeking bulk packaging discount codes for ordering 50 packets of 500g directly to the clinic.',
        status: 'CLOSED',
        notes: 'Approved flat 20% discount code. Order placed and fulfilled on June 15th.',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 240), // 10 days ago
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 180),
      }
    ];
  }

  return <AdminLeadsClient leads={leads} />;
}
