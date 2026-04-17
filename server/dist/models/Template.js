import mongoose from 'mongoose';
const TemplateSchema = new mongoose.Schema({
    title: { type: String, required: true },
    category: { type: String, required: true },
    style: { type: String, required: true },
    color_scheme: { type: String, required: true },
    aspect_ratio: { type: String, default: '16:9' },
    prompt: { type: String, required: true },
    preview_emoji: { type: String, default: '🎨' },
}, { timestamps: true });
const Template = mongoose.models.Template || mongoose.model('Template', TemplateSchema);
export default Template;
//# sourceMappingURL=Template.js.map