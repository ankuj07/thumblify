import express from 'express';
import { getTemplates, seedTemplates } from '../controller/TemplateController.js';
import protect from '../middlewares/auth.js';

const TemplateRouter = express.Router();

TemplateRouter.get('/', protect, getTemplates);
TemplateRouter.post('/seed', seedTemplates); // protect nahi — ek baar run karna hai

export default TemplateRouter;