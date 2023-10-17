import React from 'react'

const user: RouteJsonObject[] = [
    {
        path: '',
        id: 'user',
        name: '个人档案',
        icon: React.lazy(() => import('~icons/fatweb/user.jsx')),
        menu: true
    },
    {
        path: '*',
        element: <Navigate to="/user" replace />
    }
]

export default user
