// Database types for Supabase

export interface Brand {
    id: string;
    name: string;
    slug: string;
    website?: string;
    logo_url?: string;
    created_at?: string;
}

export interface Category {
    id: string;
    name: string;
    slug: string;
    parent_category?: string;
    created_at?: string;
}

export interface SizeChartShoeEntry {
    us_men?: string;
    us_women?: string;
    uk?: string;
    eu?: string;
    length_cm?: string;
}

export interface SizeChartClothingEntry {
    Size?: string;
    Chest_CM?: string;
    Chest_IN?: string;
    Waist_CM?: string;
    Waist_IN?: string;
    Hip_CM?: string;
    Hip_IN?: string;
    [key: string]: string | undefined;
}

export interface SizeChartData {
    brand: string;
    brand_slug: string;
    category: string;
    category_slug: string;
    gender: string;
    source_url: string;
    collected_date: string;
    notes?: string;
    unit_system?: string[];
    size_chart: SizeChartShoeEntry[] | {
        headers?: string[];
        rows?: SizeChartClothingEntry[];
        standard?: {
            headers?: string[];
            rows?: SizeChartClothingEntry[];
        };
        plus?: {
            headers?: string[];
            rows?: SizeChartClothingEntry[];
        };
        [key: string]: unknown;
    };
    fit_notes?: string;
    measurement_guide?: {
        how_to_measure: string;
        tips: string[];
    };
}

export interface SizeMap {
    id: string;
    brand_id: string;
    category_id: string;
    data: SizeChartData;
    created_at?: string;
    updated_at?: string;
}

// Helper type for shoe size charts (array format)
export function isShoeChart(chart: SizeChartData['size_chart']): chart is SizeChartShoeEntry[] {
    return Array.isArray(chart);
}

// Helper type for clothing size charts (object format)
export function isClothingChart(chart: SizeChartData['size_chart']): chart is { headers?: string[]; rows?: SizeChartClothingEntry[] } {
    return !Array.isArray(chart) && typeof chart === 'object';
}
