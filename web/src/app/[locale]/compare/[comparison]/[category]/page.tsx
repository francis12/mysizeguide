import { notFound } from 'next/navigation';
import { type Locale } from '@/i18n/config';
import { getSizeChartData } from '@/lib/sizeData';
import Breadcrumb from '@/components/Breadcrumb';
import ComparisonView from './ComparisonView';

import enMessages from '@/i18n/messages/en.json';
import zhMessages from '@/i18n/messages/zh.json';

const messages = {
    en: enMessages,
    zh: zhMessages,
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string; comparison: string; category: string }> }) {
    const { locale, comparison, category } = await params;
    const t = messages[locale as Locale];
    const [brand1Slug, brand2Slug] = comparison.replace('-vs-', '|').split('|');

    // Simple metadata, could be enriched by fetching brand names...
    const title = t.comparePage.title + `: ${brand1Slug} vs ${brand2Slug} (${category})`;

    return {
        title,
        description: t.comparePage.subtitle,
    };
}

export default async function ComparisonResultPage({
    params,
}: {
    params: Promise<{
        locale: string;
        comparison: string;
        category: string;
    }>;
}) {
    const { locale, comparison, category } = await params;
    const currentLocale = locale as Locale;
    const t = messages[currentLocale];

    // Safe split for "nike-vs-adidas"
    // Assuming brand slugs don't contain "-vs-" which is the separator
    // If slugs contain hyphens, we rely on the separator being exactly "-vs-"
    const parts = comparison.split('-vs-');
    if (parts.length !== 2) {
        notFound();
    }
    const [brand1Slug, brand2Slug] = parts;

    const brand1Data = await getSizeChartData(brand1Slug, category);
    const brand2Data = await getSizeChartData(brand2Slug, category);

    if (!brand1Data || !brand2Data) {
        notFound();
    }

    const categoryName = t.categories[category as keyof typeof t.categories] || category;

    return (
        <div className="page-bg min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Breadcrumb
                    locale={currentLocale}
                    items={[
                        { label: t.common.compare, href: `/${locale}/compare` },
                        { label: `${brand1Data.brand} vs ${brand2Data.brand}` },
                    ]}
                />

                <div className="mb-12 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold mb-4">
                        <span className="gradient-text">
                            {brand1Data.brand} <span className="text-foreground mx-2">{t.comparePage.vs}</span> {brand2Data.brand}
                        </span>
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        {t.comparePage.description.replace('{brand1}', brand1Data.brand).replace('{brand2}', brand2Data.brand)}
                        {' - '}{categoryName}
                    </p>
                </div>

                <ComparisonView
                    brand1Data={brand1Data}
                    brand2Data={brand2Data}
                    messages={t}
                />

                <div className="mt-8 text-center text-sm text-muted-foreground">
                    {t.comparePage.disclaimer}
                </div>
            </div>
        </div>
    );
}
