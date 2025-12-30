import fs from 'fs';
import path from 'path';

export interface BrandInfo {
    slug: string;
    name: string;
    categories: string[];
}

export async function getBrands(): Promise<BrandInfo[]> {
    const dataDir = path.join(process.cwd(), '..', 'data');
    const brands: BrandInfo[] = [];

    try {
        if (!fs.existsSync(dataDir)) {
            return [];
        }

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
