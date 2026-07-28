import { useEffect, useRef } from 'react'
import { jwtDecode, JwtPayload } from 'jwt-decode'
import axios from 'axios'
import {
    PERMISSION_TOKEN_REFRESH_SUCCESS,
    HEADER_CSRF_TOKEN_KEY
} from '@/constants/common.constants'
import {
    getAccessToken,
    setAccessToken,
    getCsrfToken,
    setCsrfToken,
    removeAllToken
} from '@/util/auth'

export function useTokenRefresh() {
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

    useEffect(() => {
        const checkAndRefresh = async () => {
            const token = getAccessToken()
            if (!token) {
                return
            }

            let exp: number
            try {
                const jwt = jwtDecode<JwtPayload>(token)
                if (!jwt.exp) {
                    return
                }

                exp = jwt.exp * 1000
            } catch {
                return
            }

            const timeLeft = exp - Date.now()

            if (timeLeft > 0 && timeLeft < import.meta.env.VITE_TOKEN_EXPIRY_BUFFER_MS) {
                try {
                    const csrfToken = getCsrfToken()
                    const headers: Record<string, string> = {
                        'X-Requested-With': 'XMLHttpRequest'
                    }
                    if (csrfToken) {
                        headers[HEADER_CSRF_TOKEN_KEY] = csrfToken
                    }

                    const res = await axios.post<_Response<TokenVo>>(
                        import.meta.env.VITE_API_TOKEN_URL,
                        undefined,
                        {
                            withCredentials: true,
                            headers
                        }
                    )
                    if (res.data.code === PERMISSION_TOKEN_REFRESH_SUCCESS && res.data.data) {
                        setAccessToken(res.data.data.accessToken)
                        setCsrfToken(res.data.data.csrfToken)
                    } else {
                        removeAllToken()
                    }
                } catch {
                    /* empty */
                }
            }
        }

        intervalRef.current = setInterval(
            checkAndRefresh,
            import.meta.env.VITE_TOKEN_EXPIRY_CHECK_INTERVAL_MS
        )
        void checkAndRefresh()

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
            }
        }
    }, [])
}

export default useTokenRefresh
