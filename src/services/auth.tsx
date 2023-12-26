import {
    URL_FORGET,
    URL_LOGIN,
    URL_LOGOUT,
    URL_REGISTER,
    URL_RESEND,
    URL_RETRIEVE,
    URL_VERIFY
} from '@/constants/urls.constants'
import request from '@/services'

export const r_auth_register = (param: RegisterParam) => request.post(URL_REGISTER, param)

export const r_auth_resend = () => request.post(URL_RESEND)

export const r_auth_verify = (param: VerifyParam) => request.post(URL_VERIFY, param)

export const r_auth_forget = (param: ForgetParam) => request.post(URL_FORGET, param)

export const r_auth_retrieve = (param: RetrieveParam) => request.post(URL_RETRIEVE, param)

export const r_auth_login = (param: LoginParam) => request.post<TokenVo>(URL_LOGIN, param)

export const r_auth_logout = () => request.post(URL_LOGOUT)
