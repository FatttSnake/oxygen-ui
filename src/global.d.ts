/// <reference types="vite/client" />
/// <reference types="./ant-design" />

interface ImportMetaEnv {
    readonly VITE_API_URL: string
    readonly VITE_API_TOKEN_URL: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}

type RouteJsonObject = {
    path: string
    id?: string
    element?: React.JSX.Element
    component?: React.ComponentType
    name?: string
    titlePrefix?: string
    title?: string
    titlePostfix?: string
    icon?: IconComponent
    menu?: boolean
    auth?: boolean
    children?: RouteJsonObject[]
}

type RouteHandle = {
    name?: string
    menu?: boolean
    auth?: boolean
    titlePrefix?: string
    title?: string
    titlePostfix?: string
    icon?: IconComponent
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
