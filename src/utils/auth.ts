import { getCaptcha, getLocalStorage, removeToken, setLocalStorage } from './common'
import request from '@/services'
import {
    STORAGE_TOKEN_KEY,
    STORAGE_USER_INFO_KEY,
    DATABASE_SELECT_SUCCESS
} from '@/constants/common.constants'
import { URL_API_LOGIN, URL_API_LOGOUT, URL_API_USER_INFO } from '@/constants/urls.constants'

let captcha: Captcha

export const login = async (username: string, password: string) => {
    return await request.post<TokenVo>(URL_API_LOGIN, {
        username,
        password
    })
}

export const logout = async () => {
    return request.post(URL_API_LOGOUT).finally(() => {
        removeToken()
    })
}

export const getLoginStatus = () => {
    return getLocalStorage(STORAGE_TOKEN_KEY) !== null
}

export const getUserInfo = async (): Promise<UserWithPowerInfoVo> => {
    if (getLocalStorage(STORAGE_USER_INFO_KEY) !== null) {
        return new Promise((resolve) => {
            resolve(
                JSON.parse(getLocalStorage(STORAGE_USER_INFO_KEY) as string) as UserWithPowerInfoVo
            )
        })
    }
    return requestUserInfo()
}

export const requestUserInfo = async () => {
    let user: UserWithPowerInfoVo | null

    await request.get<UserWithPowerInfoVo>(URL_API_USER_INFO).then((value) => {
        const response = value.data
        if (response.code === DATABASE_SELECT_SUCCESS) {
            user = response.data
            setLocalStorage(STORAGE_USER_INFO_KEY, JSON.stringify(user))
        }
    })

    return new Promise<UserWithPowerInfoVo>((resolve, reject) => {
        if (user) {
            resolve(user)
        }
        reject(user)
    })
}

export const getNickName = async () => {
    const user = await getUserInfo()

    return user.userInfo.nickName
}

export const getUsername = async () => {
    const user = await getUserInfo()

    return user.username
}

export const getPermissionPath = (): string[] => {
    const s = getLocalStorage(STORAGE_USER_INFO_KEY)
    if (s === null) {
        return []
    }

    const user = JSON.parse(s) as UserWithPowerInfoVo
    const paths: string[] = []
    user.menus.forEach((menu) => {
        paths.push(menu.url)
    })

    return paths
}

export const hasPathPermission = (path: string) => {
    return getPermissionPath().indexOf(path) !== -1
}

/*
export const getAuthRoute = (route: RouteJsonObject[]): RouteJsonObject[] => {
    return route.map((value) => {
        if (value.absolutePath) {
            value.absolutePath
        }
        if (value.children) {
            value.children = getAuthRoute(value.children)
        }
        return value
    })
}
*/

export const getCaptchaSrc = () => {
    captcha = getCaptcha(300, 150, 4)
    return captcha.base64Src
}

export const verifyCaptcha = (value: string) => {
    return captcha.value.toLowerCase() === value.replace(/\s*/g, '').toLowerCase()
}
