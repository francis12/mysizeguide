import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        // Initialize Resend inside handler to avoid build-time errors
        const resend = new Resend(process.env.RESEND_API_KEY);

        const body = await request.json();
        const { brand, category, type, details, email, timestamp } = body;

        // Validate required fields
        if (!brand || !category || !type || !details) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Map type to readable label
        const typeLabels: Record<string, string> = {
            inaccurate: '尺码数据不准确',
            outdated: '数据已过时',
            missing: '缺少尺码信息',
            other: '其他问题',
        };

        const { data, error } = await resend.emails.send({
            from: 'MySizeGuide <onboarding@resend.dev>',
            to: ['zhengxiaomings@gmail.com'],
            subject: `[MySizeGuide] 用户反馈: ${brand} - ${category}`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #667eea;">MySizeGuide 用户反馈</h2>
                    
                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                        <tr>
                            <td style="padding: 10px; border: 1px solid #e2e8f0; background: #f7fafc; font-weight: bold;">品牌</td>
                            <td style="padding: 10px; border: 1px solid #e2e8f0;">${brand}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border: 1px solid #e2e8f0; background: #f7fafc; font-weight: bold;">类别</td>
                            <td style="padding: 10px; border: 1px solid #e2e8f0;">${category}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border: 1px solid #e2e8f0; background: #f7fafc; font-weight: bold;">问题类型</td>
                            <td style="padding: 10px; border: 1px solid #e2e8f0;">${typeLabels[type] || type}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border: 1px solid #e2e8f0; background: #f7fafc; font-weight: bold;">用户邮箱</td>
                            <td style="padding: 10px; border: 1px solid #e2e8f0;">${email || '未提供'}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border: 1px solid #e2e8f0; background: #f7fafc; font-weight: bold;">提交时间</td>
                            <td style="padding: 10px; border: 1px solid #e2e8f0;">${new Date(timestamp).toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}</td>
                        </tr>
                    </table>
                    
                    <div style="background: #f7fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px;">
                        <h3 style="margin-top: 0; color: #4a5568;">详细描述</h3>
                        <p style="color: #2d3748; white-space: pre-wrap;">${details}</p>
                    </div>
                    
                    <p style="color: #718096; font-size: 12px; margin-top: 20px;">
                        此邮件由 MySizeGuide 系统自动发送
                    </p>
                </div>
            `,
        });

        if (error) {
            console.error('Resend error:', error);
            return NextResponse.json(
                { error: 'Failed to send email' },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true, id: data?.id });
    } catch (error) {
        console.error('API error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
