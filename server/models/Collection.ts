import mongoose, { Document } from 'mongoose';

export interface ICollection extends Document {
    userId: string;
    name: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const CollectionSchema = new mongoose.Schema<ICollection>(
    {
        userId: { type: String, ref: 'User', required: true },
        name: { type: String, required: true, trim: true },
    },
    { timestamps: true }
);

const Collection = mongoose.models.Collection || mongoose.model<ICollection>('Collection', CollectionSchema);

export default Collection;