import { RouteObject } from 'react-router'
import { hasPathPermission } from '@/util/auth'

export const getRedirectUrl = (path: string, redirectUrl: string): string => {
    return `${path}?redirect=${encodeURIComponent(redirectUrl)}`
}

export const getFullTitle = (data: _DataNode, preTitle?: string) => {
    data.fullTitle = `${preTitle ? `${preTitle}-` : ''}${data.title as string}`
    data.children &&
        data.children.forEach((value) => {
            getFullTitle(value, data.fullTitle)
        })

    return data
}

export const getAuthRoute = (
    route: RouteJsonObject[],
    parentPermission: boolean = false
): RouteJsonObject[] => {
    return route
        .filter(
            (value) =>
                !(value.permission || parentPermission) || hasPathPermission(value.absolutePath)
        )
        .map((value) => {
            if (value.children) {
                value.children = getAuthRoute(value.children, parentPermission || value.permission)
            }
            return value
        })
}

export const mapJsonToRoute = (jsonObject: RouteJsonObject[]): RouteObject[] => {
    return jsonObject.map((value) => ({
        path: value.path,
        id: value.id,
        element: value.element,
        Component: value.component,
        handle: {
            absolutePath: value.absolutePath,
            name: value.name,
            titlePrefix: value.titlePrefix,
            title: value.title,
            titlePostfix: value.titlePostfix,
            icon: value.icon,
            menu: value.menu,
            auth: value.auth,
            permission: value.permission,
            autoHide: value.autoHide
        },
        children: value.children && mapJsonToRoute(value.children)
    }))
}

export const setTitle = (jsonObject: RouteJsonObject[], title: string): RouteJsonObject[] => {
    return jsonObject.map((value) => {
        if (!value.title) {
            value.title = title
        }
        value.children && setTitle(value.children, title)

        return value
    })
}
