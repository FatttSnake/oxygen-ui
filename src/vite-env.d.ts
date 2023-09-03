/// <reference types="vite/client" />

type Captcha = {
    value: string
    base64Src: string
}

type RouteHandle = {
    auth: boolean
}

type _Response<T> = {
    code: number
    msg: string
    data: T | null
}

type Token = {
    token: string
}

type User = {
    id: number
    username: string
    enable: number
}

type LoginForm = {
    username: string
    password: string
}
