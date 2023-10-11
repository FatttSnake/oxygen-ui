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
                path: '/tools',
                id: 'toolsFramework',
                Component: React.lazy(() => import('@/pages/ToolsFramework')),
                children: [
                    {
                        path: '',
                        id: 'tools',
                        Component: React.lazy(() => import('@/pages/tools')),
                        handle: {
                            name: '全部工具',
                            menu: true,
                            auth: false
                        }
                    },
                    {
                        path: 'translation',
                        id: 'tools-translation',
                        Component: React.lazy(() => import('@/pages/tools/Translation')),
                        handle: {
                            name: '翻译',
                            menu: true,
                            auth: true
                        }
                    }
                ],
                handle: {
                    name: '工具',
                    title: '工具',
                    auth: false
                }
            },
            {
                path: '',
                id: 'homeFramework',
                Component: React.lazy(() => import('@/pages/HomeFramework')),
                children: [
                    {
                        path: '',
                        id: 'home',
                        Component: React.lazy(() => import('@/pages/home')),
                        handle: {
                            name: '主页',
                            menu: true,
                            auth: false
                        }
                    },
                    {
                        path: 'https://blog.fatweb.top',
                        id: 'url-blog',
                        handle: {
                            name: '博客',
                            menu: true
                        }
                    },
                    {
                        path: '/tools',
                        id: 'url-tools',
                        children: [
                            {
                                path: 'translation',
                                id: 'url-tools-translation',
                                handle: {
                                    name: '翻译',
                                    menu: true
                                }
                            }
                        ],
                        handle: {
                            name: '工具',
                            menu: true
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
