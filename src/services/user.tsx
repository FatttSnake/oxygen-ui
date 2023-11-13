import request from '@/services'
import { URL_API_SYS_USER_INFO, URL_API_SYS_USER } from '@/constants/urls.constants'

export const r_getInfo = () => request.get<UserWithPowerInfoVo>(URL_API_SYS_USER_INFO)

export const r_getUserList = () => request.get<UserWithRoleInfoVo[]>(URL_API_SYS_USER)
