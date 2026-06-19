import React, { Suspense } from 'react';
import StorefrontLayout from '@/components/StorefrontLayout';
import { getProgrammes } from '@/lib/services';
import ProgrammesClient from '@/components/ProgrammesClient';

export default async function ProgrammesPage() {
  const programmes = await getProgrammes();

  // Cast dates to Date objects to conform to types
  const castedProgrammes = programmes.map((p) => ({
    ...p,
    startDate: new Date(p.startDate),
    endDate: p.endDate ? new Date(p.endDate) : null,
  }));

  return (
    <StorefrontLayout>
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
        <Suspense fallback={<div className="py-20 text-center text-stone-400">Loading programmes...</div>}>
          <ProgrammesClient programmes={castedProgrammes} />
        </Suspense>
      </div>
    </StorefrontLayout>
  );
}
