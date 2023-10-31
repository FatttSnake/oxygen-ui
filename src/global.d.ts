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
    absolutePath?: string
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
    absolutePath: string
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

type TokenVo = {
    token: string
}

type UserWithInfoVo = {
    id: string
    username: string
    locking: boolean
    expiration: Date
    credentialsExpiration: Date
    enable: number
    lastLoginTime: Date
    lastLoginIp: string
    createTime: Date
    updateTime: Date
    userInfo: UserInfoVo
    modules: ModuleVo[]
    menus: MenuVo[]
    elements: ElementVo[]
    operations: OperationVo[]
}

type UserInfoVo = {
    id: string
    userId: string
    nickName: string
    avatar: string
    email: string
}

type ModuleVo = {
    id: number
    name: string
    powerId: number
}

type MenuVo = {
    id: number
    name: string
    url: string
    powerId: number
    parentId: number
}

type ElementVo = {
    id: number
    name: string
    powerId: number
    parentId: number
    menuId: number
}

type OperationVo = {
    id: number
    name: string
    code: string
    powerId: number
    elementId: number
}

type LoginForm = {
    username: string
    password: string
}
