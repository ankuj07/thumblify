import { Request, Response } from 'express';
import Collection from '../models/Collection.js';
import Thumbnail from '../models/Thumbnail.js';

// Saari collections fetch karo
export const getCollections = async (req: Request, res: Response) => {
    try {
        const userId = req.session.userId;
        const collections = await Collection.find({ userId }).sort({ createdAt: -1 });
        return res.json({ collections });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Naya collection banao
export const createCollection = async (req: Request, res: Response) => {
    try {
        const userId = req.session.userId;
        const { name } = req.body;

        if (!name?.trim()) {
            return res.status(400).json({ message: 'Collection name required' });
        }

        // Same naam se pehle se exist karta hai?
        const existing = await Collection.findOne({ userId, name: name.trim() });
        if (existing) {
            return res.status(400).json({ message: 'Collection already exists' });
        }

        const collection = new Collection({ userId, name: name.trim() });
        await collection.save();

        return res.json({ message: 'Collection created', collection });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Collection delete karo
export const deleteCollection = async (req: Request, res: Response) => {
    try {
        const userId = req.session.userId;
        const { id } = req.params;

        const collection = await Collection.findOne({ _id: id, userId });
        if (!collection) {
            return res.status(404).json({ message: 'Collection not found' });
        }

        // Is collection ki saari thumbnails ko uncollected karo
        await Thumbnail.updateMany(
            { collectionId: id, userId },
            { collectionId: null }
        );

        await collection.deleteOne();
        return res.json({ message: 'Collection deleted' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Thumbnail ko collection mein add/remove karo
export const assignCollection = async (req: Request, res: Response) => {
    try {
        const userId = req.session.userId;
        const { thumbnailId, collectionId } = req.body;

        const thumbnail = await Thumbnail.findOne({ _id: thumbnailId, userId });
        if (!thumbnail) {
            return res.status(404).json({ message: 'Thumbnail not found' });
        }

        // null bheja = remove from collection
        thumbnail.collectionId = collectionId || null;
        await thumbnail.save();

        return res.json({ message: 'Updated', thumbnail });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};