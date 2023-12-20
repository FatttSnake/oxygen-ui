import React from 'react'
import { getAuthRoute } from '@/util/route'

const system: RouteJsonObject[] = [
    {
        path: '',
        absolutePath: '/system',
        id: 'system',
        component: React.lazy(() => import('@/pages/system')),
        name: '系统管理',
        icon: React.lazy(() => import('~icons/fatweb/setting.jsx')),
        menu: true
    },
    {
        path: 'statistics',
        absolutePath: '/system/statistics',
        id: 'system-statistics',
        component: React.lazy(() => import('@/pages/system/Statistics')),
        name: '系统概况',
        icon: React.lazy(() => import('~icons/fatweb/chart.jsx')),
        menu: true,
        autoHide: true
    },
    {
        path: 'settings',
        absolutePath: '/system/settings',
        id: 'system-settings',
        component: React.lazy(() => import('@/pages/system/Settings')),
        name: '系统设置',
        icon: React.lazy(() => import('~icons/fatweb/option.jsx')),
        menu: true,
        autoHide: true
    },
    {
        path: 'user',
        absolutePath: '/system/user',
        id: 'system-user',
        component: React.lazy(() => import('@/pages/system/User')),
        name: '用户管理',
        icon: React.lazy(() => import('~icons/fatweb/user.jsx')),
        menu: true,
        autoHide: true
    },
    {
        path: 'role',
        absolutePath: '/system/role',
        id: 'system-role',
        component: React.lazy(() => import('@/pages/system/Role')),
        name: '角色管理',
        icon: React.lazy(() => import('~icons/fatweb/role.jsx')),
        menu: true,
        autoHide: true
    },
    {
        path: 'group',
        absolutePath: '/system/group',
        id: 'system-group',
        component: React.lazy(() => import('@/pages/system/Group')),
        name: '群组管理',
        icon: React.lazy(() => import('~icons/fatweb/group.jsx')),
        menu: true,
        autoHide: true
    },
    {
        path: 'log',
        absolutePath: '/system/log',
        id: 'system-log',
        component: React.lazy(() => import('@/pages/system/Log')),
        name: '系统日志',
        icon: React.lazy(() => import('~icons/fatweb/log.jsx')),
        menu: true,
        autoHide: true
    },
    {
        path: '*',
        absolutePath: '*',
        element: <Navigate to="/system" replace />
    }
]

export const getSystemRouteJson = () => getAuthRoute(system, true)

export default system
