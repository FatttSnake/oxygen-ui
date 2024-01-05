import React from 'react'

const user: RouteJsonObject[] = [
    {
        path: '',
        absolutePath: '/user',
        id: 'user',
        component: React.lazy(() => import('src/pages/user_')),
        name: '个人档案',
        icon: React.lazy(() => import('~icons/oxygen/user.jsx')),
        menu: true
    },
    {
        path: '*',
        absolutePath: '*',
        element: <Navigate to="/user" replace />
    }
]

export default user
