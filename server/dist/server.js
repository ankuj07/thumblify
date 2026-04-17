import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from "./configs/db.js";
import session from 'express-session';
import MongoStore from 'connect-mongo';
import AuthRouter from "./routes/AuthRoutes.js";
import ThumbnailRouter from './routes/ThumbnailRoutes.js';
import UserRouter from './routes/UserRoutes.js';
import CollectionRouter from './routes/CollectionRoutes.js';
import TemplateRouter from './routes/TemplateRoutes.js';
// ✅ Correct Import
import { seedTemplates } from './controller/TemplateController.js';
const startServer = async () => {
    // 1. Connect to Database
    await connectDB();
    // 2. Seed Templates (This will now work without 'req' and 'res')
    await seedTemplates();
    const app = express();
    // 3. Middlewares
    app.use(cors({
        origin: ['http://localhost:5173', 'http://localhost:3000'],
        credentials: true
    }));
    app.use(session({
        secret: process.env.SESSION_SECRET || 'fallback_secret',
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 7,
            httpOnly: true
        },
        store: MongoStore.create({
            mongoUrl: process.env.MONGODB_URL,
            collectionName: 'sessions'
        })
    }));
    app.use(express.json());
    // 4. Routes
    app.get('/', (req, res) => {
        res.send('Server is Live!');
    });
    app.use('/api/auth', AuthRouter);
    app.use('/api/thumbnail', ThumbnailRouter);
    app.use('/api/user', UserRouter);
    app.use('/api/collection', CollectionRouter);
    app.use('/api/template', TemplateRouter);
    // 5. Start Listening
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`🚀 Server is running at http://localhost:${port}`);
    });
};
startServer().catch((err) => {
    console.error("Failed to start server:", err);
});
//# sourceMappingURL=server.js.map