import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import '@/assets/css/base.css'
import '@/assets/css/common.css'
import zh_CN from 'antd/locale/zh_CN'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <AntdConfigProvider locale={zh_CN}>
            <App />
        </AntdConfigProvider>
    </React.StrictMode>
)
