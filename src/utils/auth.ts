import { getCaptcha, getLocalStorage, removeToken, setLocalStorage } from './common'
import { SYSTEM_OK, STORAGE_TOKEN_KEY, STORAGE_USER_INFO_KEY } from '@/constants/common.constants'
import request from '@/services'
import { URL_API_LOGIN, URL_API_LOGOUT } from '@/constants/urls.constants'

let captcha: Captcha

export const login = async (username: string, password: string) => {
    return await request.post<Token>(URL_API_LOGIN, {
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

export const getUser = async (): Promise<User> => {
    if (getLocalStorage(STORAGE_USER_INFO_KEY) !== null) {
        return new Promise((resolve) => {
            resolve(JSON.parse(getLocalStorage(STORAGE_USER_INFO_KEY) as string) as User)
        })
    }
    return requestUser()
}

export const requestUser = async () => {
    let user: User | null

    await request.get<User>('/user/info').then((value) => {
        const response = value.data
        if (response.code === SYSTEM_OK) {
            user = response.data
            setLocalStorage(STORAGE_USER_INFO_KEY, JSON.stringify(user))
        }
    })

    return new Promise<User>((resolve, reject) => {
        if (user) {
            resolve(user)
        }
        reject(user)
    })
}

export const getUsername = async () => {
    const user = await getUser()

    return user.username
}

export const getCaptchaSrc = () => {
    captcha = getCaptcha(300, 150, 4)
    return captcha.base64Src
}

export const verifyCaptcha = (value: string) => {
    return captcha.value.toLowerCase() === value.replace(/\s*/g, '').toLowerCase()
}
