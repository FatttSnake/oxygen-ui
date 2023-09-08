/// <reference types="vite/client" />

type RouteHandle = {
    name?: string
    menu?: boolean
    auth?: boolean
}

type _Response<T> = {
    code: number
    msg: string
    data: T | null
}

type Captcha = {
    value: string
    base64Src: string
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
