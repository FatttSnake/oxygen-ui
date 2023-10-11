import { getLoginStatus } from '@/utils/auth.ts'
import { PRODUCTION_NAME } from '@/constants/Common.constants.ts'

const AuthRoute = () => {
    const matches = useMatches()
    const lastMatch = matches.reduce((_, second) => second)
    const handle = lastMatch.handle as RouteHandle
    const outlet = useOutlet()
    const isLogin = getLoginStatus()

    return useMemo(() => {
        document.title = `${handle?.titlePrefix ?? ''}${
            handle?.title ? handle?.title : PRODUCTION_NAME
        }${handle?.titlePostfix ?? ''}`
        if (handle?.auth && !isLogin) {
            return <Navigate to="/login" />
        }
        if (isLogin && lastMatch.pathname === '/login') {
            return <Navigate to="/" />
        }
        return outlet
    }, [
        handle?.auth,
        handle?.title,
        handle?.titlePostfix,
        handle?.titlePrefix,
        isLogin,
        lastMatch.pathname,
        outlet
    ])
}

export default AuthRoute
