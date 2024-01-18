import { Key } from 'react'
import {
    URL_SYS_USER_INFO,
    URL_SYS_USER,
    URL_SYS_POWER_LIST,
    URL_SYS_ROLE,
    URL_SYS_ROLE_LIST,
    URL_SYS_GROUP,
    URL_SYS_GROUP_LIST,
    URL_SYS_LOG,
    URL_SYS_SETTINGS_MAIL,
    URL_SYS_STATISTICS_SOFTWARE,
    URL_SYS_STATISTICS_HARDWARE,
    URL_SYS_STATISTICS_CPU,
    URL_SYS_STATISTICS_STORAGE,
    URL_SYS_STATISTICS_ONLINE,
    URL_SYS_STATISTICS_ACTIVE,
    URL_SYS_SETTINGS_BASE,
    URL_SYS_SETTINGS_SENSITIVE,
    URL_SYS_TOOL_CATEGORY
} from '@/constants/urls.constants'
import request from '@/services/index'

export const r_sys_user_info = () => request.get<UserWithPowerInfoVo>(URL_SYS_USER_INFO)

export const r_sys_user_get = (param: UserGetParam) =>
    request.get<PageVo<UserWithRoleInfoVo>>(URL_SYS_USER, param)

export const r_sys_user_add = (param: UserAddEditParam) => request.post(URL_SYS_USER, param)

export const r_sys_user_update = (param: UserAddEditParam) => request.put(URL_SYS_USER, param)

export const r_sys_user_change_password = (param: UserChangePasswordParam) =>
    request.patch(URL_SYS_USER, param)

export const r_sys_user_delete = (id: string) => request.delete(`${URL_SYS_USER}/${id}`)

export const r_sys_user_delete_list = (ids: Key[]) => request.delete(URL_SYS_USER, { ids })

export const r_sys_power_get_list = () => request.get<PowerSetVo>(URL_SYS_POWER_LIST)

export const r_sys_role_get = (param: RoleGetParam) =>
    request.get<PageVo<RoleWithPowerGetVo>>(URL_SYS_ROLE, param)

export const r_sys_role_get_list = () => request.get<RoleVo[]>(URL_SYS_ROLE_LIST)

export const r_sys_role_change_status = (param: RoleChangeStatusParam) =>
    request.patch<never>(URL_SYS_ROLE, param)

export const r_sys_role_add = (param: RoleAddEditParam) => request.post(URL_SYS_ROLE, param)

export const r_sys_role_update = (param: RoleAddEditParam) => request.put(URL_SYS_ROLE, param)

export const r_sys_role_delete = (id: string) => request.delete(`${URL_SYS_ROLE}/${id}`)

export const r_sys_role_delete_list = (ids: Key[]) => request.delete(URL_SYS_ROLE, { ids })

export const r_sys_group_get = (param: GroupGetParam) =>
    request.get<PageVo<GroupWithRoleGetVo>>(URL_SYS_GROUP, param)

export const r_sys_group_get_list = () => request.get<GroupVo[]>(URL_SYS_GROUP_LIST)

export const r_sys_group_change_status = (param: GroupChangeStatusParam) =>
    request.patch<never>(URL_SYS_GROUP, param)

export const r_sys_group_add = (param: GroupAddEditParam) => request.post(URL_SYS_GROUP, param)

export const r_sys_group_update = (param: GroupAddEditParam) => request.put(URL_SYS_GROUP, param)

export const r_sys_group_delete = (id: string) => request.delete(`${URL_SYS_GROUP}/${id}`)

export const r_sys_group_delete_list = (ids: Key[]) => request.delete(URL_SYS_GROUP, { ids })

export const r_sys_log_get = (param: SysLogGetParam) =>
    request.get<PageVo<SysLogGetVo>>(URL_SYS_LOG, param)

export const r_sys_settings_base_get = () => request.get<BaseSettingsVo>(URL_SYS_SETTINGS_BASE)

export const r_sys_settings_base_update = (param: BaseSettingsParam) =>
    request.put(URL_SYS_SETTINGS_BASE, param)

export const r_sys_settings_mail_get = () => request.get<MailSettingsVo>(URL_SYS_SETTINGS_MAIL)

export const r_sys_settings_mail_update = (param: MailSettingsParam) =>
    request.put(URL_SYS_SETTINGS_MAIL, param)

export const r_sys_settings_mail_send = (param: MailSendParam) =>
    request.post(URL_SYS_SETTINGS_MAIL, param)

export const r_sys_settings_sensitive_get = () =>
    request.get<SensitiveWordVo[]>(URL_SYS_SETTINGS_SENSITIVE)

export const r_sys_settings_sensitive_add = (param: SensitiveWordAddParam) =>
    request.post(URL_SYS_SETTINGS_SENSITIVE, param)

export const r_sys_settings_sensitive_update = (param: SensitiveWordUpdateParam) =>
    request.put(URL_SYS_SETTINGS_SENSITIVE, param)

export const r_sys_settings_sensitive_delete = (id: string) =>
    request.delete(`${URL_SYS_SETTINGS_SENSITIVE}/${id}`)

export const r_sys_statistics_software = () =>
    request.get<SoftwareInfoVo>(URL_SYS_STATISTICS_SOFTWARE)

export const r_sys_statistics_hardware = () =>
    request.get<HardwareInfoVo>(URL_SYS_STATISTICS_HARDWARE)

export const r_sys_statistics_cpu = () => request.get<CpuInfoVo>(URL_SYS_STATISTICS_CPU)

export const r_sys_statistics_storage = () => request.get<StorageInfoVo>(URL_SYS_STATISTICS_STORAGE)

export const r_sys_statistics_online = (param: OnlineInfoGetParam) =>
    request.get<OnlineInfoVo>(URL_SYS_STATISTICS_ONLINE, param)

export const r_sys_statistics_active = (param: ActiveInfoGetParam) =>
    request.get<ActiveInfoVo>(URL_SYS_STATISTICS_ACTIVE, param)

export const r_sys_tool_category_get = () => request.get<ToolCategoryVo[]>(URL_SYS_TOOL_CATEGORY)

export const r_sys_tool_category_add = (param: ToolCategoryAddEditParam) =>
    request.post(URL_SYS_TOOL_CATEGORY, param)

export const r_sys_tool_category_update = (param: ToolCategoryAddEditParam) =>
    request.put(URL_SYS_TOOL_CATEGORY, param)

export const r_sys_tool_category_delete = (id: string) =>
    request.delete(`${URL_SYS_TOOL_CATEGORY}/${id}`)
