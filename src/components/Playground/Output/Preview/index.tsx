import { ReactNode } from 'react'
import useStyles from '@/assets/css/components/playground/output/preview.style'
import { IFileTree } from '@/components/Playground/shared'
import { getImportMap } from '@/components/Playground/files'
import Compiler, { handleBuildError } from '@/components/Playground/compiler'
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
    const [errorMsg, setErrorMsg] = useState<ReactNode>(undefined)
    const [processMsg, setProcessMsg] = useState('')
    const [compiledCode, setCompiledCode] = useState('')
    const abortRef = useRef<AbortController | null>(null)

    useEffect(() => {
        if (!entryPointPath) {
            setErrorMsg('未配置 Entry Point')
            return
        }

        abortRef.current?.abort()
        const controller = new AbortController()
        abortRef.current = controller

        const timer = setTimeout(() => {
            try {
                const importMap = getImportMap(fileTree)
                Compiler.compile(
                    fileTree,
                    importMap,
                    entryPointPath,
                    (state, message) => setProcessMsg(state === 'processing' ? message : ''),
                    controller.signal
                )
                    .then((result) => {
                        if (controller.signal.aborted) {
                            return
                        }

                        setCompiledCode(
                            `(()=>{${preExpansionCode}})();\n(()=>{${result.outputFiles[0].text}})();\n(()=>{${postExpansionCode}})();`
                        )
                        setErrorMsg(undefined)
                    })
                    .catch((e: Error) => {
                        if (controller.signal.aborted) {
                            return
                        }

                        const formattedError = handleBuildError(e)
                        console.error(formattedError)
                        setErrorMsg(`编译失败：${formattedError}`)
                    })
            } catch (e) {
                setErrorMsg('非法 Import Map')
            }
        }, 500)

        return () => {
            clearTimeout(timer)
            controller.abort()
        }
    }, [Compiler, fileTree, entryPointPath])

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
