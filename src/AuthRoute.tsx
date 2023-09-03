import { getLoginStatus } from '@/utils/auth.ts'

const AuthRoute = () => {
    const match = useMatches()[1]
    const handle = match.handle as RouteHandle
    const outlet = useOutlet()
    const isLogin = getLoginStatus()

    return useMemo(() => {
        if (handle?.auth && !isLogin) {
            return <Navigate to="/login" />
        }
        if (isLogin && match.pathname === '/login') {
            return <Navigate to="/" />
        }
        return outlet
    }, [handle?.auth, isLogin, match.pathname, outlet])
}

export default AuthRoute
