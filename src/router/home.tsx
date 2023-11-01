import React from 'react'

const home: RouteJsonObject[] = [
    {
        path: '',
        absolutePath: '/',
        id: 'home',
        component: React.lazy(() => import('@/pages/home')),
        name: '主页',
        menu: true,
        auth: false
    },
    {
        path: 'https://blog.fatweb.top',
        absolutePath: 'https://blog.fatweb.top',
        id: 'url-blog',
        name: '博客',
        menu: true
    },
    {
        path: '/tools',
        absolutePath: '/tools',
        id: 'url-tools',
        children: [
            {
                path: 'translation',
                absolutePath: '/tools/translation',
                id: 'url-tools-translation',
                name: '翻译',
                menu: true
            }
        ],
        name: '工具',
        menu: true
    }
]

export default home
