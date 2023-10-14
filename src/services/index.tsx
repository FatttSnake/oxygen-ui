import axios, { type AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import jwtDecode, { JwtPayload } from 'jwt-decode'
import { clearLocalStorage, getToken, setToken } from '@/utils/common'
import {
    SYSTEM_ACCESS_DENIED,
    SYSTEM_TOKEN_HAS_EXPIRED,
    SYSTEM_TOKEN_ILLEGAL,
    SYSTEM_TOKEN_RENEW_SUCCESS,
    SYSTEM_UNAUTHORIZED
} from '@/constants/Common.constants'
import { message } from 'antd'

const service: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 30000,
    withCredentials: false
})

service.defaults.paramsSerializer = (params: Record<string, string>) => {
    return Object.keys(params)
        .filter((it) => {
            return Object.prototype.hasOwnProperty.call(params, it)
        })
        .reduce((pre, curr) => {
            return params[curr] !== null
                ? (pre !== '' ? pre + '&' : '') + curr + '=' + encodeURIComponent(params[curr])
                : pre
        }, '')
}

service.interceptors.request.use(
    async (config) => {
        let token = getToken()
        if (token !== null) {
            const jwt = jwtDecode<JwtPayload>(token)
            if (!jwt.exp) {
                return config
            }
            if (
                jwt.exp * 1000 - new Date().getTime() < 1200000 &&
                jwt.exp * 1000 - new Date().getTime() > 0
            ) {
                await axios
                    .get(import.meta.env.VITE_API_TOKEN_URL, {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                    .then((value: AxiosResponse<_Response<Token>>) => {
                        const response = value.data
                        if (response.code === SYSTEM_TOKEN_RENEW_SUCCESS) {
                            setToken(response.data?.token ?? '')
                        }
                    })
            }

            token = getToken()
            config.headers.set('Authorization', `Bearer ${token}`)
        }
        return config
    },
    async (error) => {
        return await Promise.reject(error)
    }
)

service.interceptors.response.use(
    (response: AxiosResponse<_Response<never>>) => {
        switch (response.data.code) {
            case SYSTEM_UNAUTHORIZED:
            case SYSTEM_TOKEN_ILLEGAL:
            case SYSTEM_TOKEN_HAS_EXPIRED:
                clearLocalStorage()
                void message.error(
                    <>
                        <strong>登录已过期</strong>
                    </>
                )
                setTimeout(() => {
                    location.reload()
                }, 1500)
                throw response?.data
            case SYSTEM_ACCESS_DENIED:
                void message.error(
                    <>
                        <strong>暂无权限操作</strong>
                    </>
                )
                throw response?.data
        }
        return response
    },
    async (error: AxiosError) => {
        void message.error(
            <>
                <strong>服务器出错</strong>，请稍后重试
            </>
        )
        return await Promise.reject(error?.response?.data)
    }
)

const request = {
    async get<T>(url: string, data?: object): Promise<AxiosResponse<_Response<T>>> {
        return await request.request('GET', url, { params: data })
    },
    async post<T>(url: string, data?: object): Promise<AxiosResponse<_Response<T>>> {
        return await request.request('POST', url, { data })
    },
    async put<T>(url: string, data?: object): Promise<AxiosResponse<_Response<T>>> {
        return await request.request('PUT', url, { data })
    },
    async delete<T>(url: string, data?: object): Promise<AxiosResponse<_Response<T>>> {
        return await request.request('DELETE', url, { params: data })
    },
    async request<T>(
        method = 'GET',
        url: string,
        data?: AxiosRequestConfig
    ): Promise<AxiosResponse<_Response<T>>> {
        return await new Promise((resolve, reject) => {
            service({ method, url, ...data })
                .then((res) => {
                    resolve(res as unknown as Promise<AxiosResponse<_Response<T>>>)
                })
                .catch((e: Error | AxiosError) => {
                    reject(e)
                })
        })
    }
}

export default request
