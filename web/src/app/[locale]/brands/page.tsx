import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import { type Locale } from '@/i18n/config';
import { ArrowRight, Sparkles, Tag } from 'lucide-react';

import enMessages from '@/i18n/messages/en.json';
import zhMessages from '@/i18n/messages/zh.json';

const messages = {
    en: enMessages,
    zh: zhMessages,
};

interface BrandInfo {
    slug: string;
    name: string;
    categories: string[];
}

async function getBrands(): Promise<BrandInfo[]> {
    const dataDir = path.join(process.cwd(), '..', 'data');
    const brands: BrandInfo[] = [];

    try {
        const brandDirs = fs.readdirSync(dataDir, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name);

        for (const brandSlug of brandDirs) {
            const brandDir = path.join(dataDir, brandSlug);
            const categories: string[] = [];

            const categoryDirs = fs.readdirSync(brandDir, { withFileTypes: true })
                .filter(dirent => dirent.isDirectory());

            for (const catDir of categoryDirs) {
                const chartPath = path.join(brandDir, catDir.name, 'size_chart.json');
                if (fs.existsSync(chartPath)) {
                    categories.push(catDir.name);
                }
            }

            if (categories.length > 0) {
                const firstChartPath = path.join(brandDir, categories[0], 'size_chart.json');
                const chartData = JSON.parse(fs.readFileSync(firstChartPath, 'utf-8'));

                brands.push({
                    slug: brandSlug,
                    name: chartData.brand || brandSlug,
                    categories,
                });
            }
        }
    } catch (error) {
        console.error('Error loading brands:', error);
    }

    return brands.sort((a, b) => a.name.localeCompare(b.name));
}

// Generate gradient colors based on brand name
function getBrandGradient(name: string): string {
    const gradients = [
        'from-blue-500 to-cyan-400',
        'from-purple-500 to-pink-400',
        'from-orange-500 to-amber-400',
        'from-emerald-500 to-teal-400',
        'from-rose-500 to-pink-400',
        'from-indigo-500 to-blue-400',
        'from-violet-500 to-purple-400',
        'from-fuchsia-500 to-pink-400',
    ];
    const index = name.charCodeAt(0) % gradients.length;
    return gradients[index];
}

export default async function BrandsPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const currentLocale = locale as Locale;
    const t = messages[currentLocale];
    const isZh = currentLocale === 'zh';

    const brands = await getBrands();

    return (
        <div className="page-bg min-h-screen">
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Page Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-border/50 mb-6">
                        <Sparkles className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">
                            {brands.length} {isZh ? '个品牌' : 'Brands'}
                        </span>
                    </div>

                    <h1 className="text-4xl sm:text-5xl font-bold mb-4">
                        <span className="gradient-text">
                            {isZh ? '所有品牌' : 'All Brands'}
                        </span>
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        {isZh
                            ? '选择一个品牌查看尺码表和换算器'
                            : 'Select a brand to view size charts and converter'
                        }
                    </p>
                </div>

                {/* Brands Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {brands.map((brand) => (
                        <div
                            key={brand.slug}
                            className="glass-card p-6 group"
                        >
                            <div className="flex items-start justify-between mb-5">
                                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${getBrandGradient(brand.name)} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                                    <span className="font-bold text-2xl text-white">{brand.name[0]}</span>
                                </div>
                                <div className="badge-outline">
                                    <Tag className="w-3 h-3 mr-1" />
                                    {brand.categories.length}
                                </div>
                            </div>

                            <h2 className="text-xl font-bold mb-4">{brand.name}</h2>

                            <div className="space-y-2 mb-5">
                                {brand.categories.slice(0, 4).map((category) => (
                                    <Link
                                        key={category}
                                        href={`${currentLocale === 'en' ? '' : '/' + currentLocale}/chart/${brand.slug}/${category}`}
                                        className="flex items-center justify-between text-sm text-muted-foreground hover:text-primary transition-colors py-1.5 px-3 rounded-lg hover:bg-primary/5"
                                    >
                                        <span>{t.categories[category as keyof typeof t.categories] || category}</span>
                                        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </Link>
                                ))}
                                {brand.categories.length > 4 && (
                                    <p className="text-xs text-muted-foreground px-3">
                                        +{brand.categories.length - 4} {isZh ? '更多' : 'more'}
                                    </p>
                                )}
                            </div>

                            <Link
                                href={`${currentLocale === 'en' ? '' : '/' + currentLocale}/chart/${brand.slug}/${brand.categories[0]}`}
                                className="btn-glow w-full justify-center text-sm py-3"
                            >
                                {isZh ? '查看尺码表' : 'View Size Chart'}
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
