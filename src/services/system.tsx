import request from '@/services/index'
import { URL_API_SYS_LOG, URL_API_SYS_ROLE } from '@/constants/urls.constants'

export const r_getSysLog = (param: GetSysLogParam) =>
    request.get<PageVo<SysLogGetVo>>(URL_API_SYS_LOG, { ...param })

export const r_getRole = (param: GetRoleParam) =>
    request.get<PageVo<RoleWithPowerGetVo>>(URL_API_SYS_ROLE, { ...param })

export const r_changeRoleStatus = (param: RoleChangeStatusParam) =>
    request.patch<never>(URL_API_SYS_ROLE, { ...param })
