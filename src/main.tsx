import React from 'react'
import ReactDOM from 'react-dom/client'
import zh_CN from 'antd/locale/zh_CN'
import '@/assets/css/base.scss'
import '@/assets/css/common.scss'
import App from './App'
import { COLOR_MAIN } from '@/constants/common.constants.ts'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <AntdConfigProvider theme={{ token: { colorPrimary: COLOR_MAIN } }} locale={zh_CN}>
            <App />
        </AntdConfigProvider>
    </React.StrictMode>
)
