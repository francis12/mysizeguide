import { getBrands } from '@/lib/brands';
import CompareClient from './CompareClient';
import { type Locale } from '@/i18n/config';
import { ArrowLeftRight, Sparkles } from 'lucide-react';

import enMessages from '@/i18n/messages/en.json';
import zhMessages from '@/i18n/messages/zh.json';

const messages = {
    en: enMessages,
    zh: zhMessages,
};

export default async function ComparePage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const currentLocale = locale as Locale;
    const t = messages[currentLocale];

    const brands = await getBrands();

    return (
        <div className="page-bg min-h-screen">
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-border/50 mb-6">
                        <Sparkles className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">
                            {t.common.compare}
                        </span>
                    </div>

                    <h1 className="text-4xl sm:text-5xl font-bold mb-4">
                        <span className="gradient-text">
                            {t.comparePage.title}
                        </span>
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        {t.comparePage.subtitle}
                    </p>
                </div>

                {/* Selection Interface */}
                <CompareClient
                    brands={brands}
                    messages={t}
                    locale={currentLocale}
                />

                {/* Popular Comparisons (Placeholder for now) */}
                <div className="mt-20">
                    <h2 className="text-2xl font-bold text-center mb-8 gradient-text">{t.comparePage.recentComparisons}</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        {/* Example Quick Links */}
                        <a href={`${currentLocale === 'en' ? '' : '/' + currentLocale}/compare/nike-vs-adidas/mens-shoes`} className="glass-card p-6 flex items-center justify-between group hover:border-primary/50">
                            <div className="flex items-center gap-4">
                                <span className="font-bold">Nike</span>
                                <ArrowLeftRight className="w-4 h-4 text-muted-foreground" />
                                <span className="font-bold">Adidas</span>
                            </div>
                            <span className="text-xs text-muted-foreground border border-border px-2 py-1 rounded-full">Shoes</span>
                        </a>
                        <a href={`${currentLocale === 'en' ? '' : '/' + currentLocale}/compare/zara-vs-hm/womens-tops`} className="glass-card p-6 flex items-center justify-between group hover:border-primary/50">
                            <div className="flex items-center gap-4">
                                <span className="font-bold">Zara</span>
                                <ArrowLeftRight className="w-4 h-4 text-muted-foreground" />
                                <span className="font-bold">H&M</span>
                            </div>
                            <span className="text-xs text-muted-foreground border border-border px-2 py-1 rounded-full">Tops</span>
                        </a>
                        <a href={`${currentLocale === 'en' ? '' : '/' + currentLocale}/compare/uniqlo-vs-gap/mens-bottoms`} className="glass-card p-6 flex items-center justify-between group hover:border-primary/50">
                            <div className="flex items-center gap-4">
                                <span className="font-bold">Uniqlo</span>
                                <ArrowLeftRight className="w-4 h-4 text-muted-foreground" />
                                <span className="font-bold">Gap</span>
                            </div>
                            <span className="text-xs text-muted-foreground border border-border px-2 py-1 rounded-full">Bottoms</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
