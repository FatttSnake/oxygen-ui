import React from 'react'

const routes: RouteObject[] = [
    {
        path: '/',
        Component: React.lazy(() => import('@/AuthRoute')),
        children: [
            {
                path: '/login',
                id: 'login',
                Component: React.lazy(() => import('@/pages/Login'))
            },
            {
                path: '',
                id: 'manager',
                Component: React.lazy(() => import('@/pages/Home')),
                children: [
                    {
                        id: 'manager-sub',
                        path: 'sub',
                        Component: React.lazy(() => import('@/pages/Home'))
                    }
                ],
                handle: {
                    auth: false
                }
            },
            {
                path: '*',
                element: <Navigate to="/" replace />
            }
        ]
    }
]

const router = createBrowserRouter(routes)
export default router
