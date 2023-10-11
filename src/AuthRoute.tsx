import { getLoginStatus } from '@/utils/auth.ts'
import { PRODUCTION_NAME } from '@/constants/Common.constants.ts'

const AuthRoute = () => {
    const matches = useMatches()
    const lastMatch = matches.reduce((_, second) => second)
    const handle = lastMatch.handle as RouteHandle
    const location = useLocation()
    const outlet = useOutlet()
    const isLogin = getLoginStatus()

    return useMemo(() => {
        document.title = `${handle?.titlePrefix ?? ''}${
            handle?.title ? handle?.title : PRODUCTION_NAME
        }${handle?.titlePostfix ?? ''}`
        if (matches.some(({ handle }) => (handle as RouteHandle)?.auth) && !isLogin) {
            return (
                <Navigate
                    to={`/login${
                        '?redirect=' + encodeURIComponent(lastMatch.pathname + location.search)
                    }`}
                />
            )
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
        location.search,
        outlet
    ])
}

export default AuthRoute
