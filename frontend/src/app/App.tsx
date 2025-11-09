import React from "react";
import { RouterProvider } from "react-router-dom";

import { AuthProvider } from "./providers/AuthProvider";
import NotificationProvider from "./providers/NotificationProvider";
import { router } from "./router";

const App: React.FC = () => {
  return (
    <NotificationProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </NotificationProvider>
  );
};

export default App;
