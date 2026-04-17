import { Request, Response } from 'express';
import Template from '../models/Template.js';

// Saare templates fetch karo (category filter ke saath)
export const getTemplates = async (req: Request, res: Response) => {
    try {
        const { category } = req.query;

        const filter = category && category !== 'All'
            ? { category }
            : {};

        const templates = await Template.find(filter).sort({ category: 1 });
        return res.json({ templates });
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};

// Templates seed karo — Server start par call karne ke liye req/res optional kiya gaya hai
export const seedTemplates = async (req?: Request, res?: Response) => {
    try {
        const existing = await Template.countDocuments();
        
        if (existing > 0) {
            console.log('ℹ️ Templates already seeded in Database.');
            // Agar API se call hua hai toh response bhejo
            if (res) return res.json({ message: 'Templates already seeded' });
            return;
        }

        const templates = [
            // Gaming
            { title: '5 Tips to Win Every Match', category: 'Gaming', style: 'Bold & Graphic', color_scheme: 'neon', aspect_ratio: '16:9', prompt: 'Epic gaming thumbnail with controller, bright colors, action feel', preview_emoji: '🎮' },
            { title: 'I Played for 24 Hours Straight', category: 'Gaming', style: 'Bold & Graphic', color_scheme: 'vibrant', aspect_ratio: '16:9', prompt: 'Shocked face gamer, marathon gaming session, dramatic lighting', preview_emoji: '😱' },
            { title: 'Best Gaming Setup Under ₹50,000', category: 'Gaming', style: 'Tech/Futuristic', color_scheme: 'purple', aspect_ratio: '16:9', prompt: 'Clean gaming desk setup, RGB lighting, futuristic vibe', preview_emoji: '💻' },

            // Tech
            { title: 'Top 10 VS Code Extensions 2024', category: 'Tech', style: 'Tech/Futuristic', color_scheme: 'neon', aspect_ratio: '16:9', prompt: 'VS Code editor screenshot, developer workspace, clean tech aesthetic', preview_emoji: '⚡' },
            { title: 'I Built an App in 1 Day', category: 'Tech', style: 'Tech/Futuristic', color_scheme: 'ocean', aspect_ratio: '16:9', prompt: 'Coding screen, timer countdown, developer hustle energy', preview_emoji: '🚀' },
            { title: 'React vs Next.js — Which is Better?', category: 'Tech', style: 'Minimalist', color_scheme: 'monochrome', aspect_ratio: '16:9', prompt: 'React vs Next.js comparison, clean minimal design, tech logos', preview_emoji: '⚛️' },

            // Finance
            { title: 'How I Saved ₹1 Lakh in 6 Months', category: 'Finance', style: 'Bold & Graphic', color_scheme: 'forest', aspect_ratio: '16:9', prompt: 'Money savings, piggy bank, financial freedom visualization', preview_emoji: '💰' },
            { title: 'Best Investment Apps in India 2024', category: 'Finance', style: 'Minimalist', color_scheme: 'ocean', aspect_ratio: '16:9', prompt: 'Clean investment apps UI, mobile screen, professional finance look', preview_emoji: '📈' },
            { title: 'Stock Market for Beginners', category: 'Finance', style: 'Tech/Futuristic', color_scheme: 'vibrant', aspect_ratio: '16:9', prompt: 'Stock market graph going up, beginner friendly, bright optimistic', preview_emoji: '📊' },

            // Cooking
            { title: '5 Min Breakfast Recipes', category: 'Cooking', style: 'Photorealistic', color_scheme: 'sunset', aspect_ratio: '16:9', prompt: 'Delicious breakfast spread, morning light, warm food photography', preview_emoji: '🍳' },
            { title: 'Street Food Tour of Delhi', category: 'Cooking', style: 'Photorealistic', color_scheme: 'vibrant', aspect_ratio: '16:9', prompt: 'Colorful street food, Delhi vibes, mouth watering food close up', preview_emoji: '🌮' },
            { title: 'Healthy Meal Prep for the Week', category: 'Cooking', style: 'Minimalist', color_scheme: 'forest', aspect_ratio: '16:9', prompt: 'Clean meal prep containers, healthy food, organized kitchen aesthetic', preview_emoji: '🥗' },

            // Motivation
            { title: 'Wake Up at 5AM for 30 Days', category: 'Motivation', style: 'Bold & Graphic', color_scheme: 'sunset', aspect_ratio: '16:9', prompt: 'Early morning sunrise, alarm clock, transformation energy', preview_emoji: '🌅' },
            { title: 'How I Changed My Life in 1 Year', category: 'Motivation', style: 'Photorealistic', color_scheme: 'vibrant', aspect_ratio: '16:9', prompt: 'Before after transformation, powerful inspiring visual', preview_emoji: '💪' },
            { title: 'Stop Wasting Time — Do This Instead', category: 'Motivation', style: 'Bold & Graphic', color_scheme: 'neon', aspect_ratio: '16:9', prompt: 'Clock, productivity, urgent bold message, high energy', preview_emoji: '⏰' },
        ];

        await Template.insertMany(templates);
        console.log(`✅ ${templates.length} templates seeded successfully.`);

        if (res) {
            return res.json({ message: `${templates.length} templates seeded successfully` });
        }
    } catch (error: any) {
        console.error("❌ Seeding Error:", error.message);
        if (res) {
            return res.status(500).json({ message: error.message });
        }
    }
};
