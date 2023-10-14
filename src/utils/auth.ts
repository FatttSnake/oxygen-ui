import { getCaptcha, getLocalStorage, removeLocalStorage, setLocalStorage } from './common'
import { SYSTEM_OK, TOKEN_NAME } from '@/constants/Common.constants'
import request from '@/services'

let captcha: Captcha

export async function login(username: string, password: string) {
    return await request.post<Token>('/login', {
        username,
        password
    })
}

export function logout(): void {
    void request.post('/logout').finally(() => {
        removeLocalStorage('userInfo')
        removeLocalStorage(TOKEN_NAME)
    })
}

export function getLoginStatus(): boolean {
    return getLocalStorage(TOKEN_NAME) !== null
}

export async function getUser(): Promise<User> {
    if (getLocalStorage('userInfo') !== null) {
        return new Promise((resolve) => {
            resolve(JSON.parse(getLocalStorage('userInfo') as string) as User)
        })
    }
    return requestUser()
}

export async function requestUser(): Promise<User> {
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

export async function getUsername(): Promise<string> {
    const user = await getUser()

    return user.username
}

export function getCaptchaSrc(): string {
    captcha = getCaptcha(300, 150, 4)
    return captcha.base64Src
}

export function verifyCaptcha(value: string): boolean {
    return captcha.value.toLowerCase() === value.replace(/\s*/g, '').toLowerCase()
}
