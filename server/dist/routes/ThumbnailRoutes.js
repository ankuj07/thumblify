import express from 'express';
import { deleteThumbnail, generateThumbnail, regenerateThumbnail } from '../controller/ThumbnailController.js';
import protect from '../middlewares/auth.js';
const ThumbnailRouter = express.Router();
ThumbnailRouter.post('/generate', protect, generateThumbnail);
ThumbnailRouter.post('/regenerate/:id', protect, regenerateThumbnail);
ThumbnailRouter.delete('/delete/:id', protect, deleteThumbnail);
export default ThumbnailRouter;
//# sourceMappingURL=ThumbnailRoutes.js.map