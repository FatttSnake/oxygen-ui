import { URL_LOGIN, URL_LOGOUT } from '@/constants/urls.constants'
import request from '@/services'

export const r_auth_login = (account: string, password: string) =>
    request.post<TokenVo>(URL_LOGIN, {
        account,
        password
    })

export const r_auth_logout = () => request.post(URL_LOGOUT)
