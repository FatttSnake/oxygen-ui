import React from 'react'
import tools from '@/router/tools'
import home from '@/router/home'

const root: RouteJsonObject[] = [
    {
        path: '/',
        component: React.lazy(() => import('@/AuthRoute')),
        children: [
            {
                path: '/login',
                id: 'login',
                component: React.lazy(() => import('@/pages/Login'))
            },
            {
                path: '/loading',
                id: 'loading',
                component: React.lazy(() => import('@/components/common/LoadingMask'))
            },
            {
                path: '/tools',
                id: 'toolsFramework',
                component: React.lazy(() => import('@/pages/ToolsFramework')),
                children: tools,
                name: '工具',
                title: '工具',
                auth: false
            },
            {
                path: '',
                id: 'homeFramework',
                component: React.lazy(() => import('@/pages/HomeFramework')),
                children: home
            },
            {
                path: '*',
                element: <Navigate to="/" replace />
            }
        ]
    }
]

const mapJsonToRoute = (jsonObject: RouteJsonObject[]): RouteObject[] => {
    return jsonObject.map((value) => ({
        path: value.path,
        id: value.id,
        element: value.element,
        Component: value.component,
        handle: {
            name: value.name,
            titlePrefix: value.titlePrefix,
            title: value.title,
            titlePostfix: value.titlePostfix,
            icon: value.icon,
            menu: value.menu,
            auth: value.auth
        },
        children:
            value.children &&
            mapJsonToRoute(value.children).map((sub) => {
                const handle = sub.handle as RouteHandle
                if (!handle.title) {
                    handle.title = value.title
                }
                return sub
            })
    }))
}

const routes = mapJsonToRoute(root)

const router = createBrowserRouter(routes)
export default router
