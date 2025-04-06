import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { text, instructions, context } = req.body;

        if (!text || !instructions) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const prompt = `Please modify the following text according to these instructions:
    
Text: "${text}"

Instructions: ${instructions}

${context ? `Context: ${JSON.stringify(context)}` : ''}

Please provide only the modified text without any explanations or additional content. Do not include any quotation marks around the text.`;

        const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content: 'You are a helpful assistant that modifies text according to user instructions. Provide only the modified text without any explanations or quotation marks.',
                },
                {
                    role: 'user',
                    content: prompt,
                },
            ],
            temperature: 0.7,
            max_tokens: 1000,
        });

        let modifiedText = completion.choices[0]?.message?.content?.trim();

        if (!modifiedText) {
            throw new Error('No response from AI');
        }

        // Remove any double quotes that might be at the beginning or end of the text
        modifiedText = modifiedText.replace(/^["']|["']$/g, '');

        return res.status(200).json({
            status: 'success',
            modifiedText,
        });
    } catch (error) {
        console.error('AI edit error:', error);
        return res.status(500).json({
            status: 'error',
            message: error instanceof Error ? error.message : 'An error occurred',
        });
    }
} 