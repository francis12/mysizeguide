'use client';

import { useState, useMemo, useEffect } from 'react';
import { Ruler, Sparkles } from 'lucide-react';
import { SizeChartData, isShoeChart } from '@/lib/types';

interface SizeConverterProps {
    data: SizeChartData;
    messages: {
        sizePage: {
            converter: {
                title: string;
                placeholder: string;
                inputLabel: string;
                result: string;
                noMatch: string;
                closestMatch: string;
            };
        };
        units: Record<string, string>;
    };
    onHighlight: (index: number | null) => void;
}

type UnitType = 'cm' | 'inch' | 'us_men' | 'us_women' | 'uk' | 'eu';

const unitOptions: { value: UnitType; label: string }[] = [
    { value: 'cm', label: 'CM' },
    { value: 'inch', label: 'Inch' },
    { value: 'us_men', label: 'US Men' },
    { value: 'us_women', label: 'US Women' },
    { value: 'uk', label: 'UK' },
    { value: 'eu', label: 'EU' },
];

export default function SizeConverter({ data, messages, onHighlight }: SizeConverterProps) {
    const [inputValue, setInputValue] = useState('');
    const [selectedUnit, setSelectedUnit] = useState<UnitType>('cm');
    const t = messages.sizePage.converter;

    const availableUnits = useMemo(() => {
        if (!isShoeChart(data.size_chart)) {
            return [
                { value: 'cm' as UnitType, label: 'CM' },
                { value: 'inch' as UnitType, label: 'Inch' },
            ];
        }

        const firstEntry = data.size_chart[0];
        return unitOptions.filter(unit => {
            if (unit.value === 'cm') return 'length_cm' in firstEntry;
            if (unit.value === 'inch') return false;
            return unit.value in firstEntry;
        });
    }, [data.size_chart]);

    const matchResult = useMemo(() => {
        if (!inputValue || !isShoeChart(data.size_chart)) {
            return null;
        }

        const numValue = parseFloat(inputValue);
        if (isNaN(numValue)) {
            return null;
        }

        let matchIndex = -1;
        let closestIndex = -1;
        let closestDiff = Infinity;

        data.size_chart.forEach((entry, index) => {
            let compareValue: number | null = null;

            if (selectedUnit === 'cm' && entry.length_cm) {
                compareValue = parseFloat(entry.length_cm);
            } else if (selectedUnit === 'us_men' && entry.us_men) {
                compareValue = parseFloat(entry.us_men);
            } else if (selectedUnit === 'us_women' && entry.us_women) {
                compareValue = parseFloat(entry.us_women);
            } else if (selectedUnit === 'uk' && entry.uk) {
                compareValue = parseFloat(entry.uk);
            } else if (selectedUnit === 'eu' && entry.eu) {
                compareValue = parseFloat(entry.eu);
            }

            if (compareValue !== null) {
                const diff = Math.abs(compareValue - numValue);
                if (diff === 0) {
                    matchIndex = index;
                }
                if (diff < closestDiff) {
                    closestDiff = diff;
                    closestIndex = index;
                }
            }
        });

        const resultIndex = matchIndex >= 0 ? matchIndex : closestIndex;

        if (resultIndex >= 0) {
            const entry = data.size_chart[resultIndex];
            return {
                exact: matchIndex >= 0,
                entry,
                index: resultIndex,
            };
        }

        return null;
    }, [inputValue, selectedUnit, data.size_chart]);

    useEffect(() => {
        onHighlight(matchResult?.index ?? null);
    }, [matchResult?.index, onHighlight]);

    return (
        <div className="glass-card" style={{ padding: '1rem 1.25rem' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1rem' }}>
                {/* Title */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: '120px' }}>
                    <div className="icon-gradient" style={{ width: '2rem', height: '2rem' }}>
                        <Ruler style={{ width: '1rem', height: '1rem' }} />
                    </div>
                    <span className="gradient-text" style={{ fontWeight: 600, fontSize: '0.9375rem' }}>{t.title}</span>
                </div>

                {/* Input */}
                <div style={{ display: 'flex', gap: '0.5rem', flex: '1', minWidth: '200px' }}>
                    <input
                        type="number"
                        step="0.5"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder={t.placeholder}
                        className="input-glass"
                        style={{ flex: 1, padding: '0.625rem 1rem', fontSize: '0.9375rem' }}
                    />
                    <select
                        value={selectedUnit}
                        onChange={(e) => setSelectedUnit(e.target.value as UnitType)}
                        className="input-glass"
                        style={{ padding: '0.625rem 0.75rem', cursor: 'pointer', fontSize: '0.875rem' }}
                    >
                        {availableUnits.map((unit) => (
                            <option key={unit.value} value={unit.value}>
                                {unit.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Result */}
                <div style={{
                    flex: '1',
                    minWidth: '200px',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '0.5rem',
                    background: matchResult ? 'rgba(102, 126, 234, 0.08)' : 'transparent',
                    border: matchResult ? '1px solid rgba(102, 126, 234, 0.2)' : '1px solid transparent',
                }}>
                    {matchResult ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                <Sparkles style={{ width: '0.875rem', height: '0.875rem', color: '#667eea' }} />
                                <span style={{ fontSize: '0.75rem', color: '#667eea', fontWeight: 500 }}>
                                    {matchResult.exact ? t.result : t.closestMatch}
                                </span>
                            </div>
                            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                                {matchResult.entry.us_men && (
                                    <span style={{ fontSize: '0.875rem' }}>
                                        <span style={{ color: '#64748b' }}>US:</span>{' '}
                                        <strong className="gradient-text">{matchResult.entry.us_men}</strong>
                                    </span>
                                )}
                                {matchResult.entry.uk && (
                                    <span style={{ fontSize: '0.875rem' }}>
                                        <span style={{ color: '#64748b' }}>UK:</span>{' '}
                                        <strong className="gradient-text">{matchResult.entry.uk}</strong>
                                    </span>
                                )}
                                {matchResult.entry.eu && (
                                    <span style={{ fontSize: '0.875rem' }}>
                                        <span style={{ color: '#64748b' }}>EU:</span>{' '}
                                        <strong className="gradient-text">{matchResult.entry.eu}</strong>
                                    </span>
                                )}
                                {matchResult.entry.length_cm && (
                                    <span style={{ fontSize: '0.875rem' }}>
                                        <span style={{ color: '#64748b' }}>CM:</span>{' '}
                                        <strong className="gradient-text">{matchResult.entry.length_cm}</strong>
                                    </span>
                                )}
                            </div>
                        </div>
                    ) : (
                        <span style={{ color: '#94a3b8', fontSize: '0.875rem' }}>{t.noMatch}</span>
                    )}
                </div>
            </div>
        </div>
    );
}
