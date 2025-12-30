import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import type { Locale } from '@/i18n/config';

interface FooterProps {
    locale: Locale;
    messages: {
        common: {
            siteName: string;
            tagline: string;
            home: string;
            brands: string;
            compare: string;
            measurementGuide: string;
        };
        footer: {
            navigation: string;
            popularBrands: string;
            categories: string;
            allRightsReserved: string;
        };
        categories: Record<string, string>;
    };
}

export default function Footer({ locale, messages }: FooterProps) {
    const t = messages.common;
    const ft = messages.footer;
    const categories = messages.categories;
    const currentYear = new Date().getFullYear();

    const popularBrands = [
        { name: 'Nike', slug: 'nike', category: 'mens-shoes' },
        { name: 'Adidas', slug: 'adidas', category: 'mens-shoes' },
        { name: 'Zara', slug: 'zara', category: 'womens-tops' },
        { name: 'H&M', slug: 'hm', category: 'mens-tops' },
        { name: 'Uniqlo', slug: 'uniqlo', category: 'mens-tops' },
        { name: 'Puma', slug: 'puma', category: 'mens-shoes' },
    ];

    const categoryLinks = [
        { slug: 'mens-shoes', brand: 'nike' },
        { slug: 'womens-shoes', brand: 'nike' },
        { slug: 'mens-tops', brand: 'zara' },
        { slug: 'womens-tops', brand: 'zara' },
    ];

    // Helper for clean URLs
    const getLocalePath = (path: string) => locale === 'en' ? path : `/${locale}${path}`;

    return (
        <footer className="relative overflow-hidden border-t border-border/50 mt-auto">
            {/* Gradient background */}
            <div className="absolute inset-0 gradient-bg opacity-5" />
            <div className="absolute bottom-0 left-0 w-96 h-96 gradient-bg rounded-full blur-3xl opacity-10 translate-y-1/2 -translate-x-1/2" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                    {/* Brand */}
                    <div className="md:col-span-1">
                        <Link href={`/${locale}`} className="flex items-center gap-3 mb-4 group">
                            <div className="relative">
                                <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                                    <Sparkles className="w-5 h-5 text-white" />
                                </div>
                            </div>
                            <span className="font-bold text-xl gradient-text">{t.siteName}</span>
                        </Link>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            {t.tagline}
                        </p>
                    </div>

                    {/* Navigation */}
                    <div>
                        <h3 className="font-bold mb-4 gradient-text">{ft.navigation}</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link
                                    href={getLocalePath('/')}
                                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                                >
                                    {t.home}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href={getLocalePath('/brands')}
                                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                                >
                                    {t.brands}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href={getLocalePath('/compare')}
                                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                                >
                                    {t.compare}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Popular Brands */}
                    <div>
                        <h3 className="font-bold mb-4 gradient-text">{ft.popularBrands}</h3>
                        <ul className="space-y-3">
                            {popularBrands.map((brand) => (
                                <li key={brand.slug}>
                                    <Link
                                        href={getLocalePath(`/chart/${brand.slug}/${brand.category}`)}
                                        className="text-muted-foreground hover:text-primary transition-colors text-sm"
                                    >
                                        {brand.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Categories */}
                    <div>
                        <h3 className="font-bold mb-4 gradient-text">{ft.categories}</h3>
                        <ul className="space-y-3">
                            {categoryLinks.map((cat) => (
                                <li key={cat.slug}>
                                    <Link
                                        href={getLocalePath(`/chart/${cat.brand}/${cat.slug}`)}
                                        className="text-muted-foreground hover:text-primary transition-colors text-sm"
                                    >
                                        {categories[cat.slug] || cat.slug}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Copyright */}
                <div className="border-t border-border/50 mt-12 pt-8 text-center">
                    <p className="text-muted-foreground text-sm">
                        © {currentYear} <span className="gradient-text font-medium">{t.siteName}</span>. {ft.allRightsReserved}
                    </p>
                </div>
            </div>
        </footer>
    );
}
