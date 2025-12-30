import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import type { Locale } from '@/i18n/config';

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
    locale: Locale;
}

export default function Breadcrumb({ items, locale }: BreadcrumbProps) {
    return (
        <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
                <li>
                    <Link
                        href={`/${locale}`}
                        className="flex items-center gap-1 hover:text-foreground transition-colors"
                    >
                        <Home className="w-4 h-4" />
                        <span className="sr-only">Home</span>
                    </Link>
                </li>
                {items.map((item, index) => (
                    <li key={index} className="flex items-center gap-2">
                        <ChevronRight className="w-4 h-4" />
                        {item.href ? (
                            <Link
                                href={item.href}
                                className="hover:text-foreground transition-colors"
                            >
                                {item.label}
                            </Link>
                        ) : (
                            <span className="text-foreground font-medium">{item.label}</span>
                        )}
                    </li>
                ))}
            </ol>

            {/* JSON-LD Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "BreadcrumbList",
                        "itemListElement": [
                            {
                                "@type": "ListItem",
                                "position": 1,
                                "name": "Home",
                                "item": `/${locale}`
                            },
                            ...items.map((item, index) => ({
                                "@type": "ListItem",
                                "position": index + 2,
                                "name": item.label,
                                "item": item.href || undefined
                            }))
                        ]
                    })
                }}
            />
        </nav>
    );
}
