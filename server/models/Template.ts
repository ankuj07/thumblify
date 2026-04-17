import mongoose, { Document } from 'mongoose';

export interface ITemplate extends Document {
    title: string;
    category: string;
    style: string;
    color_scheme: string;
    aspect_ratio: string;
    prompt: string;
    preview_emoji: string;
}

const TemplateSchema = new mongoose.Schema<ITemplate>(
    {
        title: { type: String, required: true },
        category: { type: String, required: true },
        style: { type: String, required: true },
        color_scheme: { type: String, required: true },
        aspect_ratio: { type: String, default: '16:9' },
        prompt: { type: String, required: true },
        preview_emoji: { type: String, default: '🎨' },
    },
    { timestamps: true }
);

const Template = mongoose.models.Template || mongoose.model<ITemplate>('Template', TemplateSchema);

export default Template;