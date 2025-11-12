import { NavigateFunction, NavigateOptions } from 'react-router'
import { getRedirectUrl } from '@/util/route'

export const navigateToRoot = (navigate: NavigateFunction, options?: NavigateOptions) => {
    navigate('/', options)
}

export const navigateToStore = (
    navigate: NavigateFunction,
    username?: string,
    options?: NavigateOptions
) => {
    navigate(`/store${username ? `/${username}` : ''}`, options)
}

export const navigateToRepository = (navigate: NavigateFunction, options?: NavigateOptions) => {
    navigate('/repository', options)
}

export const navigateToLogin = (
    navigate: NavigateFunction,
    locationSearch?: string,
    redirectUrl?: string,
    options?: NavigateOptions
) => {
    navigate(
        redirectUrl ? getRedirectUrl('/login', redirectUrl) : `/login${locationSearch}`,
        options
    )
}

export const navigateToView = (
    navigate: NavigateFunction,
    username: string,
    toolId: string,
    platform: Platform,
    version?: string,
    options?: NavigateOptions
) => {
    const searchParams = new URLSearchParams()
    if (platform !== import.meta.env.VITE_PLATFORM) {
        searchParams.append('platform', platform)
    }

    navigate(
        `/view/${username}/${toolId}${version ? `/${version}` : ''}${searchParams.size ? `?${searchParams.toString()}` : ''}`,
        options
    )
}

export const navigateToSource = (
    navigate: NavigateFunction,
    username: string,
    toolId: string,
    platform: Platform,
    version?: string,
    from?: string,
    options?: NavigateOptions
) => {
    const searchParams = new URLSearchParams()
    if (platform !== import.meta.env.VITE_PLATFORM) {
        searchParams.append('platform', platform)
    }
    from && searchParams.append('from', from)

    navigate(
        `/source/${username}/${toolId}${version ? `/${version}` : ''}${searchParams.size ? `?${searchParams.toString()}` : ''}`,
        options
    )
}

export const navigateToRedirect = (
    navigate: NavigateFunction,
    searchParams: URLSearchParams,
    defaultUrl: '/repository' | '/',
    options?: NavigateOptions
) => {
    navigate(searchParams.get('redirect') ?? defaultUrl, options)
}

export const navigateToForget = (
    navigate: NavigateFunction,
    locationSearch: string,
    options?: NavigateOptions
) => {
    navigate(`/forget/${locationSearch}`, options)
}

export const navigateToRegister = (
    navigate: NavigateFunction,
    locationSearch: string,
    options?: NavigateOptions
) => {
    navigate(`/register/${locationSearch}`, options)
}

export const navigateToExecute = (
    navigate: NavigateFunction,
    toolId: string,
    options?: NavigateOptions
) => {
    navigate(`/system/tools/execute/${toolId}`, options)
}

export const navigateToCode = (
    navigate: NavigateFunction,
    toolId: string,
    options?: NavigateOptions
) => {
    navigate(`/system/tools/code/${toolId}`, options)
}

export const navigateToEdit = (
    navigate: NavigateFunction,
    toolId: string,
    platform: Platform,
    options?: NavigateOptions
) => {
    const searchParams = new URLSearchParams()
    if (platform !== import.meta.env.VITE_PLATFORM) {
        searchParams.append('platform', platform)
    }

    navigate(`/edit/${toolId}${searchParams.size ? `?${searchParams.toString()}` : ''}`, options)
}

export const navigateToUser = (navigate: NavigateFunction, options?: NavigateOptions) => {
    navigate('/user', options)
}

export const navigateToTools = (navigate: NavigateFunction, options?: NavigateOptions) => {
    navigate('/system/tools', options)
}

export const navigateToToolTemplate = (navigate: NavigateFunction, options?: NavigateOptions) => {
    navigate(`/system/tools/template`, options)
}

export const navigateToToolTemplateEditor = (
    navigate: NavigateFunction,
    toolTemplateId: string,
    options?: NavigateOptions
) => {
    navigate(`/system/tools/template/${toolTemplateId}`, options)
}

export const navigateToToolBase = (navigate: NavigateFunction, options?: NavigateOptions) => {
    navigate(`/system/tools/base`, options)
}

export const navigateToToolBaseEditor = (
    navigate: NavigateFunction,
    toolBaseId: string,
    version?: string,
    options?: NavigateOptions
) => {
    navigate(`/system/tools/base/${toolBaseId}${version ? `/${version}` : ''}`, options)
}

export const navigateToApp = (username?: string, toolId?: string) => {
    window.open(
        username && toolId ? `/app?username=${username}&toolId=${toolId}` : '/app',
        '_blank'
    )
}

export const getViewPath = (
    username: string,
    toolId: string,
    platform: Platform,
    version?: string
) => {
    const searchParams = new URLSearchParams()
    if (platform !== import.meta.env.VITE_PLATFORM) {
        searchParams.append('platform', platform)
    }

    return `/view/${username}/${toolId}${version ? `/${version}` : ''}${searchParams.size ? `?${searchParams.toString()}` : ''}`
}

export const getAppUrl = (username: string, toolId: string) => {
    const url = new URL('/app', location.href)
    url.searchParams.set('username', username)
    url.searchParams.set('toolId', toolId)

    return url.href
}

export const checkIsSamePathname = (a: string, b: string) => {
    const aPathname = a.substring(0, a.indexOf('?') === -1 ? a.length : a.indexOf('?'))
    const bPathname = b.substring(0, b.indexOf('?') === -1 ? b.length : b.indexOf('?'))

    return aPathname === bPathname
}
