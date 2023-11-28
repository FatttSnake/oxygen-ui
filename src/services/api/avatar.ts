import request from '@/services'
import { URL_API_V1_AVATAR_RANDOM_BASE64 } from '@/constants/urls.constants'

export const r_api_avatar_random_base64 = () =>
    request.get<AvatarBase64Vo>(URL_API_V1_AVATAR_RANDOM_BASE64)
