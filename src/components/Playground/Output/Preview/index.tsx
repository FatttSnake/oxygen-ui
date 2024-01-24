import '@/components/Playground/Output/Preview/preview.scss'
import { IFiles, IImportMap } from '@/components/Playground/shared'
import Compiler from '@/components/Playground/compiler'
import { ENTRY_FILE_NAME } from '@/components/Playground/files'
import Render from '@/components/Playground/Output/Preview/Render'

interface PreviewProps {
    iframeKey: string
    files: IFiles
    importMap: IImportMap
}

const Preview = ({ iframeKey, files, importMap }: PreviewProps) => {
    const [errorMsg, setErrorMsg] = useState('')
    const [compiledCode, setCompiledCode] = useState('')

    const handleOnError = (errorMsg: string) => {
        setErrorMsg(errorMsg)
    }

    useEffect(() => {
        Compiler.compile(files, importMap, [ENTRY_FILE_NAME])
            .then((result) => {
                setCompiledCode(result.outputFiles[0].text)
            })
            .catch((e: Error) => {
                setErrorMsg(`编译失败：${e.message}`)
            })
    }, [files, Compiler])

    return (
        <div data-component={'playground-preview'}>
            <Render iframeKey={iframeKey} compiledCode={compiledCode} onError={handleOnError} />
            {errorMsg && <div className={'playground-error-message'}>{errorMsg}</div>}
        </div>
    )
}

export default Preview
