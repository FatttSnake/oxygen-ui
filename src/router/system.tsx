import React from 'react'

const user: RouteJsonObject[] = [
    {
        path: '',
        absolutePath: '/system',
        id: 'system',
        name: '系统设置',
        icon: React.lazy(() => import('~icons/fatweb/setting.jsx')),
        menu: true
    },
    {
        path: '*',
        absolutePath: '*',
        element: <Navigate to="/system" replace />
    }
]

export default user
