import request from '@/services/index'
import { URL_API_SYS_LOG, URL_API_SYS_ROLE } from '@/constants/urls.constants'

export const r_getSysLog = (param: GetSysLogParams) =>
    request.get<PageVo<SysLogGetVo>>(URL_API_SYS_LOG, { ...param })

export const r_getRole = (parm: GetRoleParams) =>
    request.get<PageVo<RoleWithPowerGetVo>>(URL_API_SYS_ROLE, { ...parm })
