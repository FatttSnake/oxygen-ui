import { getLoginStatus } from '@/utils/auth.ts'

const AuthRoute = () => {
    const matches = useMatches()
    const lastMatch = matches.reduce((_, second) => second)
    const handle = lastMatch.handle as RouteHandle
    const outlet = useOutlet()
    const isLogin = getLoginStatus()

    return useMemo(() => {
        if (handle?.auth && !isLogin) {
            return <Navigate to="/login" />
        }
        if (isLogin && lastMatch.pathname === '/login') {
            return <Navigate to="/" />
        }
        return outlet
    }, [handle?.auth, isLogin, lastMatch.pathname, outlet])
}

export default AuthRoute
