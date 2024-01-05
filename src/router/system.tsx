import React from 'react'
import { getAuthRoute } from '@/util/route'

const system: RouteJsonObject[] = [
    {
        path: '',
        absolutePath: '/system',
        id: 'system',
        component: React.lazy(() => import('src/pages/system_')),
        name: '系统管理',
        icon: React.lazy(() => import('~icons/oxygen/setting.jsx')),
        menu: true
    },
    {
        path: 'statistics',
        absolutePath: '/system/statistics',
        id: 'system-statistics',
        component: React.lazy(() => import('@/pages/system_/statistics_')),
        name: '系统概况',
        icon: React.lazy(() => import('~icons/oxygen/chart.jsx')),
        menu: true,
        autoHide: true
    },
    {
        path: 'settings',
        absolutePath: '/system/settings',
        id: 'system-settings',
        component: React.lazy(() => import('@/pages/system_/settings_')),
        name: '系统设置',
        icon: React.lazy(() => import('~icons/oxygen/option.jsx')),
        menu: true,
        autoHide: true
    },
    {
        path: 'user',
        absolutePath: '/system/user',
        id: 'system-user',
        component: React.lazy(() => import('@/pages/system_/User')),
        name: '用户管理',
        icon: React.lazy(() => import('~icons/oxygen/user.jsx')),
        menu: true,
        autoHide: true
    },
    {
        path: 'role',
        absolutePath: '/system/role',
        id: 'system-role',
        component: React.lazy(() => import('@/pages/system_/Role')),
        name: '角色管理',
        icon: React.lazy(() => import('~icons/oxygen/role.jsx')),
        menu: true,
        autoHide: true
    },
    {
        path: 'group',
        absolutePath: '/system/group',
        id: 'system-group',
        component: React.lazy(() => import('@/pages/system_/Group')),
        name: '群组管理',
        icon: React.lazy(() => import('~icons/oxygen/group.jsx')),
        menu: true,
        autoHide: true
    },
    {
        path: 'log',
        absolutePath: '/system/log',
        id: 'system-log',
        component: React.lazy(() => import('@/pages/system_/Log')),
        name: '系统日志',
        icon: React.lazy(() => import('~icons/oxygen/log.jsx')),
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
