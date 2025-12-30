'use client';

import { SizeChartData, isShoeChart, SizeChartShoeEntry } from '@/lib/types';

interface SizeTableProps {
    data: SizeChartData;
    highlightedIndex: number | null;
    messages: {
        sizePage: {
            table: {
                title: string;
                highlight: string;
            };
        };
        units: Record<string, string>;
        tableHeaders: Record<string, string>;
    };
}

function getValueForHeader(row: Record<string, string | undefined>, header: string): string {
    if (row[header] !== undefined) return row[header];

    const normalized = header
        .replace(/\s*\(([^)]+)\)\s*/g, '_$1')
        .replace(/\s+/g, '_')
        .replace(/_+/g, '_')
        .replace(/_$/, '');

    if (row[normalized] !== undefined) return row[normalized];

    const upperNormalized = normalized.replace(/_([a-z]+)$/i, (_, suffix) => '_' + suffix.toUpperCase());
    if (row[upperNormalized] !== undefined) return row[upperNormalized];

    const possibleKeys = [
        normalized,
        normalized.toUpperCase(),
        normalized.toLowerCase(),
        upperNormalized,
        header.replace(/[^a-zA-Z0-9]/g, '_'),
        header.replace(/[^a-zA-Z0-9]/g, ''),
    ];

    for (const key of possibleKeys) {
        if (row[key] !== undefined) return row[key];
    }

    const baseWord = header.split(/[\s(]/)[0];
    for (const key of Object.keys(row)) {
        if (key.toLowerCase().startsWith(baseWord.toLowerCase())) {
            return row[key] ?? '-';
        }
    }

    return '-';
}

function translateHeader(header: string, tableHeaders: Record<string, string>): string {
    if (tableHeaders[header]) return tableHeaders[header];

    const lowerHeader = header.toLowerCase();
    for (const [key, value] of Object.entries(tableHeaders)) {
        if (key.toLowerCase() === lowerHeader) return value;
    }

    return header;
}

export default function SizeTable({ data, highlightedIndex, messages }: SizeTableProps) {
    const t = messages.sizePage.table;
    const units = messages.units;
    const tableHeaders = messages.tableHeaders || {};

    // Render shoe size table (array format)
    if (isShoeChart(data.size_chart)) {
        const entries = data.size_chart as SizeChartShoeEntry[];
        const firstEntry = entries[0];

        const columns: { key: keyof SizeChartShoeEntry; label: string }[] = [];
        if (firstEntry.us_men) columns.push({ key: 'us_men', label: units.us_men || 'US Men' });
        if (firstEntry.us_women) columns.push({ key: 'us_women', label: units.us_women || 'US Women' });
        if (firstEntry.uk) columns.push({ key: 'uk', label: units.uk || 'UK' });
        if (firstEntry.eu) columns.push({ key: 'eu', label: units.eu || 'EU' });
        if (firstEntry.length_cm) columns.push({ key: 'length_cm', label: units.length_cm || 'CM' });

        return (
            <div className="glass-card overflow-hidden">
                <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(102, 126, 234, 0.15)' }}>
                    <h2 className="gradient-text" style={{ fontSize: '1.25rem', fontWeight: 700 }}>{t.title}</h2>
                    {highlightedIndex !== null && (
                        <p style={{ fontSize: '0.875rem', color: '#667eea', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ width: '0.5rem', height: '0.5rem', borderRadius: '50%', background: '#667eea' }} />
                            {t.highlight}
                        </p>
                    )}
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table className="table-gradient">
                        <thead>
                            <tr>
                                {columns.map((col) => (
                                    <th key={col.key}>{col.label}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {entries.map((entry, index) => (
                                <tr
                                    key={index}
                                    className={highlightedIndex === index ? 'row-highlight' : ''}
                                >
                                    {columns.map((col) => (
                                        <td key={col.key}>
                                            {entry[col.key] || '-'}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    const chartData = data.size_chart;

    // Handle nested structure (standard/plus)
    if ('standard' in chartData && chartData.standard) {
        const sections = [];
        if (chartData.standard) {
            sections.push({ title: 'Standard', data: chartData.standard });
        }
        if ('plus' in chartData && chartData.plus) {
            sections.push({ title: 'Plus Size', data: chartData.plus as { headers?: string[]; rows?: Record<string, string>[] } });
        }

        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {sections.map((section, sectionIndex) => (
                    <div key={sectionIndex} className="glass-card overflow-hidden">
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(102, 126, 234, 0.15)' }}>
                            <h2 className="gradient-text" style={{ fontSize: '1.25rem', fontWeight: 700 }}>{t.title} - {section.title}</h2>
                        </div>

                        <div style={{ overflowX: 'auto' }}>
                            <table className="table-gradient">
                                <thead>
                                    <tr>
                                        {section.data.headers?.map((header, i) => (
                                            <th key={i}>{translateHeader(header, tableHeaders)}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {section.data.rows?.map((row, index) => (
                                        <tr key={index}>
                                            {section.data.headers?.map((header, i) => (
                                                <td key={i}>{getValueForHeader(row, header)}</td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    // Simple object format with headers and rows
    if ('headers' in chartData && 'rows' in chartData && chartData.headers && chartData.rows) {
        return (
            <div className="glass-card overflow-hidden">
                <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(102, 126, 234, 0.15)' }}>
                    <h2 className="gradient-text" style={{ fontSize: '1.25rem', fontWeight: 700 }}>{t.title}</h2>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table className="table-gradient">
                        <thead>
                            <tr>
                                {chartData.headers.map((header, i) => (
                                    <th key={i}>{translateHeader(header, tableHeaders)}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {chartData.rows.map((row, index) => (
                                <tr key={index}>
                                    {chartData.headers?.map((header, i) => (
                                        <td key={i}>{getValueForHeader(row, header)}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    return <div style={{ color: '#64748b' }}>No size data available</div>;
}
