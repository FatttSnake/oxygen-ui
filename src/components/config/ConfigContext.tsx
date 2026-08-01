import { ReactNode } from 'react'
import { initRequestConfig } from '@/services'
import FitFullscreen from '@/components/common/FitFullscreen'
import FitCenter from '@/components/common/FitCenter'
import FullscreenLoadingMask from '@/components/common/FullscreenLoadingMask'
import ConfigLoader from '@/components/config/loader'

const MaintenancePage = () => {
    return (
        <FitFullscreen>
            <FitCenter>
                <AntdResult
                    status={'error'}
                    title={'🔧 系统维护中'}
                    subTitle={'抱歉，系统正在进行维护或配置加载失败，请稍后再试。'}
                    extra={
                        <AntdButton type={'primary'} onClick={() => window.location.reload()}>
                            重新加载
                        </AntdButton>
                    }
                />
            </FitCenter>
        </FitFullscreen>
    )
}

const ConfigContext = createContext<ConfigState>({
    config: null,
    isLoading: true,
    error: null,
    isMaintenance: false
})

interface ConfigProviderProps {
    children: ReactNode
    fallback?: ReactNode
    retryCount?: number
    retryDelay?: number
}

export const ConfigProvider = ({
    children,
    fallback,
    retryCount = 3,
    retryDelay = 2e3
}: ConfigProviderProps) => {
    const [state, setState] = useState<ConfigState>({
        config: null,
        isLoading: true,
        error: null,
        isMaintenance: false
    })

    useEffect(() => {
        let mounted = true
        let retries = 0

        const loadConfig = async () => {
            try {
                const config = await ConfigLoader.loadConfig()
                await initRequestConfig()

                if (mounted) {
                    setState({
                        config,
                        isLoading: false,
                        error: null,
                        isMaintenance: false
                    })
                }
            } catch (error) {
                console.error('Config load error:', error)

                if (retries < retryCount) {
                    retries++
                    console.log(`Retrying config load (${retries}/${retryCount})...`)

                    setTimeout(() => {
                        if (mounted) {
                            loadConfig()
                        }
                    }, retryDelay * retries)

                    return
                }

                if (mounted) {
                    setState({
                        config: null,
                        isLoading: false,
                        error: error as Error,
                        isMaintenance: true
                    })
                }
            }
        }

        void loadConfig()

        return () => {
            mounted = false
        }
    }, [retryCount, retryDelay])

    if (state.isLoading) {
        return fallback ? fallback : <FullscreenLoadingMask />
    }

    if (state.isMaintenance) {
        return <MaintenancePage />
    }

    return <ConfigContext.Provider value={state}>{children}</ConfigContext.Provider>
}

export const useConfig = () => {
    const context = useContext(ConfigContext)
    if (!context) {
        throw new Error('useConfig must be used within ConfigProvider')
    }

    return context
}

export const useIsConfigLoaded = (): boolean => {
    const { config, isLoading } = useConfig()
    return config !== null && !isLoading
}

export const useReloadConfig = () => {
    return async () => {
        ConfigLoader.clearConfig()
        window.location.reload()
    }
}

export const useSystemConfig = (): SystemConfig => {
    const { config } = useConfig()
    if (!config) {
        throw new Error('Config not loaded')
    }
    return config
}

export const useConfigValue = <K extends keyof SystemConfig>(key: K): SystemConfig[K] => {
    const { config } = useConfig()
    if (!config) {
        throw new Error(`Config not loaded when accessing ${String(key)}`)
    }
    return config[key]
}

export function useConfigValues<const K extends readonly (keyof SystemConfig)[]>(
    keys: K
): { [P in keyof K]: SystemConfig[K[P] & keyof SystemConfig] } {
    const { config } = useConfig()
    if (!config) {
        throw new Error('Config not loaded')
    }

    return keys.map((key) => config[key]) as unknown as {
        [P in keyof K]: SystemConfig[K[P] & keyof SystemConfig]
    }
}
