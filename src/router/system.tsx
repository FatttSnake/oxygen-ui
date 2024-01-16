import { getAuthRoute } from '@/util/route'

const system: RouteJsonObject[] = [
    {
        path: '',
        absolutePath: '/system',
        id: 'system',
        component: lazy(() => import('@/pages/System')),
        name: '系统管理',
        icon: lazy(() => import('~icons/oxygen/setting')),
        menu: true
    },
    {
        path: 'statistics',
        absolutePath: '/system/statistics',
        id: 'system-statistics',
        component: lazy(() => import('@/pages/System/Statistics')),
        name: '系统概况',
        icon: lazy(() => import('~icons/oxygen/chart')),
        menu: true,
        autoHide: true
    },
    {
        path: 'settings',
        absolutePath: '/system/settings',
        id: 'system-settings',
        component: lazy(() => import('@/pages/System/Settings')),
        name: '系统设置',
        icon: lazy(() => import('~icons/oxygen/option')),
        menu: true,
        autoHide: true
    },
    {
        path: 'tools',
        absolutePath: '/system/tools',
        id: 'system-tools',
        component: lazy(() => import('@/pages/System/Tools')),
        name: '工具配置',
        icon: lazy(() => import('~icons/oxygen/tool')),
        menu: true,
        autoHide: true
    },
    {
        path: 'user',
        absolutePath: '/system/user',
        id: 'system-user',
        component: lazy(() => import('@/pages/System/User')),
        name: '用户管理',
        icon: lazy(() => import('~icons/oxygen/user')),
        menu: true,
        autoHide: true
    },
    {
        path: 'role',
        absolutePath: '/system/role',
        id: 'system-role',
        component: lazy(() => import('@/pages/System/Role')),
        name: '角色管理',
        icon: lazy(() => import('~icons/oxygen/role')),
        menu: true,
        autoHide: true
    },
    {
        path: 'group',
        absolutePath: '/system/group',
        id: 'system-group',
        component: lazy(() => import('@/pages/System/Group')),
        name: '群组管理',
        icon: lazy(() => import('~icons/oxygen/group')),
        menu: true,
        autoHide: true
    },
    {
        path: 'log',
        absolutePath: '/system/log',
        id: 'system-log',
        component: lazy(() => import('@/pages/System/Log')),
        name: '系统日志',
        icon: lazy(() => import('~icons/oxygen/log')),
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
