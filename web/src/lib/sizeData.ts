import fs from 'fs';
import path from 'path';
import { SizeChartData } from './types';

export async function getSizeChartData(brand: string, category: string): Promise<SizeChartData | null> {
    try {
        const filePath = path.join(process.cwd(), '..', 'data', brand, category, 'size_chart.json');

        if (!fs.existsSync(filePath)) {
            return null;
        }

        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(fileContent);

        // Ensure slugs are present
        return {
            ...data,
            brand_slug: data.brand_slug || brand,
            category_slug: data.category_slug || category,
        } as SizeChartData;
    } catch (error) {
        console.error(`Error loading size chart for ${brand}/${category}:`, error);
        return null;
    }
}
