'use client';

import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FAQItem {
    question: string;
    answer: string;
}

interface FAQAccordionProps {
    title: string;
    items: FAQItem[];
}

export default function FAQAccordion({ title, items }: FAQAccordionProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <div className="glass-card overflow-hidden mt-8">
            <div className="p-6 border-b border-border/50 flex items-center gap-3">
                <div className="icon-gradient">
                    <HelpCircle className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold gradient-text">{title}</h2>
            </div>
            <div>
                {items.map((item, index) => (
                    <div key={index} className="border-b border-border/50 last:border-0">
                        <button
                            onClick={() => setOpenIndex(openIndex === index ? null : index)}
                            className="w-full flex items-center justify-between p-6 text-left hover:bg-primary/5 transition-colors group"
                        >
                            <span className={`font-semibold text-lg transition-colors ${openIndex === index ? 'text-primary' : ''}`}>
                                {item.question}
                            </span>
                            <ChevronDown
                                className={`w-5 h-5 text-muted-foreground transition-transform duration-300 ${openIndex === index ? 'rotate-180 text-primary' : ''
                                    }`}
                            />
                        </button>
                        <div
                            className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
                                }`}
                        >
                            <p className="px-6 pb-6 text-muted-foreground leading-relaxed">
                                {item.answer}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
