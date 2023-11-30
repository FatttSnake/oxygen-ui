import React from 'react'

const system: RouteJsonObject[] = [
    {
        path: '',
        absolutePath: '/system',
        id: 'system',
        component: React.lazy(() => import('@/pages/system')),
        name: '系统设置',
        icon: React.lazy(() => import('~icons/fatweb/setting.jsx')),
        menu: true
    },
    {
        path: 'user',
        absolutePath: '/system/user',
        id: 'system-user',
        component: React.lazy(() => import('@/pages/system/User')),
        name: '用户管理',
        icon: React.lazy(() => import('~icons/fatweb/user.jsx')),
        menu: true,
        permission: true,
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
        permission: true,
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
        permission: true,
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
        permission: true,
        autoHide: true
    },
    {
        path: '*',
        absolutePath: '*',
        element: <Navigate to="/system" replace />
    }
]

export default system
