import { NextRequest, NextResponse } from 'next/server';
import { locales, defaultLocale } from './i18n/config';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Check if the pathname starts with a locale
    const pathnameHasLocale = locales.some(
        (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );

    // If pathname has a locale, proceed normally
    if (pathnameHasLocale) {
        // If it's the default locale (en), redirect to remove the prefix
        if (pathname.startsWith(`/${defaultLocale}/`) || pathname === `/${defaultLocale}`) {
            const newPathname = pathname.replace(`/${defaultLocale}`, '') || '/';
            return NextResponse.redirect(new URL(newPathname, request.url));
        }
        return NextResponse.next();
    }

    // Skip for static files, API routes, and Next.js internal routes
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        pathname.includes('.') ||
        pathname === '/favicon.ico' ||
        pathname === '/sitemap.xml' ||
        pathname === '/robots.txt'
    ) {
        return NextResponse.next();
    }

    // For paths without locale, rewrite to default locale (en) internally
    // but keep the URL clean without /en
    const newUrl = new URL(`/${defaultLocale}${pathname}`, request.url);
    return NextResponse.rewrite(newUrl);
}

export const config = {
    matcher: [
        // Match all paths except static files
        '/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)',
    ],
};
