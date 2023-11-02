import request from '@/services/index'
import { URL_API_SYS_LOG } from '@/constants/urls.constants'

export const r_getSysLog = () => request.get<SysLogGetVo[]>(URL_API_SYS_LOG)
