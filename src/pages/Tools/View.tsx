import useStyles from '@/assets/css/pages/tools/view.style'
import { DATABASE_NO_RECORD_FOUND, DATABASE_SELECT_SUCCESS } from '@/constants/common.constants'
import { checkDesktop, message, setPageFavicon, setPageTitle } from '@/util/common'
import { navigateToRoot } from '@/util/navigation'
import { generateThemeCssVariables, processBaseDist, removeUselessAttributes } from '@/util/tool'
import { r_tool_get_dist } from '@/services/tool'
import { AppContext } from '@/App'
import FitFullscreen from '@/components/common/FitFullscreen'
import Card from '@/components/common/Card'
import Render from '@/components/Playground/Output/Preview/Render'

const View = () => {
    const { styles, theme } = useStyles()
    const { isDarkMode } = useContext(AppContext)
    const navigate = useNavigate()
    const { username, toolId } = useParams()
    const [searchParams] = useSearchParams({
        platform: import.meta.env.VITE_PLATFORM
    })
    const [isLoading, setIsLoading] = useState(false)
    const [compiledCode, setCompiledCode] = useState('')

    const render = (toolVo: ToolWithDistVo, toolBaseVo: ToolBaseWithDistVo) => {
        setPageFavicon(`data:image/svg+xml;base64,${toolVo.icon}`)
        setPageTitle(toolVo.name)

        const baseDist = toolBaseVo.dist.fileContent
        const dist = toolVo.dist.fileContent
        setCompiledCode(`(() => {${dist}})();\n(() => {${baseDist}})();`)
    }

    const getTool = () => {
        if (isLoading) {
            return
        }
        setIsLoading(true)
        void message.loading({ content: '加载中……', key: 'LOADING', duration: 0 })

        r_tool_get_dist(username!, toolId!, 'latest', searchParams.get('platform') as Platform)
            .then((res) => {
                const response = res.data
                switch (response.code) {
                    case DATABASE_SELECT_SUCCESS:
                        return response.data!
                    case DATABASE_NO_RECORD_FOUND:
                        message.error('未找到指定工具').then(() => {
                            navigateToRoot(navigate)
                        })
                        throw Error()
                    default:
                        throw Error('获取工具信息失败，请稍后重试')
                }
            })
            .then((toolVo) => processBaseDist(toolVo.base.id, toolVo.base.version, { toolVo }))
            .then(({ toolVo, toolBaseVo }) => {
                render(toolVo, toolBaseVo)
            })
            .catch((e: Error) => {
                console.error(e)
                e?.message && message.error(e.message)
            })
            .finally(() => {
                setIsLoading(false)
                message.destroy('LOADING')
            })
    }

    useEffect(() => {
        const platform = searchParams.get('platform')!
        if (!['WEB', 'DESKTOP', 'ANDROID'].includes(platform)) {
            navigateToRoot(navigate)
            return
        }
        switch (platform) {
            case 'ANDROID':
            case 'DESKTOP':
                if (!checkDesktop()) {
                    message.warning('此应用需要桌面端环境，请在桌面端打开').then(() => {
                        navigateToRoot(navigate)
                    })
                    return
                }
        }
        if (username === '!') {
            navigateToRoot(navigate)
            return
        }
        getTool()

        return () => {
            setPageFavicon()
        }
    }, [username, toolId, searchParams])

    return (
        <FitFullscreen className={styles.root}>
            <Card className={styles.content}>
                <Render
                    iframeKey={`${username}:${toolId}`}
                    compiledCode={compiledCode}
                    globalJsVariables={{
                        OxygenTheme: { ...removeUselessAttributes(theme), isDarkMode }
                    }}
                    globalCssVariables={generateThemeCssVariables(theme).styles}
                />
            </Card>
        </FitFullscreen>
    )
}

export default View
