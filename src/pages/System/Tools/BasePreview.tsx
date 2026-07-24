import useStyles from '@/assets/css/pages/system/tools/base-preview.style'
import { DATABASE_NO_RECORD_FOUND, DATABASE_SELECT_SUCCESS } from '@/constants/common.constants'
import { message } from '@/util/common'
import { navigateToToolBase } from '@/util/navigation'
import editorExtraLibs from '@/util/editorExtraLibs'
import {
    addExtraCssVariables,
    formatToolBaseVersion,
    generateThemeCssVariables,
    removeUselessAttributes
} from '@/util/tool'
import { r_sys_tool_base_get_one } from '@/services/system'
import { r_tool_base_get_dist } from '@/services/tool'
import { AppContext } from '@/App'
import FitFullscreen from '@/components/common/FitFullscreen'
import Card from '@/components/common/Card'
import FlexBox from '@/components/common/FlexBox'
import LoadingMask from '@/components/common/LoadingMask'
import ToolBar from '@/components/tools/ToolBar'
import { sourceListToFileTree } from '@/components/Playground/files'
import CodeEditor from '@/components/Playground/CodeEditor'
import Render from '@/components/Playground/Output/Preview/Render'
import { usePlaygroundState } from '@/hooks/usePlaygroundState'

const { Text } = AntdTypography

const BaseEditor = () => {
    const { styles, theme } = useStyles()
    const { isDarkMode } = useContext(AppContext)
    const navigate = useNavigate()
    const { id, version } = useParams()
    const {
        init,
        fileTree,
        selectedFileKey,
        isReadonly,
        hasUnsavedChanges,
        setSelectedFileKey,
        listenOnError
    } = usePlaygroundState()
    const [layout, setLayout] = useState<'horizontal' | 'vertical'>(
        window.innerWidth > window.innerHeight ? 'horizontal' : 'vertical'
    )
    const [isLoading, setIsLoading] = useState(false)
    const [toolBaseData, setToolBaseData] = useState<ToolBaseWithSourceVo>()
    const [toolBaseWithDistData, setToolBaseWithDistData] = useState<ToolBaseWithDistVo>()

    useBeforeUnload(
        useCallback(
            (event) => {
                if (hasUnsavedChanges) {
                    event.preventDefault()
                    event.returnValue = ''
                }
            },
            [hasUnsavedChanges]
        ),
        { capture: true }
    )

    const getToolBase = () => {
        if (isLoading) {
            return
        }
        setIsLoading(true)
        void message.loading({ content: '加载中……', key: 'LOADING', duration: 0 })

        r_sys_tool_base_get_one(id!, Number(version))
            .then((res) => {
                const response = res.data
                switch (response.code) {
                    case DATABASE_SELECT_SUCCESS:
                        return response.data!
                    case DATABASE_NO_RECORD_FOUND:
                        message.error('未找到指定工具基板').then(() => {
                            navigateToToolBase(navigate)
                        })
                        throw Error()
                    default:
                        throw Error('载入工具基板失败，请稍后重试')
                }
            })
            .then((toolBaseVo) => {
                setToolBaseData(toolBaseVo)
                const fileTree = sourceListToFileTree(toolBaseVo.sources)
                init(fileTree, true, undefined, selectedFileKey)
                return r_tool_base_get_dist(id!, Number(version))
            })
            .then((res) => {
                const response = res.data
                switch (response.code) {
                    case DATABASE_SELECT_SUCCESS:
                        return response.data!
                    case DATABASE_NO_RECORD_FOUND:
                        message.error('未找到指定工具基板').then(() => {
                            navigateToToolBase(navigate)
                        })
                        throw Error()
                    default:
                        throw Error('载入工具基板失败，请稍后重试')
                }
            })
            .then((toolBaseVo) => {
                setToolBaseWithDistData(toolBaseVo)
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
        getToolBase()
    }, [id, version])

    useEffect(() => {
        const resizeListener = () => {
            setLayout(window.innerWidth > window.innerHeight ? 'horizontal' : 'vertical')
        }
        window.addEventListener('resize', resizeListener)

        return () => {
            window.removeEventListener('resize', resizeListener)
        }
    }, [])

    return (
        <>
            <FitFullscreen className={styles.root}>
                <LoadingMask hidden={!isLoading}>
                    <FlexBox className={styles.layout} direction={'vertical'}>
                        <ToolBar
                            title={`${toolBaseData?.name}${hasUnsavedChanges ? '*' : ''}`}
                            subtitle={
                                <>
                                    <AntdTag color={'blue'}>
                                        {`${toolBaseData?.platform.slice(0, 1)}${toolBaseData?.platform.slice(1).toLowerCase()}`}
                                    </AntdTag>
                                </>
                            }
                            onBack={() => navigateToToolBase(navigate)}
                        >
                            <span>
                                <Text strong>版本：</Text>
                                {toolBaseData && formatToolBaseVersion(toolBaseData?.version)}
                            </span>
                        </ToolBar>
                        <Card>
                            <AntdSplitter layout={layout}>
                                <AntdSplitter.Panel collapsible>
                                    <CodeEditor
                                        isDarkMode={isDarkMode}
                                        fileTree={fileTree}
                                        selectedFileKey={selectedFileKey}
                                        readonly={isReadonly}
                                        extraLibs={editorExtraLibs}
                                        onEditorDidMount={(_, monaco) =>
                                            addExtraCssVariables(monaco)
                                        }
                                        onSelectedFileChange={setSelectedFileKey}
                                        listenOnError={listenOnError}
                                    />
                                </AntdSplitter.Panel>
                                <AntdSplitter.Panel collapsible>
                                    {toolBaseWithDistData && (
                                        <div className={styles.renderBox}>
                                            <Render
                                                iframeKey={toolBaseWithDistData.id}
                                                compiledCode={toolBaseWithDistData.dist.fileContent}
                                                globalJsVariables={{
                                                    OxygenTheme: {
                                                        ...removeUselessAttributes(theme),
                                                        isDarkMode
                                                    }
                                                }}
                                                globalCssVariables={
                                                    generateThemeCssVariables(theme).styles
                                                }
                                            />
                                        </div>
                                    )}
                                </AntdSplitter.Panel>
                            </AntdSplitter>
                        </Card>
                    </FlexBox>
                </LoadingMask>
            </FitFullscreen>
        </>
    )
}

export default BaseEditor
