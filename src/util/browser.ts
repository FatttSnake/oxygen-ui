export const getQueryVariable = (variable: string) => {
    const query = window.location.search.substring(1)
    const vars = query.split('&')
    for (const value of vars) {
        const pair = value.split('=')
        if (pair[0] === variable) {
            return decodeURIComponent(pair[1].replace(/\+/g, ' '))
        }
    }
    return null
}

export const setCookie = (
    name: string,
    value: string,
    daysToLive: number | null,
    path: string | null
) => {
    let cookie = `${name}=${encodeURIComponent(value)}`

    if (typeof daysToLive === 'number') {
        cookie = `${cookie}; max-age=${daysToLive * 24 * 60 * 60}`
    }

    if (typeof path === 'string') {
        cookie = `${cookie}; path=${path}`
    }

    document.cookie = cookie
}

export const getCookie = (name: string) => {
    const cookies = document.cookie.split(';')

    return parseCookie(cookies, name)
}

export const parseCookie = (cookies: string[] | undefined, name: string) => {
    if (!cookies) return null
    const target = cookies.find((c) => c.startsWith(`${name}=`))
    return target ? decodeURIComponent(target.split(';')[0].split('=')[1]) : null
}

export const removeCookie = (name: string) => {
    document.cookie = `${name}=; max-age=0`
}

export const setLocalStorage = (name: string, value: string) => {
    localStorage.setItem(name, value)
    window.dispatchEvent(new Event('localStorageChange'))
}

export const getLocalStorage = (name: string) => {
    return localStorage.getItem(name)
}

export const removeLocalStorage = (name: string) => {
    localStorage.removeItem(name)
}

export const clearLocalStorage = () => {
    localStorage.clear()
}
