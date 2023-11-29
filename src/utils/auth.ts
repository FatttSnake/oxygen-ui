import {
    STORAGE_TOKEN_KEY,
    STORAGE_USER_INFO_KEY,
    DATABASE_SELECT_SUCCESS
} from '@/constants/common.constants'
import { getCaptcha, getLocalStorage, removeToken, setLocalStorage } from './common'
import { r_sys_user_info } from '@/services/system'
import { r_auth_login, r_auth_logout } from '@/services/auth'

let captcha: Captcha

export const login = async (username: string, password: string) => {
    return await r_auth_login(username, password)
}

export const logout = async () => {
    return r_auth_logout().finally(() => {
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

    await r_sys_user_info().then((value) => {
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

export const getNickname = async () => {
    const user = await getUserInfo()

    return user.userInfo.nickname
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
