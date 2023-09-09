import React from 'react'
import '@/assets/css/header.scss'
import LoadingMask from '@/components/LoadingMask.tsx'
import router from '@/router'
import HideScrollbar, { HideScrollbarElement } from '@/components/HideScrollbar.tsx'

export const MainFrameworkContext = createContext<{
    navbarHiddenState: {
        navbarHidden: boolean
        setNavbarHidden: (newValue: boolean) => void
    }
    hideScrollbarRef: RefObject<HideScrollbarElement>
}>({
    navbarHiddenState: {
        navbarHidden: false,
        setNavbarHidden: () => undefined
    },
    hideScrollbarRef: createRef()
})

const MainFramework: React.FC = () => {
    const [navbarHidden, setNavbarHidden] = useState(true)

    const hideScrollbarRef = useRef<HideScrollbarElement>(null)
    const routeId = useMatches()[1].id
    const routeChildren = router.routes[0].children?.find((value) => value.id === routeId)?.children

    return (
        <>
            <HideScrollbar ref={hideScrollbarRef}>
                <div className={'body'}>
                    <header className={'nav ' + (navbarHidden ? 'hide' : '')}>
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
