import React from 'react'

const defaultTitle = '氮工具'

export const toolsJsonObjects: ToolsJsonObject[] = [
    {
        path: '',
        id: 'tools',
        component: React.lazy(() => import('@/pages/tools')),
        icon: React.lazy(() => import('~icons/fatweb/logo.jsx')),
        name: '主页',
        menu: true,
        auth: false
    },
    {
        path: 'all',
        id: 'tools-all',
        component: React.lazy(() => import('@/pages/tools')),
        name: '全部工具',
        titlePostfix: ' - 全部工具',
        icon: React.lazy(() => import('~icons/fatweb/logo.jsx')),
        menu: true,
        auth: false
    },
    {
        path: 'translation',
        id: 'tools-translation',
        component: React.lazy(() => import('@/pages/tools/Translation')),
        name: '翻译',
        icon: React.lazy(() => import('~icons/fatweb/jenkins.jsx')),
        menu: true,
        auth: false,
        children: [
            {
                path: '1',
                id: '1',
                name: '翻译1',
                icon: React.lazy(() => import('~icons/fatweb/logo.jsx')),
                menu: true,
                auth: false
            },
            {
                path: '2',
                id: '2',
                name: '翻译2',
                menu: true,
                auth: false
            }
        ]
    },
    {
        path: 'translation-',
        id: 'tools-translation-',
        component: React.lazy(() => import('@/pages/tools/Translation')),
        name: '翻译-',
        icon: React.lazy(() => import('~icons/fatweb/jenkins.jsx')),
        menu: true,
        auth: false,
        children: [
            {
                path: '1-',
                id: '1-',
                name: '翻译1-',
                menu: true,
                auth: false
            },
            {
                path: '2-',
                id: '2-',
                name: '翻译2-',
                menu: true,
                auth: false
            }
        ]
    },
    {
        path: 'translation--',
        id: 'tools-translation--',
        component: React.lazy(() => import('@/pages/tools/Translation')),
        name: '翻译--',
        icon: React.lazy(() => import('~icons/fatweb/jenkins.jsx')),
        menu: true,
        auth: false
    },
    {
        path: 'translation--1',
        id: 'tools-translation--1',
        component: React.lazy(() => import('@/pages/tools/Translation')),
        name: '翻译--1',
        icon: React.lazy(() => import('~icons/fatweb/jenkins.jsx')),
        menu: true,
        auth: false
    },
    {
        path: 'translation--2',
        id: 'tools-translation--2',
        component: React.lazy(() => import('@/pages/tools/Translation')),
        name: '翻译--2',
        icon: React.lazy(() => import('~icons/fatweb/jenkins.jsx')),
        menu: true,
        auth: false
    },
    {
        path: 'translation--3',
        id: 'tools-translation--3',
        component: React.lazy(() => import('@/pages/tools/Translation')),
        name: '翻译--3',
        icon: React.lazy(() => import('~icons/fatweb/jenkins.jsx')),
        menu: true,
        auth: false
    },
    {
        path: 'translation--4',
        id: 'tools-translation--4',
        component: React.lazy(() => import('@/pages/tools/Translation')),
        name: '翻译--4',
        icon: React.lazy(() => import('~icons/fatweb/jenkins.jsx')),
        menu: true,
        auth: false
    },
    {
        path: 'translation--5',
        id: 'tools-translation--5',
        component: React.lazy(() => import('@/pages/tools/Translation')),
        name: '翻译--5',
        icon: React.lazy(() => import('~icons/fatweb/jenkins.jsx')),
        menu: true,
        auth: false
    },
    {
        path: 'translation--6',
        id: 'tools-translation--6',
        component: React.lazy(() => import('@/pages/tools/Translation')),
        name: '翻译--6',
        icon: React.lazy(() => import('~icons/fatweb/jenkins.jsx')),
        menu: true,
        auth: false
    },
    {
        path: 'translation--7',
        id: 'tools-translation--7',
        component: React.lazy(() => import('@/pages/tools/Translation')),
        name: '翻译--7',
        icon: React.lazy(() => import('~icons/fatweb/jenkins.jsx')),
        menu: true,
        auth: false
    },
    {
        path: 'translation--8',
        id: 'tools-translation--8',
        component: React.lazy(() => import('@/pages/tools/Translation')),
        name: '翻译--8',
        icon: React.lazy(() => import('~icons/fatweb/jenkins.jsx')),
        menu: true,
        auth: false
    },
    {
        path: 'translation--9',
        id: 'tools-translation--9',
        component: React.lazy(() => import('@/pages/tools/Translation')),
        name: '翻译--9',
        icon: React.lazy(() => import('~icons/fatweb/jenkins.jsx')),
        menu: true,
        auth: false
    },
    {
        path: 'translation--10',
        id: 'tools-translation--10',
        component: React.lazy(() => import('@/pages/tools/Translation')),
        name: '翻译--10',
        icon: React.lazy(() => import('~icons/fatweb/jenkins.jsx')),
        menu: true,
        auth: false
    },
    {
        path: 'translation--1-',
        id: 'tools-translation--1-',
        component: React.lazy(() => import('@/pages/tools/Translation')),
        name: '翻译--1-',
        icon: React.lazy(() => import('~icons/fatweb/jenkins.jsx')),
        menu: true,
        auth: false
    },
    {
        path: 'translation--2-',
        id: 'tools-translation--2-',
        component: React.lazy(() => import('@/pages/tools/Translation')),
        name: '翻译--2-',
        icon: React.lazy(() => import('~icons/fatweb/jenkins.jsx')),
        menu: true,
        auth: false
    },
    {
        path: 'translation--3-',
        id: 'tools-translation--3-',
        component: React.lazy(() => import('@/pages/tools/Translation')),
        name: '翻译--3-',
        icon: React.lazy(() => import('~icons/fatweb/jenkins.jsx')),
        menu: true,
        auth: false
    },
    {
        path: 'translation--4-',
        id: 'tools-translation--4-',
        component: React.lazy(() => import('@/pages/tools/Translation')),
        name: '翻译--4-',
        icon: React.lazy(() => import('~icons/fatweb/jenkins.jsx')),
        menu: true,
        auth: false
    },
    {
        path: 'translation--5-',
        id: 'tools-translation--5-',
        component: React.lazy(() => import('@/pages/tools/Translation')),
        name: '翻译--5-',
        icon: React.lazy(() => import('~icons/fatweb/jenkins.jsx')),
        menu: true,
        auth: false
    },
    {
        path: 'translation--6-',
        id: 'tools-translation--6-',
        component: React.lazy(() => import('@/pages/tools/Translation')),
        name: '翻译--6-',
        icon: React.lazy(() => import('~icons/fatweb/jenkins.jsx')),
        menu: true,
        auth: false
    },
    {
        path: 'translation--7-',
        id: 'tools-translation--7-',
        component: React.lazy(() => import('@/pages/tools/Translation')),
        name: '翻译--7-',
        icon: React.lazy(() => import('~icons/fatweb/jenkins.jsx')),
        menu: true,
        auth: false
    },
    {
        path: 'translation--8-',
        id: 'tools-translation--8-',
        component: React.lazy(() => import('@/pages/tools/Translation')),
        name: '翻译--8-',
        icon: React.lazy(() => import('~icons/fatweb/jenkins.jsx')),
        menu: true,
        auth: false
    },
    {
        path: 'translation--9-',
        id: 'tools-translation--9-',
        component: React.lazy(() => import('@/pages/tools/Translation')),
        name: '翻译--9-',
        icon: React.lazy(() => import('~icons/fatweb/jenkins.jsx')),
        menu: true,
        auth: false
    },
    {
        path: 'translation--10-',
        id: 'tools-translation--10-',
        component: React.lazy(() => import('@/pages/tools/Translation')),
        name: '翻译--10-',
        icon: React.lazy(() => import('~icons/fatweb/jenkins.jsx')),
        menu: true,
        auth: false,
        children: [
            {
                path: '1-1',
                id: '1-1',
                name: '翻译1-',
                menu: true,
                auth: false
            },
            {
                path: '2-1',
                id: '2-1',
                name: '翻译2-',
                menu: true,
                auth: false
            }
        ]
    }
]

const tools: RouteObject[] = toolsJsonObjects.map((value) => ({
    path: value.path,
    id: value.id,
    Component: value.component,
    handle: {
        name: value.name,
        titlePrefix: value.titlePrefix,
        title: value.title ?? defaultTitle,
        titlePostfix: value.titlePostfix,
        icon: value.icon,
        menu: value.menu,
        auth: value.auth
    },
    children: value.children?.map((value) => ({
        path: value.path,
        id: value.id,
        Component: value.component,
        handle: {
            name: value.name,
            titlePrefix: value.titlePrefix,
            title: value.title ?? defaultTitle,
            titlePostfix: value.titlePostfix,
            icon: value.icon,
            menu: value.menu,
            auth: value.auth
        }
    }))
}))

export default tools
