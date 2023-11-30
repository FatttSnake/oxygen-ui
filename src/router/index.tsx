import React from 'react'
import _ from 'lodash'
import system from '@/router/system'
import home from '@/router/home'
import user from '@/router/user'
import tools from '@/router/tools'
import { getAuthRoute, mapJsonToRoute, setTitle } from '@/util/route'

const root: RouteJsonObject[] = [
    {
        path: '/',
        absolutePath: '/',
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
                path: 'system',
                absolutePath: '/system',
                id: 'systemFramework',
                component: React.lazy(() => import('@/pages/SystemFramework')),
                children: setTitle(system, '系统设置'),
                name: '系统设置',
                auth: true,
                permission: true
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
                absolutePath: '*',
                element: <Navigate to="/" replace />
            }
        ]
    }
]

export const getRouter = () => createBrowserRouter(mapJsonToRoute(getAuthRoute(_.cloneDeep(root))))
