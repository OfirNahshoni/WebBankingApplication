import { notification } from "antd";

const baseOptions = {
  placement: "top" as const,
  className: "app-notification",
  duration: 3,
};

export function notifySuccess(message: string, description?: string) {
  notification.success({ ...baseOptions, message, description });
}

export function notifyError(message: string, description?: string) {
  notification.error({ ...baseOptions, message, description, duration: 4 });
}

export function notifyWarning(message: string, description?: string) {
  notification.warning({ ...baseOptions, message, description });
}

export function notifyInfo(message: string, description?: string) {
  notification.info({ ...baseOptions, message, description });
}
