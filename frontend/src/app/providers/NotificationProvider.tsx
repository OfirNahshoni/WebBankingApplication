import React, { useEffect } from "react";
import { notification } from "antd";

import { registerNotificationApi } from "../../lib/notify";

const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    registerNotificationApi(api);
  }, [api]);

  return (
    <>
      {contextHolder}
      {children}
    </>
  );
};

export default NotificationProvider;
