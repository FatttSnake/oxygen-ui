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
