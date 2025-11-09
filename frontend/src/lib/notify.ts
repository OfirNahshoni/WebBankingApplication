import { notification } from "antd";
import type { NotificationInstance } from "antd/es/notification/interface";

const baseOptions = {
  placement: "top" as const,
  className: "app-notification",
  duration: 3,
};

let notificationApi: NotificationInstance | null = null;

export function registerNotificationApi(instance: NotificationInstance) {
  notificationApi = instance;
}

function getApi(): NotificationInstance {
  return notificationApi ?? notification;
}

export function notifySuccess(message: string, description?: string) {
  getApi().success({ ...baseOptions, message, description });
}

export function notifyError(message: string, description?: string) {
  getApi().error({ ...baseOptions, message, description, duration: 4 });
}

export function notifyWarning(message: string, description?: string) {
  getApi().warning({ ...baseOptions, message, description });
}

export function notifyInfo(message: string, description?: string) {
  getApi().info({ ...baseOptions, message, description });
}
