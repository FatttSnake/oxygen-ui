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
                Component: React.lazy(() => import('@/components/common/LoadingMask'))
            },
            {
                path: '',
                id: 'mainFramework',
                Component: React.lazy(() => import('@/pages/MainFramework')),
                children: [
                    {
                        path: '',
                        id: 'home',
                        Component: React.lazy(() => import('@/pages/Home')),
                        handle: {
                            name: '主页',
                            menu: true,
                            auth: false
                        }
                    },
                    {
                        path: 'https://blog.fatweb.top',
                        id: 'blog',
                        handle: {
                            name: '博客',
                            menu: true,
                            auth: false
                        }
                    },
                    {
                        path: 'tools',
                        id: 'tools',
                        Component: React.lazy(() => import('@/pages/Tools')),
                        children: [
                            {
                                path: 'translation',
                                id: 'tools-translation',
                                Component: React.lazy(() => import('@/pages/tools/Translation')),
                                handle: {
                                    name: '翻译',
                                    menu: true,
                                    auth: false
                                }
                            }
                        ],
                        handle: {
                            name: '工具',
                            menu: true,
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
