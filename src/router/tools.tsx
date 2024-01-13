export const tools: RouteJsonObject[] = [
    {
        path: '',
        absolutePath: '/',
        id: 'tools',
        component: lazy(() => import('@/pages/Tools')),
        name: '主页',
        icon: lazy(() => import('~icons/oxygen/home')),
        menu: true,
        auth: false
    },
    {
        path: 'all',
        absolutePath: '/all',
        id: 'tools-all',
        component: lazy(() => import('@/pages/Tools')),
        name: '全部工具',
        titlePostfix: ' - 全部工具',
        icon: lazy(() => import('~icons/oxygen/tool')),
        menu: true,
        auth: false
    },
    {
        path: 'translation',
        absolutePath: '/translation',
        id: 'tools-translation',
        component: lazy(() => import('@/pages/Tools/Translation')),
        name: '翻译',
        icon: lazy(() => import('~icons/oxygen/jenkins')),
        menu: true,
        auth: false,
        children: [
            {
                path: '1',
                absolutePath: '/translation/1',
                id: '1',
                name: '翻译1',
                icon: lazy(() => import('~icons/oxygen/logo')),
                menu: true,
                auth: false
            },
            {
                path: '2',
                absolutePath: '/translation/2',
                id: '2',
                name: '翻译2',
                menu: true,
                auth: false
            }
        ]
    },
    {
        path: 'translation-',
        absolutePath: '/translation-',
        id: 'tools-translation-',
        component: lazy(() => import('@/pages/Tools/Translation')),
        name: '翻译-',
        icon: lazy(() => import('~icons/oxygen/jenkins')),
        menu: true,
        auth: false,
        children: [
            {
                path: '1-',
                absolutePath: '/translation-/1-',
                id: '1-',
                name: '翻译1-',
                menu: true,
                auth: false
            },
            {
                path: '2-',
                absolutePath: '/translation-/2-',
                id: '2-',
                name: '翻译2-',
                menu: true,
                auth: false
            }
        ]
    },
    {
        path: 'translation--',
        absolutePath: '/translation--',
        id: 'tools-translation--',
        component: lazy(() => import('@/pages/Tools/Translation')),
        name: '翻译--',
        icon: lazy(() => import('~icons/oxygen/jenkins')),
        menu: true,
        auth: false
    },
    {
        path: 'translation--1',
        absolutePath: '/translation--1',
        id: 'tools-translation--1',
        component: lazy(() => import('@/pages/Tools/Translation')),
        name: '翻译--1',
        icon: lazy(() => import('~icons/oxygen/jenkins')),
        menu: true,
        auth: false
    },
    {
        path: 'translation--2',
        absolutePath: '/translation--2',
        id: 'tools-translation--2',
        component: lazy(() => import('@/pages/Tools/Translation')),
        name: '翻译--2',
        icon: lazy(() => import('~icons/oxygen/jenkins')),
        menu: true,
        auth: false
    },
    {
        path: 'translation--3',
        absolutePath: '/translation--3',
        id: 'tools-translation--3',
        component: lazy(() => import('@/pages/Tools/Translation')),
        name: '翻译--3',
        icon: lazy(() => import('~icons/oxygen/jenkins')),
        menu: true,
        auth: false
    },
    {
        path: 'translation--4',
        absolutePath: '/translation--4',
        id: 'tools-translation--4',
        component: lazy(() => import('@/pages/Tools/Translation')),
        name: '翻译--4',
        icon: lazy(() => import('~icons/oxygen/jenkins')),
        menu: true,
        auth: false
    },
    {
        path: 'translation--5',
        absolutePath: '/translation--5',
        id: 'tools-translation--5',
        component: lazy(() => import('@/pages/Tools/Translation')),
        name: '翻译--5',
        icon: lazy(() => import('~icons/oxygen/jenkins')),
        menu: true,
        auth: false
    },
    {
        path: 'translation--6',
        absolutePath: '/translation--6',
        id: 'tools-translation--6',
        component: lazy(() => import('@/pages/Tools/Translation')),
        name: '翻译--6',
        icon: lazy(() => import('~icons/oxygen/jenkins')),
        menu: true,
        auth: false
    },
    {
        path: 'translation--7',
        absolutePath: '/translation--7',
        id: 'tools-translation--7',
        component: lazy(() => import('@/pages/Tools/Translation')),
        name: '翻译--7',
        icon: lazy(() => import('~icons/oxygen/jenkins')),
        menu: true,
        auth: false
    },
    {
        path: 'translation--8',
        absolutePath: '/translation--8',
        id: 'tools-translation--8',
        component: lazy(() => import('@/pages/Tools/Translation')),
        name: '翻译--8',
        icon: lazy(() => import('~icons/oxygen/jenkins')),
        menu: true,
        auth: false
    },
    {
        path: 'translation--9',
        absolutePath: '/translation--9',
        id: 'tools-translation--9',
        component: lazy(() => import('@/pages/Tools/Translation')),
        name: '翻译--9',
        icon: lazy(() => import('~icons/oxygen/jenkins')),
        menu: true,
        auth: false
    },
    {
        path: 'translation--10',
        absolutePath: '/translation--10',
        id: 'tools-translation--10',
        component: lazy(() => import('@/pages/Tools/Translation')),
        name: '翻译--10',
        icon: lazy(() => import('~icons/oxygen/jenkins')),
        menu: true,
        auth: false
    },
    {
        path: 'translation--1-',
        absolutePath: '/translation--1-',
        id: 'tools-translation--1-',
        component: lazy(() => import('@/pages/Tools/Translation')),
        name: '翻译--1-',
        icon: lazy(() => import('~icons/oxygen/jenkins')),
        menu: true,
        auth: false
    },
    {
        path: 'translation--2-',
        absolutePath: '/translation--2-',
        id: 'tools-translation--2-',
        component: lazy(() => import('@/pages/Tools/Translation')),
        name: '翻译--2-',
        icon: lazy(() => import('~icons/oxygen/jenkins')),
        menu: true,
        auth: false
    },
    {
        path: 'translation--3-',
        absolutePath: '/translation--3-',
        id: 'tools-translation--3-',
        component: lazy(() => import('@/pages/Tools/Translation')),
        name: '翻译--3-',
        icon: lazy(() => import('~icons/oxygen/jenkins')),
        menu: true,
        auth: false
    },
    {
        path: 'translation--4-',
        absolutePath: '/translation--4-',
        id: 'tools-translation--4-',
        component: lazy(() => import('@/pages/Tools/Translation')),
        name: '翻译--4-',
        icon: lazy(() => import('~icons/oxygen/jenkins')),
        menu: true,
        auth: false
    },
    {
        path: 'translation--5-',
        absolutePath: '/translation--5-',
        id: 'tools-translation--5-',
        component: lazy(() => import('@/pages/Tools/Translation')),
        name: '翻译--5-',
        icon: lazy(() => import('~icons/oxygen/jenkins')),
        menu: true,
        auth: false
    },
    {
        path: 'translation--6-',
        absolutePath: '/translation--6-',
        id: 'tools-translation--6-',
        component: lazy(() => import('@/pages/Tools/Translation')),
        name: '翻译--6-',
        icon: lazy(() => import('~icons/oxygen/jenkins')),
        menu: true,
        auth: false
    },
    {
        path: 'translation--7-',
        absolutePath: '/translation--7-',
        id: 'tools-translation--7-',
        component: lazy(() => import('@/pages/Tools/Translation')),
        name: '翻译--7-',
        icon: lazy(() => import('~icons/oxygen/jenkins')),
        menu: true,
        auth: false
    },
    {
        path: 'translation--8-',
        absolutePath: '/translation--8-',
        id: 'tools-translation--8-',
        component: lazy(() => import('@/pages/Tools/Translation')),
        name: '翻译--8-',
        icon: lazy(() => import('~icons/oxygen/jenkins')),
        menu: true,
        auth: false
    },
    {
        path: 'translation--9-',
        absolutePath: '/translation--9-',
        id: 'tools-translation--9-',
        component: lazy(() => import('@/pages/Tools/Translation')),
        name: '翻译--9-',
        icon: lazy(() => import('~icons/oxygen/jenkins')),
        menu: true,
        auth: false
    },
    {
        path: 'translation--10-',
        absolutePath: '/translation--10-',
        id: 'tools-translation--10-',
        component: lazy(() => import('@/pages/Tools/Translation')),
        name: '翻译--10-',
        icon: lazy(() => import('~icons/oxygen/jenkins')),
        menu: true,
        auth: false,
        children: [
            {
                path: '1-1',
                absolutePath: '/translation--10-/1-1',
                id: '1-1',
                name: '翻译1-',
                menu: true,
                auth: false
            },
            {
                path: '2-1',
                absolutePath: '/translation--10-/2-1',
                id: '2-1',
                name: '翻译2-',
                menu: true,
                auth: false
            }
        ]
    },
    {
        path: '*',
        absolutePath: '*',
        element: <Navigate to="/" replace />
    }
]

export default tools
