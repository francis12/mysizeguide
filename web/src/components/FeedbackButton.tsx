'use client';

import { useState } from 'react';
import { MessageSquareWarning, X, Send, CheckCircle } from 'lucide-react';

interface FeedbackButtonProps {
    brandName: string;
    categoryName: string;
    messages: {
        feedback: {
            button: string;
            title: string;
            description: string;
            type: string;
            typeOptions: {
                inaccurate: string;
                outdated: string;
                missing: string;
                other: string;
            };
            details: string;
            detailsPlaceholder: string;
            email: string;
            emailPlaceholder: string;
            submit: string;
            submitting: string;
            success: string;
            close: string;
        };
    };
}

export default function FeedbackButton({ brandName, categoryName, messages }: FeedbackButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [formData, setFormData] = useState({
        type: 'inaccurate',
        details: '',
        email: '',
    });

    const t = messages.feedback;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call - in production, send to your backend
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Log feedback (in production, send to database/email)
        console.log('Feedback submitted:', {
            brand: brandName,
            category: categoryName,
            ...formData,
            timestamp: new Date().toISOString(),
        });

        setIsSubmitting(false);
        setIsSuccess(true);

        // Reset after 2 seconds
        setTimeout(() => {
            setIsOpen(false);
            setIsSuccess(false);
            setFormData({ type: 'inaccurate', details: '', email: '' });
        }, 2000);
    };

    return (
        <>
            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 rounded-full glass border border-border/50 shadow-lg hover:border-primary/50 hover:shadow-xl transition-all group"
                title={t.button}
            >
                <MessageSquareWarning className="w-5 h-5 text-primary" />
                <span className="hidden sm:inline text-sm font-medium">{t.button}</span>
            </button>

            {/* Modal Overlay */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={() => !isSubmitting && setIsOpen(false)}
                    />

                    {/* Modal */}
                    <div className="relative w-full max-w-md glass-card overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        {/* Header */}
                        <div className="p-6 border-b border-border/50">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="icon-gradient">
                                        <MessageSquareWarning className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-lg font-bold gradient-text">{t.title}</h3>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    disabled={isSubmitting}
                                    className="p-2 rounded-full hover:bg-muted transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <p className="text-sm text-muted-foreground mt-2">{t.description}</p>
                        </div>

                        {/* Content */}
                        {isSuccess ? (
                            <div className="p-8 text-center">
                                <div className="w-16 h-16 rounded-full bg-green-100 mx-auto mb-4 flex items-center justify-center">
                                    <CheckCircle className="w-8 h-8 text-green-600" />
                                </div>
                                <p className="text-lg font-semibold text-green-600">{t.success}</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                {/* Brand/Category Info */}
                                <div className="flex gap-2 text-sm">
                                    <span className="badge">{brandName}</span>
                                    <span className="badge-outline">{categoryName}</span>
                                </div>

                                {/* Issue Type */}
                                <div>
                                    <label className="block text-sm font-medium mb-2">{t.type}</label>
                                    <select
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                        className="input-glass w-full"
                                        required
                                    >
                                        <option value="inaccurate">{t.typeOptions.inaccurate}</option>
                                        <option value="outdated">{t.typeOptions.outdated}</option>
                                        <option value="missing">{t.typeOptions.missing}</option>
                                        <option value="other">{t.typeOptions.other}</option>
                                    </select>
                                </div>

                                {/* Details */}
                                <div>
                                    <label className="block text-sm font-medium mb-2">{t.details}</label>
                                    <textarea
                                        value={formData.details}
                                        onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                                        placeholder={t.detailsPlaceholder}
                                        className="input-glass w-full h-24 resize-none"
                                        required
                                    />
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-sm font-medium mb-2">{t.email}</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        placeholder={t.emailPlaceholder}
                                        className="input-glass w-full"
                                    />
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="btn-glow w-full flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            {t.submitting}
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-4 h-4" />
                                            {t.submit}
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
