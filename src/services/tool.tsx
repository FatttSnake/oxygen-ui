import request from '@/services/index'
import { URL_TOOL, URL_TOOL_CATEGORY, URL_TOOL_TEMPLATE } from '@/constants/urls.constants'

export const r_tool_template_get = () => request.get<ToolTemplateVo[]>(URL_TOOL_TEMPLATE)

export const r_tool_template_get_one = (id: string) =>
    request.get<ToolTemplateVo>(`${URL_TOOL_TEMPLATE}/${id}`)

export const r_tool_category_get = () => request.get<ToolCategoryVo[]>(URL_TOOL_CATEGORY)

export const r_tool_create = (param: ToolCreateParam) => request.post<ToolVo>(URL_TOOL, param)
