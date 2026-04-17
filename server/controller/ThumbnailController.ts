import { Request, Response } from "express";
import Thumbnail from "../models/Thumbnail.js";
import User from "../models/User.js";
import { v2 as cloudinary } from "cloudinary";
import axios from "axios";
import sharp from "sharp";

/* ================= CLOUDINARY CONFIG ================= */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!
});

/* ================= STYLE PROMPTS ================= */
const stylePrompts = {
  "Bold & Graphic": "eye-catching thumbnail, bold typography, vibrant colors, expressive facial reaction, dramatic lighting, high contrast, click-worthy composition, professional style",
  "Tech/Futuristic": "futuristic thumbnail, sleek modern design, digital UI elements, glowing accents, holographic effects, cyber-tech aesthetic, sharp lighting, high-tech atmosphere",
  Minimalist: "minimalist thumbnail, clean layout, simple shapes, limited color palette, plenty of negative space, modern flat design, clear focal point",
  Photorealistic: "photorealistic thumbnail, ultra-realistic lighting, natural skin tones, candid moment, DSLR-style photography, lifestyle realism, shallow depth of field",
  Illustrated: "illustrated thumbnail, custom digital illustration, stylized characters, bold outlines, vibrant colors, creative cartoon or vector art style"
};

type ThumbnailStyle = keyof typeof stylePrompts;

/* ================= COLOR SCHEMES ================= */
const colorSchemeDescriptions = {
  vibrant: "vibrant and energetic colors, high saturation, bold contrasts, eye-catching palette",
  sunset: "warm sunset tones, orange pink and purple hues, soft gradients, cinematic glow",
  forest: "natural green tones, earthy colors, calm and organic palette, fresh atmosphere",
  neon: "neon glow effects, electric blues and pinks, cyberpunk lighting, high contrast glow",
  purple: "purple-dominant color palette, magenta and violet tones, modern and stylish mood",
  monochrome: "black and white color scheme, high contrast, dramatic lighting, timeless aesthetic",
  ocean: "cool blue and teal tones, aquatic color palette, fresh and clean atmosphere",
  pastel: "soft pastel colors, low saturation, gentle tones, clean aesthetic"
};

type ColorSchemeKey = keyof typeof colorSchemeDescriptions;

/* ================= HELPER: TEXT WRAP ================= */
const wrapText = (text: string, maxCharsPerLine: number): string[] => {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = "";
  for (const word of words) {
    if ((currentLine + " " + word).trim().length <= maxCharsPerLine) {
      currentLine = (currentLine + " " + word).trim();
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
};

/* =====================================================
   =============== GENERATE THUMBNAIL ===================
   ===================================================== */
export const generateThumbnail = async (req: Request, res: Response) => {
  try {
    const userId = req.session.userId;
    if (!userId) return res.status(401).json({ message: "User not logged in" });

    const user = await User.findById(userId);
    if (!user || user.credits <= 0) {
      return res.status(403).json({ message: "Credits khatam ho gaye!" });
    }

    const { title, prompt: user_prompt, style, aspect_ratio, color_scheme } = req.body;
    if (!title || !style) return res.status(400).json({ message: "Title and style are required" });

    // Image processing logic starts here (Stability AI + Sharp)
    const finalImageUrl = await processImageGeneration(title, user_prompt, style, aspect_ratio, color_scheme);

    const thumbnail = await Thumbnail.create({
      userId,
      title,
      user_prompt,
      style,
      aspect_ratio: aspect_ratio || "16:9",
      color_scheme,
      imageUrl: finalImageUrl,
      isGenerating: false
    });

    // Deduct Credit
    user.credits -= 1;
    await user.save();

    res.status(201).json(thumbnail);
  } catch (error) {
    res.status(500).json({ message: "Generation failed", error });
  }
};

/* =====================================================
   ============== REGENERATE THUMBNAIL =================
   ===================================================== */
export const regenerateThumbnail = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.session.userId;
    const existing = await Thumbnail.findById(id);

    if (!existing) return res.status(404).json({ message: "Thumbnail not found" });

    // ✅ CHECK: Taking from req.body or falling back to existing data
    const title = req.body.title || existing.title;
    const user_prompt = req.body.prompt ?? existing.user_prompt; 
    const style = req.body.style || (existing.style as ThumbnailStyle);
    const aspect_ratio = req.body.aspect_ratio || existing.aspect_ratio;
    const color_scheme = req.body.color_scheme || (existing.color_scheme as ColorSchemeKey);

    // Image processing logic
    const finalImageUrl = await processImageGeneration(title, user_prompt, style, aspect_ratio, color_scheme);

    existing.title = title;
    existing.user_prompt = user_prompt;
    existing.imageUrl = finalImageUrl;
    existing.style = style;
    existing.color_scheme = color_scheme;
    await existing.save();

    res.json(existing);
  } catch (error) {
    res.status(500).json({ message: "Regeneration failed", error });
  }
};

/* ================= HELPER: SHARED GEN LOGIC ================= */
async function processImageGeneration(title: string, user_prompt: string, style: any, aspect_ratio: any, color_scheme: any) {
    const styleKey = style as ThumbnailStyle;
    const colorKey = color_scheme as ColorSchemeKey;
    const safeAspectRatio = aspect_ratio || "16:9";

    let finalPrompt = `YouTube thumbnail for "${title}", ${stylePrompts[styleKey]}`;
    if (colorKey) finalPrompt += `, ${colorSchemeDescriptions[colorKey]}`;
    if (user_prompt) finalPrompt += `, ${user_prompt}`;
    finalPrompt += ", highly detailed, professional, 4k quality, no text, no words";

    let width = 1344, height = 768;
    if (safeAspectRatio === "1:1") { width = 1024; height = 1024; }
    else if (safeAspectRatio === "9:16") { width = 768; height = 1344; }

    const stabilityResponse = await axios.post(
      `https://stability.ai`,
      {
        text_prompts: [{ text: finalPrompt, weight: 1 }, { text: "blurry, text, watermark", weight: -1 }],
        cfg_scale: 7, height, width, steps: 30, samples: 1
      },
      { headers: { Authorization: `Bearer ${process.env.STABILITY_API_KEY}` } }
    );

    const imageBuffer = Buffer.from(stabilityResponse.data.artifacts[0].base64, "base64");
    
    // Sharp Overlay Logic
    const fontSize = width > 900 ? 70 : 44;
    const lines = wrapText(title.toUpperCase(), width > 900 ? 22 : 16);
    const svgOverlay = `<svg width="${width}" height="${height}">
      <rect x="0" y="${height - 150}" width="${width}" height="150" fill="black" opacity="0.5""")/>>
      <text x="50%" y="${height - 80}" text-anchor="middle" font-size="${fontSize}" fill="white" font-family="Arial">${lines[0]}</text>
    </svg>`;

    const finalBuffer = await sharp(imageBuffer)
      .composite([{ input: Buffer.from(svgOverlay), top: 0, left: 0 }])
      .png().toBuffer();

    // Upload to Cloudinary
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream({ folder: "thumbnails" }, (error, result) => {
        if (error) reject(error);
        else resolve(result?.secure_url);
      }).end(finalBuffer);
    });
}
/* =====================================================
   =============== DELETE THUMBNAIL ====================
   ===================================================== */
export const deleteThumbnail = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.session.userId;

    const thumbnail = await Thumbnail.findOne({ _id: id, userId });

    if (!thumbnail) {
      return res.status(404).json({ message: "Thumbnail not found or unauthorized" });
    }

    // Cloudinary se image delete karna (Optional but recommended)
    if (thumbnail.imageUrl) {
      const publicId = thumbnail.imageUrl.split('/').pop()?.split('.')[0];
      if (publicId) {
        await cloudinary.uploader.destroy(`thumbnails/${publicId}`);
      }
    }

    await Thumbnail.findByIdAndDelete(id);
    res.json({ message: "Thumbnail deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed", error });
  }
};
