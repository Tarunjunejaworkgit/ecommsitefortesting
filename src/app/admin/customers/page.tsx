import React from 'react';
import { prisma } from '@/lib/prisma';
import { Users, Mail, Phone, Calendar, Receipt } from 'lucide-react';

export default async function AdminCustomersPage() {
  let customers: any[] = [];

  try {
    customers = await prisma.customer.findMany({
      include: {
        orders: { select: { id: true, orderNumber: true, totalAmount: true, status: true, createdAt: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  } catch (err) {
    console.warn('Database offline, returning empty customers list for admin');
  }

  return (
    <div className="space-y-6 text-xs text-stone-600 font-light">
      
      {/* Header */}
      <div className="border-b border-stone-200 pb-4 space-y-1">
        <h2 className="text-2xl font-serif text-stone-900 font-normal">Customer Relations</h2>
        <p className="text-stone-400">View customer profile details and order histories.</p>
      </div>

      {/* Grid List */}
      {customers.length === 0 ? (
        <div className="bg-white border border-stone-200 p-12 text-center text-stone-400 space-y-2 rounded">
          <Users className="w-8 h-8 mx-auto text-stone-300" />
          <p>No customer profiles registered yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {customers.map((c) => {
            const customerTotalSales = c.orders
              .filter((o: any) => o.status !== 'CANCELLED')
              .reduce((sum: number, o: any) => sum + o.totalAmount, 0);

            return (
              <div key={c.id} className="bg-white border border-stone-200 p-6 rounded shadow-sm flex flex-col justify-between space-y-4 hover:border-accent transition">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-serif text-stone-900 text-base font-bold">
                        {c.firstName || 'Guest'} {c.lastName || 'Shopper'}
                      </h3>
                      <div className="flex flex-col space-y-0.5 text-stone-400 font-mono text-[10px] mt-0.5">
                        <span>ID: {c.id.substring(0, 8)}...</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-stone-400 uppercase tracking-wider block">Life Value Sales</span>
                      <span className="text-stone-900 font-bold font-mono text-sm">₹{customerTotalSales.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] border-t border-stone-100 pt-3">
                    <div className="flex items-center gap-1.5 text-stone-500">
                      <Mail className="w-3.5 h-3.5 text-accent" />
                      <span className="truncate">{c.email}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-stone-500">
                      <Phone className="w-3.5 h-3.5 text-accent" />
                      <span>{c.phone || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-stone-500 col-span-2">
                      <Calendar className="w-3.5 h-3.5 text-accent" />
                      <span>Registered: {new Date(c.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</span>
                    </div>
                  </div>
                </div>

                {/* Orders History Sub-List */}
                {c.orders.length > 0 && (
                  <div className="space-y-2 border-t border-stone-100 pt-3">
                    <span className="text-[10px] text-stone-850 font-bold uppercase tracking-wider block">Recent Orders ({c.orders.length})</span>
                    <div className="divide-y divide-stone-100 max-h-24 overflow-y-auto pr-1">
                      {c.orders.map((o: any) => (
                        <div key={o.id} className="py-1.5 flex justify-between items-center text-[10px] font-mono">
                          <span className="font-semibold text-stone-800">{o.orderNumber}</span>
                          <div className="flex items-center gap-3">
                            <span>₹{o.totalAmount}</span>
                            <span className={`px-1.5 rounded text-[8px] font-sans font-bold uppercase ${
                              o.status === 'DELIVERED' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'
                            }`}>
                              {o.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
