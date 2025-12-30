'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BrandInfo } from '@/lib/brands';
import { ArrowRight, ArrowLeftRight, Check } from 'lucide-react';

interface CompareClientProps {
    brands: BrandInfo[];
    messages: {
        common: {
            compare: string;
        };
        comparePage: {
            title: string;
            subtitle: string;
            selectBrand1: string;
            selectBrand2: string;
            selectCategory: string;
            compareButton: string;
        };
        categories: Record<string, string>;
    };
    locale: string;
}

export default function CompareClient({ brands, messages, locale }: CompareClientProps) {
    const [brand1, setBrand1] = useState<string>('');
    const [brand2, setBrand2] = useState<string>('');
    const [category, setCategory] = useState<string>('');
    const router = useRouter();
    const t = messages.comparePage;

    // Get common categories between selected brands
    const commonCategories = brands.find(b => b.slug === brand1)?.categories.filter(
        cat => brands.find(b => b.slug === brand2)?.categories.includes(cat)
    ) || [];

    const handleCompare = () => {
        if (brand1 && brand2 && category) {
            const prefix = locale === 'en' ? '' : `/${locale}`;
            router.push(`${prefix}/compare/${brand1}-vs-${brand2}/${category}`);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="glass-card p-8 md:p-12">
                <div className="flex flex-col md:flex-row gap-8 items-center justify-center">

                    {/* Brand 1 Selection */}
                    <div className="w-full max-w-xs space-y-4">
                        <label className="block text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                            {t.selectBrand1}
                        </label>
                        <select
                            value={brand1}
                            onChange={(e) => {
                                setBrand1(e.target.value);
                                setCategory(''); // Reset category on brand change
                            }}
                            className="input-glass w-full text-lg py-3 cursor-pointer"
                        >
                            <option value="">Choose Brand</option>
                            {brands.map((brand) => (
                                <option key={brand.slug} value={brand.slug}>
                                    {brand.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* VS Icon */}
                    <div className="flex-shrink-0">
                        <div className="w-16 h-16 rounded-full gradient-bg flex items-center justify-center shadow-lg transform md:mt-8">
                            <span className="text-white font-bold text-xl">VS</span>
                        </div>
                    </div>

                    {/* Brand 2 Selection */}
                    <div className="w-full max-w-xs space-y-4">
                        <label className="block text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                            {t.selectBrand2}
                        </label>
                        <select
                            value={brand2}
                            onChange={(e) => {
                                setBrand2(e.target.value);
                                setCategory('');
                            }}
                            className="input-glass w-full text-lg py-3 cursor-pointer"
                        >
                            <option value="">Choose Brand</option>
                            {brands.filter(b => b.slug !== brand1).map((brand) => (
                                <option key={brand.slug} value={brand.slug}>
                                    {brand.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Category Selection (Conditional) */}
                {brand1 && brand2 && (
                    <div className="mt-12 max-w-xs mx-auto space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <label className="block text-sm font-semibold text-muted-foreground uppercase tracking-wider text-center">
                            {t.selectCategory}
                        </label>

                        {commonCategories.length > 0 ? (
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="input-glass w-full text-lg py-3 cursor-pointer"
                            >
                                <option value="">Choose Category</option>
                                {commonCategories.map((cat) => (
                                    <option key={cat} value={cat}>
                                        {messages.categories[cat] || cat}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <div className="text-center p-4 rounded-xl bg-muted/50 text-muted-foreground">
                                No common categories found for these brands.
                            </div>
                        )}
                    </div>
                )}

                {/* Compare Button */}
                <div className="mt-12 text-center">
                    <button
                        onClick={handleCompare}
                        disabled={!brand1 || !brand2 || !category}
                        className={`btn-glow text-lg px-10 py-4 inline-flex items-center gap-2 ${!brand1 || !brand2 || !category ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
                            }`}
                    >
                        {t.compareButton}
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
