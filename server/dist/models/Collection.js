import mongoose from 'mongoose';
const CollectionSchema = new mongoose.Schema({
    userId: { type: String, ref: 'User', required: true },
    name: { type: String, required: true, trim: true },
}, { timestamps: true });
const Collection = mongoose.models.Collection || mongoose.model('Collection', CollectionSchema);
export default Collection;
//# sourceMappingURL=Collection.js.map