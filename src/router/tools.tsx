import React from 'react'

const defaultTitle = '氮工具'

export const toolsJsonObjects: ToolsJsonObject[] = [
    {
        path: '',
        id: 'tools',
        component: React.lazy(() => import('@/pages/tools')),
        name: '主页',
        icon: React.lazy(() => import('~icons/fatweb/logo.jsx')),
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
