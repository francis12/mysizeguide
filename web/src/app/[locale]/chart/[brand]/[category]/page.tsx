import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import fs from 'fs';
import path from 'path';
import { type Locale } from '@/i18n/config';
import { SizeChartData } from '@/lib/types';
import SizeChartClient from './SizeChartClient';

// Import messages
import enMessages from '@/i18n/messages/en.json';
import zhMessages from '@/i18n/messages/zh.json';

const messages = {
    en: enMessages,
    zh: zhMessages,
};

interface PageProps {
    params: Promise<{
        locale: string;
        brand: string;
        category: string;
    }>;
}

// Load size chart data from JSON files
import { getSizeChartData } from '@/lib/sizeData';

// Generate static params for all brand/category combinations
export async function generateStaticParams() {
    const dataDir = path.join(process.cwd(), '..', 'data');
    const params: { locale: string; brand: string; category: string }[] = [];

    try {
        const brands = fs.readdirSync(dataDir, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name);

        for (const brand of brands) {
            const brandDir = path.join(dataDir, brand);
            const categories = fs.readdirSync(brandDir, { withFileTypes: true })
                .filter(dirent => dirent.isDirectory())
                .map(dirent => dirent.name);

            for (const category of categories) {
                const chartPath = path.join(brandDir, category, 'size_chart.json');
                if (fs.existsSync(chartPath)) {
                    params.push({ locale: 'en', brand, category });
                    params.push({ locale: 'zh', brand, category });
                }
            }
        }
    } catch (error) {
        console.error('Error generating static params:', error);
    }

    return params;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { locale, brand, category } = await params;
    const currentLocale = locale as Locale;
    const t = messages[currentLocale];

    const data = await getSizeChartData(brand, category);

    if (!data) {
        return {
            title: 'Size Chart Not Found',
        };
    }

    const brandName = data.brand;
    const categoryName = t.categories[category as keyof typeof t.categories] || data.category;

    const title = t.seo.titleTemplate
        .replace('{brand}', brandName)
        .replace('{category}', categoryName);

    const description = t.seo.descriptionTemplate
        .replace('{brand}', brandName)
        .replace('{category}', categoryName);

    const keywords = t.seo.keywords
        .replace('{brand}', brandName)
        .replace('{category}', categoryName);

    return {
        title,
        description,
        keywords: keywords.split(', '),
        openGraph: {
            title,
            description,
            type: 'website',
            locale: currentLocale === 'zh' ? 'zh_CN' : 'en_US',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
        },
        alternates: {
            canonical: currentLocale === 'en'
                ? `/chart/${brand}/${category}`
                : `/${locale}/chart/${brand}/${category}`,
            languages: {
                'en': `/chart/${brand}/${category}`,
                'zh': `/zh/chart/${brand}/${category}`,
            },
        },
    };
}

export default async function SizeChartPage({ params }: PageProps) {
    const { locale, brand, category } = await params;
    const currentLocale = locale as Locale;

    const data = await getSizeChartData(brand, category);

    if (!data) {
        notFound();
    }

    const currentMessages = messages[currentLocale];

    // Generate structured data for SEO
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": `${data.brand} ${data.category} Size Chart`,
        "description": `Size chart for ${data.brand} ${data.category}. Convert between US, UK, EU and CM sizes.`,
        "mainEntity": {
            "@type": "Table",
            "about": `${data.brand} ${data.category} sizes`,
        },
    };

    // Breadcrumb structured data
    const categoryName = currentMessages.categories[category as keyof typeof currentMessages.categories] || data.category;
    const breadcrumbData = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": `https://mysizeguide.com/${locale}`,
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": "Brands",
                "item": `https://mysizeguide.com/${locale}/brands`,
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": data.brand,
                "item": `https://mysizeguide.com/${locale}/chart/${brand}`,
            },
            {
                "@type": "ListItem",
                "position": 4,
                "name": categoryName,
            },
        ],
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
            />
            <SizeChartClient
                data={data}
                locale={currentLocale}
                messages={currentMessages}
            />
        </>
    );
}
