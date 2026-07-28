import useStyles from '@/assets/css/pages/system/tools/execute.style'
import { DATABASE_NO_RECORD_FOUND, DATABASE_SELECT_SUCCESS } from '@/constants/common.constants'
import { checkDesktop, message, setPageFavicon, setPageTitle } from '@/util/common'
import { navigateToCode, navigateToTools } from '@/util/navigation'
import {
    formatToolBaseVersion,
    generateThemeCssVariables,
    processBaseDist,
    removeUselessAttributes
} from '@/util/tool'
import { r_sys_tool_get_one } from '@/services/system'
import { AppContext } from '@/App'
import FitFullscreen from '@/components/common/FitFullscreen'
import Card from '@/components/common/Card'
import LoadingMask from '@/components/common/LoadingMask'
import FlexBox from '@/components/common/FlexBox'
import ToolBar from '@/components/tools/ToolBar'
import Compiler from '@/components/Playground/compiler'
import { getImportMap, sourceListToFileTree } from '@/components/Playground/files'
import Render from '@/components/Playground/Output/Preview/Render'

const { Text } = AntdTypography

const Execute = () => {
    const { styles, theme } = useStyles()
    const { isDarkMode } = useContext(AppContext)
    const navigate = useNavigate()
    const { id } = useParams()
    const [isLoading, setIsLoading] = useState(false)
    const [toolData, setToolData] = useState<ToolWithSourceVo>()
    const [compiledCode, setCompiledCode] = useState('')

    const render = (toolVo: ToolWithSourceVo, toolBaseVo: ToolBaseWithDistVo) => {
        setPageFavicon(`data:image/svg+xml;base64,${toolVo.icon}`)
        setPageTitle(toolVo.name)
        switch (toolVo.platform) {
            case 'ANDROID':
            case 'DESKTOP':
                if (!checkDesktop()) {
                    message.warning('此应用需要桌面端环境，请在桌面端打开').then(() => {
                        navigateToTools(navigate)
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
    }

    const getTool = () => {
        if (isLoading) {
            return
        }
        setIsLoading(true)
        void message.loading({ content: '加载中……', key: 'LOADING', duration: 0 })

        r_sys_tool_get_one(id!)
            .then((res) => {
                const response = res.data
                switch (response.code) {
                    case DATABASE_SELECT_SUCCESS:
                        return response.data!
                    case DATABASE_NO_RECORD_FOUND:
                        message.error('未找到指定工具').then(() => {
                            navigateToTools(navigate)
                        })
                        throw Error()
                    default:
                        throw Error('获取工具信息失败，请稍后重试')
                }
            })
            .then((toolVo) => processBaseDist(toolVo.base.id, toolVo.base.version, { toolVo }))
            .then(({ toolVo, toolBaseVo }) => {
                setToolData(toolVo)
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
        getTool()
    }, [id])

    return (
        <FitFullscreen className={styles.root}>
            <LoadingMask hidden={!isLoading}>
                <FlexBox className={styles.layout} direction={'vertical'}>
                    <ToolBar
                        title={toolData?.name}
                        subtitle={
                            <AntdTag color={'blue'}>
                                {`${toolData?.platform.slice(0, 1)}${toolData?.platform.slice(1).toLowerCase()}`}
                            </AntdTag>
                        }
                        onBack={() => navigateToCode(navigate, id!)}
                    >
                        <span>
                            <Text strong>版本：</Text>
                            {toolData && toolData.ver}
                        </span>
                        <span>
                            <Text strong>基板：</Text>
                            <AntdSpace>
                                {toolData?.base.name}
                                {toolData && formatToolBaseVersion(toolData?.base.version)}
                            </AntdSpace>
                        </span>
                    </ToolBar>
                    <Card>
                        <Render
                            iframeKey={`${id}`}
                            compiledCode={compiledCode}
                            globalJsVariables={{
                                OxygenTheme: { ...removeUselessAttributes(theme), isDarkMode }
                            }}
                            globalCssVariables={generateThemeCssVariables(theme).styles}
                        />
                    </Card>
                </FlexBox>
            </LoadingMask>
        </FitFullscreen>
    )
}

export default Execute
