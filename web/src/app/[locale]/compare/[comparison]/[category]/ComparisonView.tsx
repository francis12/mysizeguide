'use client';

import { SizeChartData } from '@/lib/types';
import SizeTable from '@/components/SizeTable';
import { ArrowLeftRight } from 'lucide-react';

interface ComparisonViewProps {
    brand1Data: SizeChartData;
    brand2Data: SizeChartData;
    messages: any;
}

export default function ComparisonView({ brand1Data, brand2Data, messages }: ComparisonViewProps) {
    return (
        <div className="space-y-8">
            {/* Comparison Header for Mobile - Hidden on Desktop */}
            <div className="lg:hidden flex items-center justify-center gap-4 text-center mb-8">
                <span className="text-xl font-bold gradient-text">{brand1Data.brand}</span>
                <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center text-white text-xs font-bold">VS</div>
                <span className="text-xl font-bold gradient-text">{brand2Data.brand}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start relative">
                {/* VS Badge for Desktop */}
                <div className="hidden lg:flex absolute left-1/2 top-12 -translate-x-1/2 z-10">
                    <div className="w-12 h-12 rounded-full gradient-bg flex items-center justify-center shadow-lg boarder-4 border-white">
                        <span className="text-white font-bold">VS</span>
                    </div>
                </div>

                {/* Brand 1 Column */}
                <div className="space-y-4">
                    <div className="glass-card p-4 text-center border-b-4 border-primary">
                        <h2 className="text-2xl font-bold">{brand1Data.brand}</h2>
                    </div>
                    <SizeTable
                        data={brand1Data}
                        highlightedIndex={null}
                        messages={messages}
                    />
                    {brand1Data.fit_notes && (
                        <div className="glass-card p-4">
                            <h3 className="font-bold text-sm text-muted-foreground mb-2">{messages.sizePage.fitNotes}</h3>
                            <p className="text-sm">{brand1Data.fit_notes}</p>
                        </div>
                    )}
                </div>

                {/* Brand 2 Column */}
                <div className="space-y-4">
                    <div className="glass-card p-4 text-center border-b-4 border-secondary">
                        <h2 className="text-2xl font-bold">{brand2Data.brand}</h2>
                    </div>
                    <SizeTable
                        data={brand2Data}
                        highlightedIndex={null}
                        messages={messages}
                    />
                    {brand2Data.fit_notes && (
                        <div className="glass-card p-4">
                            <h3 className="font-bold text-sm text-muted-foreground mb-2">{messages.sizePage.fitNotes}</h3>
                            <p className="text-sm">{brand2Data.fit_notes}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
