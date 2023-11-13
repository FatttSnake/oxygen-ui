import request from '@/services/index'
import { URL_API_SYS_LOG, URL_API_SYS_POWER, URL_API_SYS_ROLE } from '@/constants/urls.constants'

export const r_getSysLog = (param: SysLogGetParam) =>
    request.get<PageVo<SysLogGetVo>>(URL_API_SYS_LOG, { ...param })

export const r_getRole = (param: RoleGetParam) =>
    request.get<PageVo<RoleWithPowerGetVo>>(URL_API_SYS_ROLE, { ...param })

export const r_changeRoleStatus = (param: RoleChangeStatusParam) =>
    request.patch<never>(URL_API_SYS_ROLE, { ...param })

export const r_getPower = () => request.get<PowerSetVo>(URL_API_SYS_POWER)

export const r_addRole = (param: RoleAddEditParam) => request.post(URL_API_SYS_ROLE, { ...param })

export const r_updateRole = (param: RoleAddEditParam) => request.put(URL_API_SYS_ROLE, { ...param })
