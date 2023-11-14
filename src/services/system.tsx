import request from '@/services/index'
import { URL_API_SYS_LOG, URL_API_SYS_POWER, URL_API_SYS_ROLE } from '@/constants/urls.constants'

export const r_sysLog_get = (param: SysLogGetParam) =>
    request.get<PageVo<SysLogGetVo>>(URL_API_SYS_LOG, { ...param })

export const r_role_get = (param: RoleGetParam) =>
    request.get<PageVo<RoleWithPowerGetVo>>(URL_API_SYS_ROLE, { ...param })

export const r_role_changStatus = (param: RoleChangeStatusParam) =>
    request.patch<never>(URL_API_SYS_ROLE, { ...param })

export const r_power_get = () => request.get<PowerSetVo>(URL_API_SYS_POWER)

export const r_role_add = (param: RoleAddEditParam) => request.post(URL_API_SYS_ROLE, { ...param })

export const r_role_update = (param: RoleAddEditParam) =>
    request.put(URL_API_SYS_ROLE, { ...param })

export const r_role_delete = (id: string) => request.delete(`${URL_API_SYS_ROLE}/${id}`)

export const r_role_delete_list = (ids: string[]) => request.delete(URL_API_SYS_ROLE, { ids })
