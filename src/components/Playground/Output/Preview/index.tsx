import useStyles from '@/assets/css/components/playground/output/preview.style'
import { IFileTree } from '@/components/Playground/shared'
import { getImportMap } from '@/components/Playground/files'
import compiler from '@/components/Playground/compiler'
import Render from '@/components/Playground/Output/Preview/Render'

interface PreviewProps {
    iframeKey: string
    fileTree: IFileTree
    entryPointPath?: string
    preExpansionCode?: string
    postExpansionCode?: string
    globalJsVariables?: Record<string, unknown>
    globalCssVariables?: string
}

const Preview = ({
    iframeKey,
    fileTree,
    entryPointPath,
    preExpansionCode = '',
    postExpansionCode = '',
    globalJsVariables,
    globalCssVariables
}: PreviewProps) => {
    const { styles } = useStyles()
    const [errorMsg, setErrorMsg] = useState('')
    const [processMsg, setProcessMsg] = useState('')
    const [compiledCode, setCompiledCode] = useState('')

    useEffect(() => {
        if (!entryPointPath) {
            setErrorMsg('未配置 Entry Point')
            return
        }

        try {
            const importMap = getImportMap(fileTree)
            compiler
                .compile(fileTree, importMap, entryPointPath, (state, message) =>
                    setProcessMsg(state === 'processing' ? message : '')
                )
                .then((result) => {
                    setCompiledCode(
                        `(()=>{${preExpansionCode}})();\n(()=>{${result.outputFiles[0].text}})();\n(()=>{${postExpansionCode}})();`
                    )
                    setErrorMsg('')
                })
                .catch((e: Error) => {
                    console.error(e)
                    setErrorMsg(`编译失败：${e.message}`)
                })
        } catch (e) {
            setErrorMsg('非法 Import Map')
        }
    }, [compiler, fileTree, entryPointPath])

    return (
        <div className={styles.root}>
            <Render
                iframeKey={iframeKey}
                compiledCode={compiledCode}
                globalJsVariables={globalJsVariables}
                globalCssVariables={globalCssVariables}
            />
            {processMsg && <div className={styles.processMessage}>{processMsg}</div>}
            {errorMsg && <div className={styles.errorMessage}>{errorMsg}</div>}
        </div>
    )
}

Preview.Render = Render

export default Preview
