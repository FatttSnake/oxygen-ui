import useStyles from '@/assets/css/pages/system/tools/execute.style'
import { DATABASE_NO_RECORD_FOUND, DATABASE_SELECT_SUCCESS } from '@/constants/common.constants'
import {
    checkDesktop,
    generateThemeCssVariables,
    message,
    removeUselessAttributes
} from '@/util/common'
import { navigateToTools } from '@/util/navigation'
import { r_sys_tool_get_one } from '@/services/system'
import { AppContext } from '@/App'
import FitFullscreen from '@/components/common/FitFullscreen'
import Card from '@/components/common/Card'
import Playground from '@/components/Playground'
import compiler from '@/components/Playground/compiler'
import { IImportMap } from '@/components/Playground/shared'
import { base64ToFiles, base64ToStr, IMPORT_MAP_FILE_NAME } from '@/components/Playground/files'

const Execute = () => {
    const { styles, theme } = useStyles()
    const { isDarkMode } = useContext(AppContext)
    const navigate = useNavigate()
    const { id } = useParams()
    const [isLoading, setIsLoading] = useState(false)
    const [compiledCode, setCompiledCode] = useState('')
    const [isMobileMode, setIsMobileMode] = useState(false)

    const render = (toolVo: ToolVo) => {
        try {
            switch (toolVo.platform) {
                case 'ANDROID':
                    setIsMobileMode(true)
                    break
                case 'DESKTOP':
                    if (!checkDesktop()) {
                        message.warning('此应用需要桌面端环境，请在桌面端打开').then(() => {
                            navigateToTools(navigate)
                        })
                        return
                    }
            }

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
    }

    const getTool = () => {
        if (isLoading) {
            return
        }
        setIsLoading(true)
        void message.loading({ content: '加载中……', key: 'LOADING', duration: 0 })

        void r_sys_tool_get_one(id!)
            .then((res) => {
                const response = res.data
                switch (response.code) {
                    case DATABASE_SELECT_SUCCESS:
                        render(response.data!)
                        break
                    case DATABASE_NO_RECORD_FOUND:
                        message.error('未找到指定工具').then(() => {
                            navigateToTools(navigate)
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
        getTool()
    }, [id])

    return (
        <FitFullscreen className={styles.root}>
            <Card className={styles.rootBox}>
                <Playground.Output.Preview.Render
                    iframeKey={`${id}`}
                    compiledCode={compiledCode}
                    mobileMode={isMobileMode}
                    globalJsVariables={{
                        OxygenTheme: { ...removeUselessAttributes(theme), isDarkMode }
                    }}
                    globalCssVariables={generateThemeCssVariables(theme).styles}
                />
            </Card>
        </FitFullscreen>
    )
}

export default Execute
