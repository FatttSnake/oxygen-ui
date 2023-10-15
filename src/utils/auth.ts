import { getCaptcha, getLocalStorage, removeToken, setLocalStorage } from './common'
import { SYSTEM_OK, TOKEN_NAME } from '@/constants/Common.constants'
import request from '@/services'

let captcha: Captcha

export const login = async (username: string, password: string) => {
    return await request.post<Token>('/login', {
        username,
        password
    })
}

export const logout = async () => {
    return request.post('/logout').finally(() => {
        removeToken()
    })
}

export const getLoginStatus = () => {
    return getLocalStorage(TOKEN_NAME) !== null
}

export const getUser = async (): Promise<User> => {
    if (getLocalStorage('userInfo') !== null) {
        return new Promise((resolve) => {
            resolve(JSON.parse(getLocalStorage('userInfo') as string) as User)
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
            setLocalStorage('userInfo', JSON.stringify(user))
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
