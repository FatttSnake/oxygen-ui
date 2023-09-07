import React, { createContext } from 'react'
import '@/assets/css/header.scss'
import LoadingMask from '@/components/LoadingMask.tsx'
import router from '@/router'

export const MainFrameworkContext = createContext<{
    navbarHiddenState: {
        navbarHidden: boolean
        setNavbarHidden: (newValue: boolean) => void
    }
}>({
    navbarHiddenState: {
        navbarHidden: false,
        setNavbarHidden: () => undefined
    }
})

const MainFramework: React.FC = () => {
    const [navbarHidden, setNavbarHidden] = useState(false)
    const routeId = useMatches()[1].id
    const routeChildren = router.routes[0].children?.find((value) => value.id === routeId)?.children

    return (
        <>
            <div className={'body'}>
                <header className={'nav ' + (navbarHidden ? 'hide' : '')}>
                    <a className={'logo'} href={'https://fatweb.top'}>
                        <span className={'title'}>FatWeb</span>
                    </a>
                    <nav>
                        <ul className={'menu'}>
                            {routeChildren?.map((route) => {
                                return (
                                    <li className={'item'}>
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
                    value={{ navbarHiddenState: { navbarHidden, setNavbarHidden } }}
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
        </>
    )
}

export default MainFramework
