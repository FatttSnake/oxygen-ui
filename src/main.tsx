import React from 'react'
import ReactDOM from 'react-dom/client'
import zh_CN from 'antd/locale/zh_CN'
import '@/assets/css/base.scss'
import '@/assets/css/common.scss'
import App from './App'
import { COLOR_MAIN } from '@/constants/common.constants'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <AntdConfigProvider
            theme={{ token: { colorPrimary: COLOR_MAIN, colorBgContainer: 'transparent' } }}
            locale={zh_CN}
        >
            <App />
        </AntdConfigProvider>
    </React.StrictMode>
)
