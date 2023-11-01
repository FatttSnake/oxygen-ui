import request from '@/services'
import { URL_API_LOGIN, URL_API_LOGOUT } from '@/constants/urls.constants'

export const r_login = (username: string, password: string) =>
    request.post<TokenVo>(URL_API_LOGIN, {
        username,
        password
    })

export const r_logout = () => request.post(URL_API_LOGOUT)
