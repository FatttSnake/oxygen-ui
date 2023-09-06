import React, { createContext } from 'react'
import '@/assets/css/header.scss'
import LoadingMask from '@/components/LoadingMask.tsx'

export const MainFrameworkContext = createContext<{
    hideNavbar: boolean
    setHideNavbar: (newValue: boolean) => void
}>({
    hideNavbar: false,
    setHideNavbar: () => undefined
})

const MainFramework: React.FC = () => {
    const [hideNavbar, setHideNavbar] = useState(false)

    return (
        <>
            <div className={'body'}>
                <header className={'nav ' + (hideNavbar ? 'hide' : '')}>
                    <a className={'logo'} href={'https://fatweb.top'}>
                        <span className={'title'}>FatWeb</span>
                    </a>
                    <nav>
                        <ul className={'menu'}>
                            <li className={'item'}>
                                <NavLink
                                    to={''}
                                    className={({ isActive, isPending }) =>
                                        isPending ? 'pending' : isActive ? 'active' : ''
                                    }
                                >
                                    主页
                                </NavLink>
                            </li>
                            <li className={'item'}>
                                <NavLink
                                    to={'https://blog.fatweb.top'}
                                    className={({ isActive, isPending }) =>
                                        isPending ? 'pending' : isActive ? 'active' : ''
                                    }
                                >
                                    博客
                                </NavLink>
                            </li>
                            <li className={'item'}>
                                <NavLink
                                    to={'project'}
                                    className={({ isActive, isPending }) =>
                                        isPending ? 'pending' : isActive ? 'active' : ''
                                    }
                                >
                                    App
                                </NavLink>
                            </li>
                        </ul>
                    </nav>
                </header>

                <MainFrameworkContext.Provider value={{ hideNavbar, setHideNavbar }}>
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
