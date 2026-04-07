import express from 'express';
import { notificationRouter } from './notification.route';
const router = express.Router();
router.use("/notification",notificationRouter);

router.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Service is healthy' });
});

export { router as routes };