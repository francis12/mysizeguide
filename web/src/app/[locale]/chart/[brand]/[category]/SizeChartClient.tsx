'use client';

import { useState, useMemo } from 'react';
import { SizeChartData, isShoeChart } from '@/lib/types';
import Breadcrumb from '@/components/Breadcrumb';
import SizeConverter from '@/components/SizeConverter';
import SizeTable from '@/components/SizeTable';
import FAQAccordion from '@/components/FAQAccordion';
import FeedbackButton from '@/components/FeedbackButton';
import { AlertCircle, Calendar, ExternalLink, Lightbulb, Sparkles } from 'lucide-react';
import type { Locale } from '@/i18n/config';

interface GenericContent {
    fitNotes: Record<string, string>;
    measurementGuide: Record<string, string>;
    tips: Record<string, string[]>;
}

interface SizeChartClientProps {
    data: SizeChartData;
    locale: Locale;
    messages: {
        common: {
            brands: string;
            officialWebsite: string;
        };
        sizePage: {
            title: string;
            subtitle: string;
            converter: {
                title: string;
                placeholder: string;
                inputLabel: string;
                result: string;
                noMatch: string;
                closestMatch: string;
            };
            table: {
                title: string;
                highlight: string;
            };
            fitNotes: string;
            measurementGuide: string;
            tips: string;
            source: string;
            lastUpdated: string;
        };
        units: Record<string, string>;
        categories: Record<string, string>;
        tableHeaders: Record<string, string>;
        genericContent?: GenericContent;
        faqs?: {
            title: string;
            items: {
                question: string;
                answer: string;
            }[];
        };
        feedback?: {
            button: string;
            title: string;
            description: string;
            type: string;
            typeOptions: {
                inaccurate: string;
                outdated: string;
                missing: string;
                other: string;
            };
            details: string;
            detailsPlaceholder: string;
            email: string;
            emailPlaceholder: string;
            submit: string;
            submitting: string;
            success: string;
            close: string;
        };
    };
}

function getCategoryType(category: string): string {
    if (!category) return 'default';
    if (category.includes('shoes') || category.includes('sneakers')) return 'shoes';
    if (category.includes('tops') || category.includes('outerwear')) return 'tops';
    if (category.includes('bottoms') || category.includes('jeans') || category.includes('pants')) return 'bottoms';
    if (category.includes('underwear') || category.includes('bras') || category.includes('panties')) return 'underwear';
    return 'default';
}

export default function SizeChartClient({ data, locale, messages }: SizeChartClientProps) {
    const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
    const t = messages.sizePage;
    const common = messages.common;

    const brandName = data.brand;
    const categoryName = messages.categories[data.category_slug] || data.category;
    const isShoe = isShoeChart(data.size_chart);

    const localizedContent = useMemo(() => {
        const categoryType = getCategoryType(data.category_slug);
        const generic = messages.genericContent;

        if (locale === 'zh' && generic) {
            return {
                fitNotes: generic.fitNotes[categoryType] || generic.fitNotes.default,
                measurementGuide: generic.measurementGuide[categoryType] || generic.measurementGuide.default,
                tips: generic.tips[categoryType] || generic.tips.default,
            };
        }

        return {
            fitNotes: data.fit_notes || '',
            measurementGuide: data.measurement_guide?.how_to_measure || '',
            tips: data.measurement_guide?.tips || [],
        };
    }, [data, locale, messages.genericContent]);

    return (
        <div className="page-bg" style={{ minHeight: '100vh' }}>
            <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '2rem 1rem' }}>
                {/* Breadcrumb */}
                <Breadcrumb
                    locale={locale}
                    items={[
                        { label: common.brands, href: `/${locale}/brands` },
                        { label: brandName, href: locale === 'en' ? '/brands' : `/${locale}/brands` },
                        { label: categoryName },
                    ]}
                />

                {/* Page Header */}
                <div style={{ marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                        <span className="badge">
                            <Sparkles style={{ width: '0.75rem', height: '0.75rem', marginRight: '0.25rem' }} />
                            {brandName}
                        </span>
                    </div>
                    <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontWeight: 700 }}>
                        <span className="gradient-text">
                            {t.title.replace('{brand}', brandName).replace('{category}', categoryName)}
                        </span>
                    </h1>
                </div>

                {/* Size Converter - Only for shoe charts */}
                {isShoe && (
                    <div style={{ marginBottom: '1.5rem' }}>
                        <SizeConverter
                            data={data}
                            messages={messages}
                            onHighlight={setHighlightedIndex}
                        />
                    </div>
                )}

                {/* Main Content Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
                    {/* Desktop: 2 column layout */}
                    <style>{`
            @media (min-width: 1024px) {
              .content-grid { grid-template-columns: 2fr 1fr !important; }
            }
          `}</style>
                    <div className="content-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
                        {/* Size Table */}
                        <div>
                            <SizeTable
                                data={data}
                                highlightedIndex={highlightedIndex}
                                messages={messages}
                            />

                            {/* FAQs Section */}
                            {messages.faqs && (
                                <FAQAccordion
                                    title={messages.faqs.title}
                                    items={messages.faqs.items}
                                />
                            )}
                        </div>

                        {/* Sidebar */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {/* Fit Notes */}
                            {localizedContent.fitNotes && (
                                <div className="glass-card" style={{ padding: '1.5rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                                        <div className="icon-gradient">
                                            <AlertCircle style={{ width: '1.25rem', height: '1.25rem' }} />
                                        </div>
                                        <h3 className="gradient-text" style={{ fontWeight: 700 }}>{t.fitNotes}</h3>
                                    </div>
                                    <p style={{ color: '#64748b', fontSize: '0.875rem', lineHeight: 1.7 }}>
                                        {localizedContent.fitNotes}
                                    </p>
                                </div>
                            )}

                            {/* Measurement Guide */}
                            {localizedContent.measurementGuide && (
                                <div className="glass-card" style={{ padding: '1.5rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                                        <div style={{
                                            width: '2.5rem', height: '2.5rem', borderRadius: '0.75rem',
                                            background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)', flexShrink: 0
                                        }}>
                                            <Lightbulb style={{ width: '1.25rem', height: '1.25rem', color: 'white' }} />
                                        </div>
                                        <h3 style={{ fontWeight: 700, color: '#d97706' }}>{t.measurementGuide}</h3>
                                    </div>
                                    <p style={{ color: '#64748b', fontSize: '0.875rem', lineHeight: 1.7, whiteSpace: 'pre-line', marginBottom: '1rem' }}>
                                        {localizedContent.measurementGuide}
                                    </p>
                                    {localizedContent.tips && localizedContent.tips.length > 0 && (
                                        <div style={{ paddingTop: '1rem', borderTop: '1px solid rgba(102, 126, 234, 0.15)' }}>
                                            <h4 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.75rem', color: '#d97706' }}>{t.tips}</h4>
                                            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                                {localizedContent.tips.map((tip, index) => (
                                                    <li key={index} style={{ color: '#64748b', fontSize: '0.875rem', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                                                        <span style={{ width: '0.375rem', height: '0.375rem', borderRadius: '50%', background: '#f59e0b', marginTop: '0.5rem', flexShrink: 0 }} />
                                                        {tip}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Source & Date */}
                            <div className="glass-card" style={{ padding: '1.25rem' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
                                    {data.source_url && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <ExternalLink style={{ width: '1rem', height: '1rem', color: '#667eea', flexShrink: 0 }} />
                                            <span style={{ color: '#64748b' }}>{t.source}:</span>
                                            <a
                                                href={data.source_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{ color: '#667eea', fontWeight: 500, textDecoration: 'none' }}
                                            >
                                                {common.officialWebsite}
                                            </a>
                                        </div>
                                    )}
                                    {data.collected_date && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <Calendar style={{ width: '1rem', height: '1rem', color: '#667eea', flexShrink: 0 }} />
                                            <span style={{ color: '#64748b' }}>{t.lastUpdated}:</span>
                                            <span style={{ fontWeight: 500 }}>{data.collected_date}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Feedback Button */}
            {messages.feedback && (
                <FeedbackButton
                    brandName={brandName}
                    categoryName={categoryName}
                    messages={{ feedback: messages.feedback }}
                />
            )}
        </div>
    );
}
