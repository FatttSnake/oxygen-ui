import React from 'react'
import tools from '@/router/tools'
import home from '@/router/home'
import user from '@/router/user.tsx'

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
        children: value.children && mapJsonToRoute(value.children)
    }))
}

const setTitle = (jsonObject: RouteJsonObject[], title: string): RouteJsonObject[] => {
    return jsonObject.map((value) => {
        if (!value.title) {
            value.title = title
        }
        value.children && setTitle(value.children, title)

        return value
    })
}

const root: RouteJsonObject[] = [
    {
        path: '/',
        component: React.lazy(() => import('@/AuthRoute')),
        children: [
            {
                path: 'login',
                absolutePath: '/login',
                id: 'login',
                component: React.lazy(() => import('@/pages/Login'))
            },
            {
                path: 'loading',
                absolutePath: '/loading',
                id: 'loading',
                component: React.lazy(() => import('@/components/common/LoadingMask'))
            },
            {
                path: 'tools',
                absolutePath: '/tools',
                id: 'toolsFramework',
                component: React.lazy(() => import('@/pages/ToolsFramework')),
                children: setTitle(tools, '氮工具'),
                name: '工具',
                auth: false
            },
            {
                path: 'user',
                absolutePath: '/user',
                id: 'userFramework',
                component: React.lazy(() => import('@/pages/UserFramework')),
                children: setTitle(user, '个人中心'),
                name: '个人中心',
                auth: true
            },
            {
                path: '',
                absolutePath: '/',
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

const routes = mapJsonToRoute(root)

const router = createBrowserRouter(routes)
export default router
