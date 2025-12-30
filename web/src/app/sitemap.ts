import { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';

const BASE_URL = 'https://mysizeguide.com';

// Helper to get the URL prefix for a locale
// English (default) has no prefix, other locales have /{locale}
function getLocalePrefix(locale: string): string {
    return locale === 'en' ? '' : `/${locale}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
    const locales = ['en', 'zh'];
    const sitemap: MetadataRoute.Sitemap = [];

    // Static pages
    const staticPages = ['', '/brands', '/compare'];

    for (const locale of locales) {
        const prefix = getLocalePrefix(locale);
        for (const page of staticPages) {
            sitemap.push({
                url: `${BASE_URL}${prefix}${page || '/'}`.replace(/\/$/, '') || BASE_URL,
                lastModified: new Date(),
                changeFrequency: page === '' ? 'weekly' : 'monthly',
                priority: page === '' ? 1.0 : 0.8,
            });
        }
    }

    // Dynamic size chart pages
    try {
        const dataDir = path.join(process.cwd(), '..', 'data');

        if (fs.existsSync(dataDir)) {
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
                        for (const locale of locales) {
                            const prefix = getLocalePrefix(locale);
                            sitemap.push({
                                url: `${BASE_URL}${prefix}/chart/${brand}/${category}`,
                                lastModified: new Date(),
                                changeFrequency: 'monthly',
                                priority: 0.9,
                            });
                        }
                    }
                }
            }
        }
    } catch (error) {
        console.error('Error generating sitemap:', error);
    }

    return sitemap;
}
