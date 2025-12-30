import { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { locales, type Locale } from '@/i18n/config';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Import messages
import enMessages from '@/i18n/messages/en.json';
import zhMessages from '@/i18n/messages/zh.json';

const messages = {
    en: enMessages,
    zh: zhMessages,
};

export function generateStaticParams() {
    return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
    children,
    params,
}: {
    children: ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    if (!locales.includes(locale as Locale)) {
        notFound();
    }

    const currentLocale = locale as Locale;
    const currentMessages = messages[currentLocale];

    return (
        <div className="min-h-screen flex flex-col">
            <Header locale={currentLocale} messages={currentMessages} />
            <main className="flex-1">
                {children}
            </main>
            <Footer locale={currentLocale} messages={currentMessages} />
        </div>
    );
}
