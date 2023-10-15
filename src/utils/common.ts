import { STORAGE_TOKEN_KEY, STORAGE_USER_INFO_KEY } from '@/constants/common.constants'

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

export const setLocalStorage = (name: string, value: string) => {
    localStorage.setItem(name, value)
}

export const setToken = (token: string) => {
    setLocalStorage(STORAGE_TOKEN_KEY, token)
}

export const getCookie = (name: string) => {
    const cookieArr = document.cookie.split(';')

    for (const cookie of cookieArr) {
        const cookiePair = cookie.split('=')
        if (cookiePair[0].trim() === name) {
            return decodeURIComponent(cookiePair[1])
        }
    }

    return null
}

export const getLocalStorage = (name: string) => {
    return localStorage.getItem(name)
}

export const getToken = () => {
    return getLocalStorage(STORAGE_TOKEN_KEY)
}

export const removeCookie = (name: string) => {
    document.cookie = `${name}=; max-age=0`
}

export const removeLocalStorage = (name: string) => {
    localStorage.removeItem(name)
}

export const removeToken = () => {
    removeLocalStorage(STORAGE_USER_INFO_KEY)
    removeLocalStorage(STORAGE_TOKEN_KEY)
}

export const clearLocalStorage = () => {
    localStorage.clear()
}

export const getCaptcha = (width: number, high: number, num: number) => {
    const CHARTS = '23456789ABCDEFGHJKLMNPRSTUVWXYZabcdefghijklmnpqrstuvwxyz'.split('')

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D

    ctx.rect(0, 0, width, high)
    ctx.clip()

    ctx.fillStyle = randomColor(200, 250)
    ctx.fillRect(0, 0, width, high)

    for (let i = 0.05 * width * high; i > 0; i--) {
        ctx.fillStyle = randomColor(0, 256)
        ctx.fillRect(randomInt(0, width), randomInt(0, high), 1, 1)
    }

    ctx.font = `${high - 4}px Consolas`
    ctx.fillStyle = randomColor(160, 200)
    let value = ''
    for (let i = 0; i < num; i++) {
        const x = ((width - 10) / num) * i + 5
        const y = high - 12
        const r = Math.PI * randomFloat(-0.12, 0.12)
        const ch = CHARTS[randomInt(0, CHARTS.length)]
        value += ch
        ctx.translate(x, y)
        ctx.rotate(r)
        ctx.fillText(ch, 0, 0)
        ctx.rotate(-r)
        ctx.translate(-x, -y)
    }

    const base64Src = canvas.toDataURL('image/jpg')
    return {
        value,
        base64Src
    }
}

const randomInt = (start: number, end: number) => {
    if (start > end) {
        const t = start
        start = end
        end = t
    }
    start = Math.ceil(start)
    end = Math.floor(end)
    return start + Math.floor(Math.random() * (end - start))
}

const randomFloat = (start: number, end: number) => {
    return start + Math.random() * (end - start)
}

const randomColor = (start: number, end: number) => {
    return `rgb(${randomInt(start, end)},${randomInt(start, end)},${randomInt(start, end)})`
}

export const getRedirectUrl = (path: string, redirectUrl: string): string => {
    return `${path}?redirect=${encodeURIComponent(redirectUrl)}`
}
