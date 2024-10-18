import { theme } from 'antd'
import zh_CN from 'antd/locale/zh_CN'
import BaseStyles from '@/assets/css/base.style'
import CommonStyles from '@/assets/css/common.style'
import { COLOR_MAIN } from '@/constants/common.constants'
import { getRouter } from '@/router'
import FullscreenLoadingMask from '@/components/common/FullscreenLoadingMask'

export const AppContext = createContext<{ refreshRouter: () => void }>({
    refreshRouter: () => undefined
})

const App = () => {
    const [routerState, setRouterState] = useState(getRouter)
    const [isDark, setIsDark] = useState(false)

    useEffect(() => {
        const darkThemeMq = window.matchMedia('(prefers-color-scheme: dark)')
        setIsDark(darkThemeMq.matches)
        const listener = (ev: MediaQueryListEvent) => {
            setIsDark(ev.matches)
        }
        darkThemeMq.addEventListener('change', listener)

        return () => {
            darkThemeMq.removeEventListener('change', listener)
        }
    }, [])

    return (
        <AntdConfigProvider
            theme={{
                cssVar: true,
                algorithm: isDark ? theme.darkAlgorithm : undefined,
                token: {
                    colorPrimary: COLOR_MAIN,
                    colorLinkHover: COLOR_MAIN
                },
                components: {
                    Tree: {
                        colorBgContainer: 'transparent'
                    }
                }
            }}
            locale={zh_CN}
        >
            <BaseStyles />
            <CommonStyles />
            <AppContext.Provider
                value={{
                    refreshRouter: () => {
                        setRouterState(getRouter())
                    }
                }}
            >
                <Suspense fallback={<FullscreenLoadingMask />}>
                    <RouterProvider router={routerState} />
                </Suspense>
            </AppContext.Provider>
        </AntdConfigProvider>
    )
}

export default App
