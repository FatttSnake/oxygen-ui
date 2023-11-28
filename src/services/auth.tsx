import request from '@/services'
import { URL_LOGIN, URL_LOGOUT } from '@/constants/urls.constants'

export const r_auth_login = (username: string, password: string) =>
    request.post<TokenVo>(URL_LOGIN, {
        username,
        password
    })

export const r_auth_logout = () => request.post(URL_LOGOUT)
