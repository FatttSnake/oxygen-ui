import request from '@/services/index'
import { URL_API_SYS_LOG } from '@/constants/urls.constants'

export const r_getSysLog = (param: PageParam) =>
    request.get<PageVo<SysLogGetVo>>(URL_API_SYS_LOG, { ...param })
