import React from 'react'

const user: RouteJsonObject[] = [
    {
        path: '',
        absolutePath: '/user',
        id: 'user',
        component: React.lazy(() => import('@/pages/User')),
        name: '个人档案',
        icon: React.lazy(() => import('~icons/oxygen/user')),
        menu: true
    },
    {
        path: '*',
        absolutePath: '*',
        element: <Navigate to="/user" replace />
    }
]

export default user
