import useStyles from '@/assets/css/pages/tools/source.style'
import { DATABASE_NO_RECORD_FOUND, DATABASE_SELECT_SUCCESS } from '@/constants/common.constants'
import { addExtraCssVariables, message } from '@/util/common'
import { getLoginStatus } from '@/util/auth'
import { navigateToRepository, navigateToSource } from '@/util/navigation'
import editorExtraLibs from '@/util/editorExtraLibs'
import { r_tool_detail } from '@/services/tool'
import FitFullscreen from '@/components/common/FitFullscreen'
import Card from '@/components/common/Card'
import Playground from '@/components/Playground'
import { IFiles } from '@/components/Playground/shared'
import { base64ToFiles } from '@/components/Playground/files'
import { AppContext } from '@/App'

const Source = () => {
    const { styles } = useStyles()
    const { isDarkMode } = useContext(AppContext)
    const navigate = useNavigate()
    const { username, toolId, ver } = useParams()
    const [searchParams] = useSearchParams({
        platform: import.meta.env.VITE_PLATFORM
    })
    const [isLoading, setIsLoading] = useState(false)
    const [files, setFiles] = useState<IFiles>({})
    const [selectedFileName, setSelectedFileName] = useState('')

    const render = (toolVo: ToolVo) => {
        try {
            setFiles(base64ToFiles(toolVo.source.data!))
            setSelectedFileName(toolVo.entryPoint)
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
            navigateToRepository(navigate)
            return
        }
        if (username !== '!' && ver) {
            navigateToSource(navigate, username!, toolId!, platform as Platform)
            return
        }
        if (username === '!' && !ver) {
            navigateToSource(navigate, '!', toolId!, platform as Platform, 'latest')
            return
        }
        getTool()
    }, [username, toolId, ver, searchParams])

    return (
        <FitFullscreen className={styles.root}>
            <Card className={styles.content}>
                <Playground.CodeEditor
                    isDarkMode={isDarkMode}
                    readonly
                    files={files}
                    selectedFileName={selectedFileName}
                    onSelectedFileChange={setSelectedFileName}
                    extraLibs={editorExtraLibs}
                    onEditorDidMount={(_, monaco) => addExtraCssVariables(monaco)}
                />
            </Card>
        </FitFullscreen>
    )
}

export default Source
