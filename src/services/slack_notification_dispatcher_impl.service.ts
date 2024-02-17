import { BaseChannel } from "../models/channel.model";
import { Notification } from "../models/notification.model";
import { NotificationDispatcherService } from "./notification_dispatcher.service";
class SlackNotificationDispatcherImplementation implements NotificationDispatcherService{
    dispatch(notificationChannel: BaseChannel, notification: Notification): Promise <Result<Boolean> >{
        throw new Error("Method not implemented.");
    }
}