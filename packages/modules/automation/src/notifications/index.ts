export {
  countUnreadNotifications,
  listNotificationsForUser,
  markNotificationRead,
  notifyOpsManagers,
  notifyUser,
  type MarkNotificationReadResult,
} from './service';
export { getEmailAdapter, noopEmailAdapter, createResendEmailAdapter } from './email';
export type {
  EmailAdapter,
  EmailMessage,
  EmailSendResult,
  NotificationRecord,
  NotifyUserInput,
} from './types';
