import React from 'react'
import Icon from '@ant-design/icons'
import router from '@/router'
import { COLOR_FONT_SECONDARY } from '@/constants/common.constants'
import '@/assets/css/pages/home-framework.scss'
import LoadingMask from '@/components/common/LoadingMask'
import HideScrollbar, { HideScrollbarElement } from '@/components/common/HideScrollbar'

export const HomeFrameworkContext = createContext<{
    navbarHiddenState: {
        navbarHidden: boolean
        setNavbarHidden: (newValue: boolean) => void
    }
    preventScrollState: {
        preventScroll: boolean
        setPreventScroll: (newValue: boolean) => void
    }
    showVerticalScrollbarState: {
        showVerticalScrollbar: boolean
        setShowVerticalScrollbar: (newValue: boolean) => void
    }
    showHorizontalScrollbarState: {
        showHorizontalScrollbar: boolean
        setShowHorizontalScrollbar: (newValue: boolean) => void
    }
    showDropdownMenuState: {
        showDropdownMenu: boolean
        setShowDropdownMenu: (newValue: boolean) => void
    }
    hideScrollbarRef: React.RefObject<HideScrollbarElement>
}>({
    navbarHiddenState: {
        navbarHidden: false,
        setNavbarHidden: () => undefined
    },
    preventScrollState: {
        preventScroll: false,
        setPreventScroll: () => undefined
    },
    showVerticalScrollbarState: {
        showVerticalScrollbar: false,
        setShowVerticalScrollbar: () => undefined
    },
    showHorizontalScrollbarState: {
        showHorizontalScrollbar: false,
        setShowHorizontalScrollbar: () => undefined
    },
    showDropdownMenuState: {
        showDropdownMenu: false,
        setShowDropdownMenu: () => undefined
    },
    hideScrollbarRef: createRef()
})

const HomeFramework: React.FC = () => {
    const routeId = useMatches()[1].id
    const routeChildren = router.routes[0].children?.find((value) => value.id === routeId)?.children

    const pathname = useLocation().pathname

    const hideScrollbarRef = useRef<HideScrollbarElement>(null)

    const [navbarHidden, setNavbarHidden] = useState(true)
    const [preventScroll, setPreventScroll] = useState(false)
    const [showVerticalScrollbar, setShowVerticalScrollbar] = useState(false)
    const [showHorizontalScrollbar, setShowHorizontalScrollbar] = useState(false)
    const [showDropdownMenu, setShowDropdownMenu] = useState(false)

    useEffect(() => {
        setNavbarHidden(false)
    }, [pathname])

    const handleMenuDropdownButtonClick = () => {
        setShowDropdownMenu(!showDropdownMenu)
    }

    return (
        <>
            <HideScrollbar
                ref={hideScrollbarRef}
                isPreventVerticalScroll={preventScroll}
                isShowHorizontalScrollbar={true}
                minWidth={'900px'}
            >
                <div className={'body'}>
                    <div>
                        <header className={`nav${navbarHidden ? ' hide' : ''}`}>
                            <a className={'logo'} href={'https://fatweb.top'}>
                                <span className={'title'}>FatWeb</span>
                            </a>
                            <nav>
                                <ul className={'menu'}>
                                    {routeChildren?.map((route) => {
                                        return (route.handle as RouteHandle).menu ? (
                                            <li className={'item'} key={route.id}>
                                                <NavLink
                                                    to={route.path ?? ''}
                                                    className={({ isActive, isPending }) =>
                                                        isPending
                                                            ? 'pending'
                                                            : isActive
                                                            ? 'active'
                                                            : ''
                                                    }
                                                >
                                                    {(route.handle as RouteHandle).name}
                                                </NavLink>
                                                {route.children ? (
                                                    <ul className={'submenu'}>
                                                        {route.children.map((subRoute) => {
                                                            return (subRoute.handle as RouteHandle)
                                                                .menu ? (
                                                                <li
                                                                    className={'item'}
                                                                    key={subRoute.id}
                                                                >
                                                                    <NavLink
                                                                        to={`${route.path ?? ''}/${
                                                                            subRoute.path ?? ''
                                                                        }`}
                                                                        className={({
                                                                            isActive,
                                                                            isPending
                                                                        }) =>
                                                                            isPending
                                                                                ? 'pending'
                                                                                : isActive
                                                                                ? 'active'
                                                                                : ''
                                                                        }
                                                                    >
                                                                        {
                                                                            (
                                                                                subRoute.handle as RouteHandle
                                                                            ).name
                                                                        }
                                                                    </NavLink>
                                                                </li>
                                                            ) : (
                                                                <></>
                                                            )
                                                        })}
                                                    </ul>
                                                ) : (
                                                    <></>
                                                )}
                                            </li>
                                        ) : (
                                            <></>
                                        )
                                    })}
                                </ul>
                                <div
                                    className={`dropdown-menu-button${
                                        showDropdownMenu ? ' active' : ''
                                    }`}
                                >
                                    <Icon
                                        component={IconFatwebMenu}
                                        style={{ fontSize: '2.6em', color: COLOR_FONT_SECONDARY }}
                                        onClick={handleMenuDropdownButtonClick}
                                    />
                                </div>
                            </nav>
                        </header>
                        <div className={`dropdown-menu-content${showDropdownMenu ? ' show' : ''}`}>
                            <ul>
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
                        </div>
                    </div>

                    <HomeFrameworkContext.Provider
                        value={{
                            navbarHiddenState: { navbarHidden, setNavbarHidden },
                            preventScrollState: { preventScroll, setPreventScroll },
                            showVerticalScrollbarState: {
                                showVerticalScrollbar,
                                setShowVerticalScrollbar
                            },
                            showHorizontalScrollbarState: {
                                showHorizontalScrollbar,
                                setShowHorizontalScrollbar
                            },
                            showDropdownMenuState: {
                                showDropdownMenu,
                                setShowDropdownMenu
                            },
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
                    </HomeFrameworkContext.Provider>
                </div>
            </HideScrollbar>
        </>
    )
}

export default HomeFramework
