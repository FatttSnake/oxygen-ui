import React from 'react'
import request from '@/services/index'
import {
    URL_API_SYS_USER_INFO,
    URL_API_SYS_USER,
    URL_API_SYS_POWER_LIST,
    URL_API_SYS_ROLE,
    URL_API_SYS_ROLE_LIST,
    URL_API_SYS_GROUP,
    URL_API_SYS_GROUP_LIST,
    URL_API_SYS_LOG
} from '@/constants/urls.constants'

export const r_sys_user_info = () => request.get<UserWithPowerInfoVo>(URL_API_SYS_USER_INFO)

export const r_sys_user = () => request.get<UserWithRoleInfoVo[]>(URL_API_SYS_USER)

export const r_sys_power_get_list = () => request.get<PowerSetVo>(URL_API_SYS_POWER_LIST)

export const r_sys_role_get = (param: RoleGetParam) =>
    request.get<PageVo<RoleWithPowerGetVo>>(URL_API_SYS_ROLE, { ...param })

export const r_sys_role_get_list = () => request.get<RoleVo[]>(URL_API_SYS_ROLE_LIST)

export const r_sys_role_change_status = (param: RoleChangeStatusParam) =>
    request.patch<never>(URL_API_SYS_ROLE, { ...param })

export const r_sys_role_add = (param: RoleAddEditParam) =>
    request.post(URL_API_SYS_ROLE, { ...param })

export const r_sys_role_update = (param: RoleAddEditParam) =>
    request.put(URL_API_SYS_ROLE, { ...param })

export const r_sys_role_delete = (id: string) => request.delete(`${URL_API_SYS_ROLE}/${id}`)

export const r_sys_role_delete_list = (ids: React.Key[]) =>
    request.delete(URL_API_SYS_ROLE, { ids })

export const r_sys_group_get = (param: GroupGetParam) =>
    request.get<PageVo<GroupWithRoleGetVo>>(URL_API_SYS_GROUP, { ...param })

export const r_sys_group_get_list = () => request.get<GroupVo[]>(URL_API_SYS_GROUP_LIST)

export const r_sys_group_change_status = (param: GroupChangeStatusParam) =>
    request.patch<never>(URL_API_SYS_GROUP, { ...param })

export const r_sys_group_add = (param: GroupAddEditParam) =>
    request.post(URL_API_SYS_GROUP, { ...param })

export const r_sys_group_update = (param: GroupAddEditParam) =>
    request.put(URL_API_SYS_GROUP, { ...param })

export const r_sys_group_delete = (id: string) => request.delete(`${URL_API_SYS_GROUP}/${id}`)

export const r_sys_group_delete_list = (ids: React.Key[]) =>
    request.delete(URL_API_SYS_GROUP, { ids })

export const r_sys_log_get = (param: SysLogGetParam) =>
    request.get<PageVo<SysLogGetVo>>(URL_API_SYS_LOG, { ...param })
