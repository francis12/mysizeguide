# SizeGuide - Global Size Charts & Converter

A modern, SEO-optimized size chart converter built with Next.js 15, supporting multiple languages and international size conversions.

## Features

- 🔄 **Interactive Size Converter** - Real-time conversion between US, UK, EU, and CM sizes
- 🌍 **Multi-language Support** - English and Chinese (中文)
- 📱 **Responsive Design** - Modern, minimalist UI that works on all devices
- 🔍 **SEO Optimized** - Structured data, dynamic metadata, and breadcrumbs
- ⚡ **Static Generation** - Fast page loads with Next.js SSG
- 🎨 **Modern UI** - Built with Tailwind CSS and glassmorphism effects

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (prepared)
- **Icons**: Lucide React
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
cd web
npm install
```

### Environment Variables

Copy `env.example` to `.env.local` and fill in your Supabase credentials:

```bash
cp env.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
```

## Project Structure

```
web/
├── src/
│   ├── app/
│   │   ├── [locale]/           # Locale-based routing
│   │   │   ├── page.tsx        # Homepage
│   │   │   ├── brands/         # Brands listing
│   │   │   └── chart/          # Size chart pages
│   │   │       └── [brand]/
│   │   │           └── [category]/
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Root redirect
│   │   └── globals.css         # Global styles
│   ├── components/
│   │   ├── Header.tsx          # Navigation header
│   │   ├── Footer.tsx          # Page footer
│   │   ├── Breadcrumb.tsx      # SEO breadcrumbs
│   │   ├── SizeConverter.tsx   # Interactive converter
│   │   └── SizeTable.tsx       # Size chart table
│   ├── i18n/
│   │   ├── config.ts           # i18n configuration
│   │   └── messages/           # Translations
│   │       ├── en.json
│   │       └── zh.json
│   └── lib/
│       ├── supabase.ts         # Supabase client
│       └── types.ts            # TypeScript types
├── data/                       # Size chart JSON data (symlink)
├── next.config.ts
├── tailwind.config.ts
└── package.json
```

## Routes

| Route | Description |
|-------|-------------|
| `/` | Redirects to default locale |
| `/en` | English homepage |
| `/zh` | Chinese homepage |
| `/[locale]/brands` | All brands listing |
| `/[locale]/chart/[brand]/[category]` | Size chart page |

## Deployment (Vercel)

1. Push your code to GitHub
2. Import the repository in Vercel
3. Set environment variables in Vercel dashboard
4. Deploy!

## Data

Size chart data is stored in JSON format under the `data/` directory, organized by brand and category:

```
data/
├── nike/
│   ├── mens-shoes/
│   │   └── size_chart.json
│   ├── womens-shoes/
│   │   └── size_chart.json
│   └── ...
├── adidas/
│   └── ...
└── ...
```

## License

MIT
