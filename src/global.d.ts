/// <reference types="vite/client" />
/// <reference types="./ant-design" />

interface ImportMetaEnv {
    readonly VITE_API_URL: string
    readonly VITE_API_TOKEN_URL: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}

interface RouteJsonObject {
    path: string
    absolutePath: string
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
    permission?: boolean
    autoHide?: boolean
    children?: RouteJsonObject[]
}

interface RouteHandle {
    absolutePath: string
    name?: string
    titlePrefix?: string
    title?: string
    titlePostfix?: string
    icon?: IconComponent
    menu?: boolean
    auth?: boolean
    permission?: boolean
    autoHide?: boolean
}

interface _Response<T> {
    code: number
    success: boolean
    msg: string
    data: T | null
}

interface Captcha {
    value: string
    base64Src: string
}

interface TokenVo {
    token: string
}

interface UserWithPowerInfoVo {
    id: string
    username: string
    locking: boolean
    expiration: string
    credentialsExpiration: string
    enable: number
    lastLoginTime: string
    lastLoginIp: string
    createTime: string
    updateTime: string
    userInfo: UserInfoVo
    modules: ModuleVo[]
    menus: MenuVo[]
    elements: ElementVo[]
    operations: OperationVo[]
}

interface UserWithRoleInfoVo {
    id: string
    username: string
    locking: boolean
    expiration: string
    credentialsExpiration: string
    enable: number
    lastLoginTime: string
    lastLoginIp: string
    createTime: string
    updateTime: string
    userInfo: UserInfoVo
    roles: RoleVo[]
    groups: GroupVo[]
}

interface UserInfoVo {
    id: string
    userId: string
    nickname: string
    avatar: string
    email: string
}

interface ModuleVo {
    id: number
    name: string
    powerId: number
}

interface MenuVo {
    id: number
    name: string
    url: string
    powerId: number
    parentId: number
}

interface ElementVo {
    id: number
    name: string
    powerId: number
    parentId: number
    menuId: number
}

interface OperationVo {
    id: number
    name: string
    code: string
    powerId: number
    elementId: number
}

interface RoleVo {
    id: string
    name: string
    enable: boolean
}

interface GroupVo {
    id: string
    name: string
    enable: boolean
}

interface LoginForm {
    username: string
    password: string
}

interface PageVo<T> {
    current: number
    pages: number
    size: number
    total: number
    records: T[]
}

interface PageParam {
    currentPage?: number
    pageSize?: number
    sortField?: string
    sortOrder?: string
}

interface GetSysLogParams extends PageParam {
    searchRequestUrl?: string
    searchRegex?: boolean
    searchStartTime?: string
    searchEndTime?: string
}

interface TableParams {
    pagination?: _TablePaginationConfig
    sortField?: React.Key | readonly React.Key[]
    sortOrder?: _SortOrder
    filters?: Record<string, _FilterValue | null>
}

interface SysLogGetVo {
    id: string
    logType: string
    operateUserId: string
    operateTime: string
    requestUri: string
    requestMethod: string
    requestParams: string
    requestIp: string
    requestServerAddress: string
    exception: boolean
    exceptionInfo: string
    startTime: string
    endTime: string
    executeTime: number
    userAgent: string
    operateUsername: string
}
