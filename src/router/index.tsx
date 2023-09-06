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
                path: '/loading',
                id: 'loading',
                Component: React.lazy(() => import('@/components/LoadingMask'))
            },
            {
                path: '',
                id: 'mainFramework',
                Component: React.lazy(() => import('@/pages/MainFramework')),
                children: [
                    {
                        path: '',
                        id: 'home',
                        Component: React.lazy(() => import('@/components/Home')),
                        handle: {
                            auth: false
                        }
                    },
                    {
                        path: 'project',
                        id: 'project',
                        Component: React.lazy(() => import('@/components/Project')),
                        handle: {
                            auth: false
                        }
                    }
                ]
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
