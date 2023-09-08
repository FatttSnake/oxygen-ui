import React from 'react'
import '@/assets/css/header.scss'
import LoadingMask from '@/components/LoadingMask.tsx'
import router from '@/router'
import HideScrollbar from '@/components/HideScrollbar.tsx'

export const MainFrameworkContext = createContext<{
    navbarHiddenState: {
        navbarHidden: boolean
        setNavbarHidden: (newValue: boolean) => void
    }
    controllers: {
        scrollX(x: number): void
        scrollY(y: number): void
        scrollTo(x: number, y: number): void
        getX(): number | undefined
        getY(): number | undefined
        scrollLeft(length: number): void
        scrollRight(length: number): void
        scrollUp(length: number): void
        scrollDown(length: number): void
    }
}>({
    navbarHiddenState: {
        navbarHidden: false,
        setNavbarHidden: () => undefined
    },
    controllers: {
        scrollX: function (): void {
            throw new Error('Function not implemented.')
        },
        scrollY: function (): void {
            throw new Error('Function not implemented.')
        },
        scrollTo: function (): void {
            throw new Error('Function not implemented.')
        },
        getX: function (): number | undefined {
            throw new Error('Function not implemented.')
        },
        getY: function (): number | undefined {
            throw new Error('Function not implemented.')
        },
        scrollLeft: function (): void {
            throw new Error('Function not implemented.')
        },
        scrollRight: function (): void {
            throw new Error('Function not implemented.')
        },
        scrollUp: function (): void {
            throw new Error('Function not implemented.')
        },
        scrollDown: function (): void {
            throw new Error('Function not implemented.')
        }
    }
})

const MainFramework: React.FC = () => {
    const [navbarHidden, setNavbarHidden] = useState(false)

    const [hideScrollbarRef, setHideScrollbarRef] = useState<RefObject<HTMLElement>>()
    const routeId = useMatches()[1].id
    const routeChildren = router.routes[0].children?.find((value) => value.id === routeId)?.children

    const getHideScrollbarRef = (ref: RefObject<HTMLElement>) => {
        setHideScrollbarRef(ref)
    }

    const hideScrollbarRefController = {
        scrollX(x: number): void {
            hideScrollbarRef?.current?.scrollTo({
                left: x,
                top: hideScrollbarRef?.current?.scrollTop,
                behavior: 'smooth'
            })
        },

        scrollY(y: number): void {
            hideScrollbarRef?.current?.scrollTo({
                left: hideScrollbarRef?.current?.scrollLeft,
                top: y,
                behavior: 'smooth'
            })
        },

        scrollLeft(length: number): void {
            hideScrollbarRef?.current?.scrollTo({
                left: (hideScrollbarRef?.current?.scrollLeft ?? 0) - length,
                behavior: 'smooth'
            })
        },

        scrollRight(length: number): void {
            hideScrollbarRef?.current?.scrollTo({
                left: (hideScrollbarRef?.current?.scrollLeft ?? 0) + length,
                behavior: 'smooth'
            })
        },

        scrollUp(length: number): void {
            hideScrollbarRef?.current?.scrollTo({
                top: (hideScrollbarRef?.current?.scrollTop ?? 0) - length,
                behavior: 'smooth'
            })
        },

        scrollDown(length: number): void {
            hideScrollbarRef?.current?.scrollTo({
                top: (hideScrollbarRef?.current?.scrollTop ?? 0) + length,
                behavior: 'smooth'
            })
        },

        scrollTo(x: number, y: number): void {
            hideScrollbarRef?.current?.scrollTo({
                left: x,
                top: y,
                behavior: 'smooth'
            })
        },

        getX(): number | undefined {
            return hideScrollbarRef?.current?.scrollLeft
        },

        getY(): number | undefined {
            return hideScrollbarRef?.current?.scrollTop
        }
    }

    return (
        <>
            <HideScrollbar getHideScrollbarRef={getHideScrollbarRef}>
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
                            controllers: hideScrollbarRefController
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
