import React from 'react'

const user: RouteJsonObject[] = [
    {
        path: '',
        absolutePath: '/user',
        id: 'user',
        component: React.lazy(() => import('@/pages/user')),
        name: '个人档案',
        icon: React.lazy(() => import('~icons/fatweb/user.jsx')),
        menu: true
    },
    {
        path: '*',
        absolutePath: '*',
        element: <Navigate to="/user" replace />
    }
]

export default user
