import { URL_LOGIN, URL_LOGOUT, URL_REGISTER, URL_VERIFY } from '@/constants/urls.constants'
import request from '@/services'

export const r_auth_register = (param: RegisterParam) => request.post(URL_REGISTER, param)

export const r_auth_verify = (param: VerifyParam) => request.post(URL_VERIFY, param)

export const r_auth_login = (param: LoginParam) => request.post<TokenVo>(URL_LOGIN, param)

export const r_auth_logout = () => request.post(URL_LOGOUT)
