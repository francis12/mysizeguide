'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Globe, ChevronDown, Sparkles } from 'lucide-react';
import { locales, localeNames, type Locale } from '@/i18n/config';

interface HeaderProps {
    locale: Locale;
    messages: {
        common: {
            siteName: string;
            tagline: string;
            home: string;
            brands: string;
            compare: string;
            faq: string;
            language: string;
        };
    };
}

export default function Header({ locale, messages }: HeaderProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [langMenuOpen, setLangMenuOpen] = useState(false);
    const t = messages.common;

    // Helper to generate locale-aware paths (no /en for English)
    const getLocalePath = (path: string = '') => {
        return locale === 'en' ? path || '/' : `/${locale}${path}`;
    };

    return (
        <header className="sticky top-0 z-50 glass border-b border-border/50">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link href={getLocalePath()} className="flex items-center gap-3 group">
                            <div className="relative">
                                <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                                    <Sparkles className="w-5 h-5 text-white" />
                                </div>
                                <div className="absolute inset-0 rounded-xl gradient-bg blur-lg opacity-50 group-hover:opacity-70 transition-opacity" />
                            </div>
                            <span className="font-bold text-xl gradient-text hidden sm:block">
                                {t.siteName}
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-1">
                        <Link
                            href={getLocalePath()}
                            className="px-4 py-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-all font-medium"
                        >
                            {t.home}
                        </Link>
                        <Link
                            href={getLocalePath('/brands')}
                            className="px-4 py-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-all font-medium"
                        >
                            {t.brands}
                        </Link>
                        <Link
                            href={getLocalePath('/compare')}
                            className="px-4 py-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-all font-medium"
                        >
                            {t.compare}
                        </Link>
                        <Link
                            href={`${getLocalePath()}#faq`}
                            className="px-4 py-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-all font-medium"
                        >
                            {t.faq}
                        </Link>
                    </div>

                    {/* Language Switcher */}
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <button
                                onClick={() => setLangMenuOpen(!langMenuOpen)}
                                className="flex items-center gap-2 px-3 py-2 rounded-full glass border border-border/50 hover:border-primary/50 transition-all"
                            >
                                <Globe className="w-4 h-4 text-primary" />
                                <span className="text-sm font-medium">{localeNames[locale]}</span>
                                <ChevronDown className={`w-4 h-4 transition-transform ${langMenuOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {langMenuOpen && (
                                <div className="absolute right-0 mt-2 w-36 glass-card overflow-hidden shadow-xl">
                                    {locales.map((loc) => (
                                        <Link
                                            key={loc}
                                            href={`/${loc}`}
                                            className={`block px-4 py-3 text-sm hover:bg-muted transition-colors ${loc === locale ? 'bg-primary/10 text-primary font-medium' : ''
                                                }`}
                                            onClick={() => setLangMenuOpen(false)}
                                        >
                                            {localeNames[loc]}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Mobile menu button */}
                        <button
                            className="md:hidden p-2 rounded-full glass border border-border/50 hover:border-primary/50 transition-all"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? (
                                <X className="w-5 h-5" />
                            ) : (
                                <Menu className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {mobileMenuOpen && (
                    <div className="md:hidden py-4 border-t border-border/50">
                        <div className="flex flex-col gap-1">
                            <Link
                                href={getLocalePath()}
                                className="px-4 py-3 rounded-xl hover:bg-muted transition-colors font-medium"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {t.home}
                            </Link>
                            <Link
                                href={getLocalePath('/brands')}
                                className="px-4 py-3 rounded-xl hover:bg-muted transition-colors font-medium"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {t.brands}
                            </Link>
                            <Link
                                href={getLocalePath('/compare')}
                                className="px-4 py-3 rounded-xl hover:bg-muted transition-colors font-medium"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {t.compare}
                            </Link>
                            <Link
                                href={`${getLocalePath()}#faq`}
                                className="px-4 py-3 rounded-xl hover:bg-muted transition-colors font-medium"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {t.faq}
                            </Link>
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
}
