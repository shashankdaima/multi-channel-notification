import { RequestHandler } from "express";
import { EmailChannel, MQTTChannel, PushChannel, SMSChannel, SlackChannel } from "../models/channel.model";
import { Notification } from "../models/notification.model";
import { SmsNotificationDispatcherImplementation } from "../services/notification_dispatcher.service";
import { Result, Success } from "../utils/result.util";
export const dispatchNotification: RequestHandler = async (req, res, next) => {
    try {
        let notificationChannel;
        const notification = new Notification('Your message here');
        const notificationChannelData = req.body;
        let result: Result<Boolean> | undefined = undefined;
        switch (notificationChannelData.type) {
            case 'email':
                notificationChannel = new EmailChannel(notificationChannelData.recipients, notificationChannelData.subject, notificationChannelData.body);
                break;
            case 'push':
                notificationChannel = new PushChannel(notificationChannelData.recipients, notificationChannelData.title, notificationChannelData.body);
                break;
            case 'SMS':
                const notificationDispatcher = new SmsNotificationDispatcherImplementation();
                notificationChannel = new SMSChannel( notificationChannelData.recipients, notificationChannelData.message);
                result = await notificationDispatcher.dispatch(notificationChannel, notification);
                break;
            case 'MQTT':
                notificationChannel = new MQTTChannel(notificationChannelData.topic, notificationChannelData.message);
                break;
            case 'Slack':
                notificationChannel = new SlackChannel(notificationChannelData.channel, notificationChannelData.message);
                break;
            default:
                throw new Error('Invalid notification channel type');
        }
        
        if (result != undefined && result instanceof Success && result.data) {
            res.status(200).json({ message: 'Notification dispatched successfully' });
        } else {
            res.status(500).json({ message: 'Failed to dispatch notification' });
        }
    }
    catch (error) {
        next(error);
    }
}