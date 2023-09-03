import { TOKEN_NAME } from '@/constants/Common.constants'

export function getQueryVariable(variable: string): string | null {
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

export function setCookie(
    name: string,
    value: string,
    daysToLive: number | null,
    path: string | null
): void {
    let cookie = name + '=' + encodeURIComponent(value)

    if (typeof daysToLive === 'number') {
        cookie = `${cookie}; max-age=${daysToLive * 24 * 60 * 60}`
    }

    if (typeof path === 'string') {
        cookie += '; path=' + path
    }

    document.cookie = cookie
}

export function setLocalStorage(name: string, value: string): void {
    localStorage.setItem(name, value)
}

export function setToken(token: string): void {
    setLocalStorage(TOKEN_NAME, token)
}

export function getCookie(name: string): string | null {
    const cookieArr = document.cookie.split(';')

    for (const cookie of cookieArr) {
        const cookiePair = cookie.split('=')
        if (cookiePair[0].trim() === name) {
            return decodeURIComponent(cookiePair[1])
        }
    }

    return null
}

export function getLocalStorage(name: string): string | null {
    return localStorage.getItem(name)
}

export function getToken(): string | null {
    return getLocalStorage(TOKEN_NAME)
}

export function removeCookie(name: string): void {
    document.cookie = name + '=; max-age=0'
}

export function removeLocalStorage(name: string): void {
    localStorage.removeItem(name)
}

export function removeToken(): void {
    removeLocalStorage(TOKEN_NAME)
}

export function clearLocalStorage(): void {
    localStorage.clear()
}

export function getCaptcha(width: number, high: number, num: number): Captcha {
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

function randomInt(start: number, end: number): number {
    if (start > end) {
        const t = start
        start = end
        end = t
    }
    start = Math.ceil(start)
    end = Math.floor(end)
    return start + Math.floor(Math.random() * (end - start))
}

function randomFloat(start: number, end: number): number {
    return start + Math.random() * (end - start)
}

function randomColor(start: number, end: number): string {
    return `rgb(${randomInt(start, end)},${randomInt(start, end)},${randomInt(start, end)})`
}
