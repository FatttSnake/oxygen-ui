/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_URL: string
    readonly VITE_API_TOKEN_URL: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}

type RouteHandle = {
    name?: string
    menu?: boolean
    auth?: boolean
}

type _Response<T> = {
    code: number
    success: boolean
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
