import express from 'express';
import { getCollections, createCollection, deleteCollection, assignCollection } from '../controller/CollectionController.js';
import protect from '../middlewares/auth.js';
const CollectionRouter = express.Router();
CollectionRouter.get('/', protect, getCollections);
CollectionRouter.post('/create', protect, createCollection);
CollectionRouter.delete('/delete/:id', protect, deleteCollection);
CollectionRouter.patch('/assign', protect, assignCollection);
export default CollectionRouter;
//# sourceMappingURL=CollectionRoutes.js.map