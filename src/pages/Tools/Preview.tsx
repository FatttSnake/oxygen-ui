import useStyles from '@/assets/css/pages/tools/preview.style'
import { DATABASE_NO_RECORD_FOUND, DATABASE_SELECT_SUCCESS } from '@/constants/common.constants'
import { checkDesktop, message, setPageFavicon, setPageTitle } from '@/util/common'
import { getLoginStatus } from '@/util/auth'
import { navigateToRepository } from '@/util/navigation'
import { generateThemeCssVariables, processBaseDist, removeUselessAttributes } from '@/util/tool'
import { r_tool_get_source } from '@/services/tool'
import { AppContext } from '@/App'
import FitFullscreen from '@/components/common/FitFullscreen'
import Card from '@/components/common/Card'
import Compiler, { handleBuildError } from '@/components/Playground/compiler'
import { getImportMap, sourceListToFileTree } from '@/components/Playground/files'
import Render from '@/components/Playground/Output/Preview/Render'

const PreView = () => {
    const { styles, theme } = useStyles()
    const { isDarkMode } = useContext(AppContext)
    const navigate = useNavigate()
    const { toolId, ver } = useParams()
    const [searchParams] = useSearchParams({
        platform: import.meta.env.VITE_PLATFORM
    })
    const [isLoading, setIsLoading] = useState(false)
    const [compiledCode, setCompiledCode] = useState('')

    const render = (toolVo: ToolWithSourceVo, toolBaseVo: ToolBaseWithDistVo) => {
        setPageFavicon(`data:image/svg+xml;base64,${toolVo.icon}`)
        setPageTitle(toolVo.name)

        switch (toolVo.platform) {
            case 'ANDROID':
            case 'DESKTOP':
                if (!checkDesktop()) {
                    message.warning('此应用需要桌面端环境，请在桌面端打开').then(() => {
                        navigateToRepository(navigate)
                    })
                    return
                }
        }

        try {
            const baseDist = toolBaseVo.dist.fileContent
            const fileTree = sourceListToFileTree(toolVo.sources)
            const importMap = getImportMap(fileTree)

            Compiler.compile(fileTree, importMap, toolVo.entryPoint)
                .then((result) => {
                    const output = result.outputFiles[0].text
                    setCompiledCode(`(() => {${output}})();\n(() => {${baseDist}})();`)
                })
                .catch((e) => {
                    const formattedError = handleBuildError(e)
                    setCompiledCode(`(() => {
                            const errorText = ${JSON.stringify(formattedError)};
                            const element = document.createElement('div');
                            element.style.cssText = \`
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                color: #dc4446;
                                font-family: monospace;
                                padding: 20px;
                                white-space: pre-wrap;
                                word-break: break-word;
                                max-width: 100%;
                                overflow: auto;
                            \`;
                            element.textContent = errorText;
                            document.getElementById('root')?.replaceChildren(element);
                        })();`)
                })
        } catch (e) {
            void message.error('载入工具失败')
        }
    }

    const getTool = () => {
        if (isLoading) {
            return
        }
        setIsLoading(true)
        void message.loading({ content: '加载中……', key: 'LOADING', duration: 0 })

        r_tool_get_source('!', toolId!, ver || 'latest', searchParams.get('platform') as Platform)
            .then((res) => {
                const response = res.data
                switch (response.code) {
                    case DATABASE_SELECT_SUCCESS:
                        return response.data!
                    case DATABASE_NO_RECORD_FOUND:
                        message.error('未找到指定工具').then(() => {
                            navigateToRepository(navigate)
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
            navigateToRepository(navigate)
            return
        }
        if (!getLoginStatus()) {
            message.error('未登录').then(() => {
                navigateToRepository(navigate)
            })
            return
        }
        getTool()

        return () => {
            setPageFavicon()
        }
    }, [toolId, ver, searchParams])

    return (
        <FitFullscreen className={styles.root}>
            <Card className={styles.content}>
                <Render
                    iframeKey={`${toolId}:${ver}`}
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

export default PreView
