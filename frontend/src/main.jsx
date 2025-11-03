import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { ConfigProvider } from 'antd'
import 'antd/dist/reset.css'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById("root")).render(
    <ConfigProvider>
        <App />
    </ConfigProvider>
);
