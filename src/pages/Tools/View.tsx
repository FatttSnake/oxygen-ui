import useStyles from '@/assets/css/pages/tools/view.style'
import { DATABASE_NO_RECORD_FOUND, DATABASE_SELECT_SUCCESS } from '@/constants/common.constants'
import { checkDesktop, message } from '@/util/common'
import { getLoginStatus } from '@/util/auth'
import { navigateToRepository, navigateToRoot, navigateToView } from '@/util/navigation'
import { r_tool_detail } from '@/services/tool'
import compiler from '@/components/Playground/compiler'
import { IImportMap } from '@/components/Playground/shared'
import { base64ToFiles, base64ToStr, IMPORT_MAP_FILE_NAME } from '@/components/Playground/files'
import FitFullscreen from '@/components/common/FitFullscreen'
import Playground from '@/components/Playground'
import Card from '@/components/common/Card'

const View = () => {
    const { styles } = useStyles()
    const navigate = useNavigate()
    const { username, toolId, ver } = useParams()
    const [searchParams] = useSearchParams({
        platform: import.meta.env.VITE_PLATFORM
    })
    const [isLoading, setIsLoading] = useState(false)
    const [compiledCode, setCompiledCode] = useState('')
    const [isMobileMode, setIsMobileMode] = useState(false)

    const render = (toolVo: ToolVo) => {
        switch (toolVo.platform) {
            case 'ANDROID':
                setIsMobileMode(true)
                break
            case 'DESKTOP':
                if (!checkDesktop()) {
                    message.warning('此应用需要桌面端环境，请在桌面端打开').then(() => {
                        navigateToRepository(navigate)
                    })
                    return
                }
        }
        if (username === '!') {
            try {
                const baseDist = base64ToStr(toolVo.base.dist.data!)
                const files = base64ToFiles(toolVo.source.data!)
                const importMap = JSON.parse(files[IMPORT_MAP_FILE_NAME].value) as IImportMap

                void compiler
                    .compile(files, importMap, toolVo.entryPoint)
                    .then((result) => {
                        const output = result.outputFiles[0].text
                        setCompiledCode('')
                        setTimeout(() => {
                            setCompiledCode(`(() => {${output}})();\n(() => {${baseDist}})();`)
                        }, 100)
                    })
                    .catch((reason) => {
                        void message.error(`编译失败：${reason}`)
                    })
            } catch (e) {
                void message.error('载入工具失败')
            }
        } else {
            try {
                const baseDist = base64ToStr(toolVo.base.dist.data!)
                const dist = base64ToStr(toolVo.dist.data!)
                setCompiledCode('')
                setTimeout(() => {
                    setCompiledCode(`(() => {${dist}})();\n(() => {${baseDist}})();`)
                }, 100)
            } catch (e) {
                void message.error('载入工具失败')
            }
        }
    }

    const getTool = () => {
        if (isLoading) {
            return
        }
        setIsLoading(true)
        void message.loading({ content: '加载中……', key: 'LOADING', duration: 0 })

        void r_tool_detail(
            username!,
            toolId!,
            ver || 'latest',
            searchParams.get('platform') as Platform
        )
            .then((res) => {
                const response = res.data
                switch (response.code) {
                    case DATABASE_SELECT_SUCCESS:
                        render(response.data!)
                        break
                    case DATABASE_NO_RECORD_FOUND:
                        void message.error('未找到指定工具').then(() => {
                            navigateToRepository(navigate)
                        })
                        break
                    default:
                        void message.error('获取工具信息失败，请稍后重试')
                }
            })
            .finally(() => {
                setIsLoading(false)
                message.destroy('LOADING')
            })
    }

    useEffect(() => {
        const platform = searchParams.get('platform')!
        if (!['WEB', 'DESKTOP', 'ANDROID'].includes(platform)) {
            navigateToRepository(navigate)
            return
        }
        if (username === '!' && !getLoginStatus()) {
            void message.error('未登录').then(() => {
                navigateToRoot(navigate)
            })
            return
        }
        if (username !== '!' && ver) {
            navigateToView(navigate, username!, toolId!, platform as Platform)
            return
        }
        if (username === '!' && !ver) {
            navigateToView(navigate, '!', toolId!, platform as Platform, 'latest')
            return
        }
        getTool()
    }, [username, toolId, ver, searchParams])

    return (
        <FitFullscreen className={styles.root}>
            <Card className={styles.content}>
                <Playground.Output.Preview.Render
                    iframeKey={`${username}:${toolId}:${ver}`}
                    compiledCode={compiledCode}
                    mobileMode={isMobileMode}
                />
            </Card>
        </FitFullscreen>
    )
}

export default View
