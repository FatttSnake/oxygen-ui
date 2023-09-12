import React from 'react'
import '@/assets/css/pages/header.scss'
import router from '@/router'
import LoadingMask from '@/components/common/LoadingMask'
import HideScrollbar, { HideScrollbarElement } from '@/components/common/HideScrollbar'

export const MainFrameworkContext = createContext<{
    navbarHiddenState: {
        navbarHidden: boolean
        setNavbarHidden: (newValue: boolean) => void
    }
    preventScrollState: {
        preventScroll: boolean
        setPreventScroll: (newValue: boolean) => void
    }
    hideScrollbarRef: React.RefObject<HideScrollbarElement>
}>({
    navbarHiddenState: {
        navbarHidden: false,
        setNavbarHidden: () => undefined
    },
    hideScrollbarRef: createRef(),
    preventScrollState: {
        preventScroll: false,
        setPreventScroll: () => undefined
    }
})

const MainFramework: React.FC = () => {
    const routeId = useMatches()[1].id
    const routeChildren = router.routes[0].children?.find((value) => value.id === routeId)?.children

    const pathname = useLocation().pathname

    const hideScrollbarRef = useRef<HideScrollbarElement>(null)

    const [navbarHidden, setNavbarHidden] = useState(true)
    const [preventScroll, setPreventScroll] = useState(false)

    useEffect(() => {
        setNavbarHidden(false)
    }, [pathname])

    return (
        <>
            <HideScrollbar ref={hideScrollbarRef} isPreventScroll={preventScroll}>
                <div className={'body'}>
                    <header className={'nav' + (navbarHidden ? ' hide' : '')}>
                        <a className={'logo'} href={'https://fatweb.top'}>
                            <span className={'title'}>FatWeb</span>
                        </a>
                        <nav>
                            <ul className={'menu'}>
                                {routeChildren?.map((route) => {
                                    return (
                                        <li className={'item'} key={route.id}>
                                            <NavLink
                                                to={route.path ?? ''}
                                                className={({ isActive, isPending }) =>
                                                    isPending ? 'pending' : isActive ? 'active' : ''
                                                }
                                            >
                                                {(route.handle as RouteHandle).name}
                                            </NavLink>
                                        </li>
                                    )
                                })}
                            </ul>
                        </nav>
                    </header>

                    <MainFrameworkContext.Provider
                        value={{
                            navbarHiddenState: { navbarHidden, setNavbarHidden },
                            preventScrollState: { preventScroll, setPreventScroll },
                            hideScrollbarRef
                        }}
                    >
                        <Suspense
                            fallback={
                                <>
                                    <LoadingMask />
                                </>
                            }
                        >
                            <Outlet />
                        </Suspense>
                    </MainFrameworkContext.Provider>
                </div>
            </HideScrollbar>
        </>
    )
}

export default MainFramework
