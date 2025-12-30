import Link from 'next/link';
import { ArrowRight, Zap, Globe2, BarChart3, Sparkles, Ruler, HelpCircle, ChevronDown } from 'lucide-react';
import { type Locale } from '@/i18n/config';
import FAQAccordion from '@/components/FAQAccordion';

import enMessages from '@/i18n/messages/en.json';
import zhMessages from '@/i18n/messages/zh.json';

const messages = {
    en: enMessages,
    zh: zhMessages,
};

const brands = [
    { name: 'Nike', slug: 'nike', category: 'mens-shoes' },
    { name: 'Adidas', slug: 'adidas', category: 'mens-shoes' },
    { name: 'Zara', slug: 'zara', category: 'womens-tops' },
    { name: 'H&M', slug: 'hm', category: 'mens-tops' },
    { name: 'Uniqlo', slug: 'uniqlo', category: 'mens-tops' },
    { name: 'Puma', slug: 'puma', category: 'mens-shoes' },
    { name: 'Converse', slug: 'converse', category: 'shoes' },
    { name: 'Vans', slug: 'vans', category: 'shoes' },
];

const features = [
    {
        icon: Zap,
        titleEn: 'Instant Conversion',
        titleZh: '即时换算',
        descEn: 'Convert between US, UK, EU, and CM sizes in real-time',
        descZh: '实时换算美码、英码、欧码和厘米尺码',
        color: 'from-blue-500 to-cyan-400',
    },
    {
        icon: Globe2,
        titleEn: 'Global Brands',
        titleZh: '全球品牌',
        descEn: 'Size charts for 50+ popular fashion brands worldwide',
        descZh: '涵盖50+全球热门时尚品牌尺码表',
        color: 'from-purple-500 to-pink-400',
    },
    {
        icon: BarChart3,
        titleEn: 'Brand Comparison',
        titleZh: '品牌对比',
        descEn: 'Compare sizes between different brands easily',
        descZh: '轻松对比不同品牌之间的尺码差异',
        color: 'from-orange-500 to-amber-400',
    },
];

export default async function HomePage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const currentLocale = locale as Locale;
    const t = messages[currentLocale];
    const isZh = currentLocale === 'zh';

    // Helper to generate locale-aware paths (no prefix for English)
    const getLocalePath = (path: string = '') => {
        return currentLocale === 'en' ? path || '/' : `/${currentLocale}${path}`;
    };

    // FAQ Structured Data for SEO
    const faqStructuredData = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": t.faqs.items.map((item) => ({
            "@type": "Question",
            "name": item.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": item.answer,
            },
        })),
    };

    // Website Structured Data
    const websiteStructuredData = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "MySizeGuide",
        "url": "https://mysizeguide.com",
        "description": isZh
            ? "全球最全的尺码对照表和转换器"
            : "The most comprehensive global size charts and converter",
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteStructuredData) }}
            />
            <div className="page-bg min-h-screen overflow-hidden">
                {/* Hero Section - Simplified */}
                <section className="relative py-16 lg:py-24">
                    {/* Decorative blobs */}
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] gradient-bg rounded-full blur-3xl opacity-15 -translate-y-1/2 translate-x-1/4" />
                    <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-gradient-to-br from-pink-400 to-purple-600 rounded-full blur-3xl opacity-10 translate-y-1/2 -translate-x-1/4" />

                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center max-w-3xl mx-auto">
                            {/* Badge */}
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-border/50 mb-6">
                                <Sparkles className="w-4 h-4 text-primary" />
                                <span className="text-sm font-medium">
                                    {isZh ? '全球最全的尺码对照表' : 'The Most Comprehensive Size Guide'}
                                </span>
                            </div>

                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
                                <span className="gradient-text">{t.common.siteName}</span>
                            </h1>
                            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                                {isZh
                                    ? '不再为尺码困扰。输入您的测量值，立即获得各品牌中的精确尺码。'
                                    : 'No more size confusion. Find your perfect size across all major brands instantly.'
                                }
                            </p>

                            <div className="flex flex-wrap justify-center gap-4">
                                <Link
                                    href={getLocalePath('/brands')}
                                    className="btn-glow inline-flex items-center gap-2"
                                >
                                    {isZh ? '浏览品牌' : 'Browse Brands'}
                                    <ArrowRight className="w-5 h-5" />
                                </Link>
                                <Link
                                    href={getLocalePath('/compare')}
                                    className="btn-secondary inline-flex items-center gap-2"
                                >
                                    <BarChart3 className="w-5 h-5" />
                                    {isZh ? '品牌对比' : 'Compare Brands'}
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section - Compact */}
                <section className="relative py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid md:grid-cols-3 gap-6">
                            {features.map((feature, index) => (
                                <div
                                    key={index}
                                    className="glass-card p-6 group"
                                >
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                                        <feature.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="text-lg font-bold mb-2">
                                        {isZh ? feature.titleZh : feature.titleEn}
                                    </h3>
                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                        {isZh ? feature.descZh : feature.descEn}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Popular Brands Section */}
                <section className="relative py-16">
                    <div className="absolute inset-0 gradient-bg opacity-5" />

                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-10">
                            <h2 className="text-2xl sm:text-3xl font-bold mb-3">
                                <span className="gradient-text">
                                    {isZh ? '热门品牌' : 'Popular Brands'}
                                </span>
                            </h2>
                            <p className="text-muted-foreground">
                                {isZh ? '点击品牌查看尺码表' : 'Click a brand to view size chart'}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {brands.map((brand) => (
                                <Link
                                    key={brand.slug}
                                    href={getLocalePath(`/chart/${brand.slug}/${brand.category}`)}
                                    className="glass-card p-5 text-center group"
                                >
                                    <div className="w-14 h-14 rounded-xl gradient-bg mx-auto mb-3 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                        <span className="font-bold text-xl text-white">{brand.name[0]}</span>
                                    </div>
                                    <span className="font-semibold">{brand.name}</span>
                                </Link>
                            ))}
                        </div>

                        <div className="text-center mt-8">
                            <Link
                                href={getLocalePath('/brands')}
                                className="inline-flex items-center gap-2 text-primary hover:gap-3 transition-all font-medium"
                            >
                                {isZh ? '查看全部品牌' : 'View All Brands'}
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section id="faq" className="relative py-16">
                    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-10">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-border/50 mb-4">
                                <HelpCircle className="w-4 h-4 text-primary" />
                                <span className="text-sm font-medium">
                                    {isZh ? '常见问题' : 'FAQ'}
                                </span>
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-bold">
                                <span className="gradient-text">
                                    {t.faqs.title}
                                </span>
                            </h2>
                        </div>

                        <FAQAccordion
                            title=""
                            items={t.faqs.items}
                        />
                    </div>
                </section>

                {/* CTA Section - Simplified */}
                <section className="relative py-16 overflow-hidden">
                    <div className="absolute inset-0 gradient-bg-animated" />

                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
                            {isZh ? '准备好找到您的完美尺码了吗?' : 'Ready to Find Your Perfect Size?'}
                        </h2>
                        <p className="text-white/80 mb-8 max-w-xl mx-auto">
                            {isZh
                                ? '使用我们的交互式尺码转换器，告别尺码烦恼。'
                                : 'Use our interactive size converter and say goodbye to sizing confusion.'
                            }
                        </p>

                        <Link
                            href={getLocalePath('/chart/nike/mens-shoes')}
                            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-primary font-semibold hover:shadow-xl hover:scale-105 transition-all"
                        >
                            {isZh ? '开始使用' : 'Get Started'}
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </section>
            </div>
        </>
    );
}
