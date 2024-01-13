import { useUpdatedEffect } from '@/util/hooks'
import '@/components/Playground/Output/Preview/preview.scss'
import { IFiles, IImportMap } from '@/components/Playground/shared'
import Compiler from '@/components/Playground/compiler'
import iframeRaw from '@/components/Playground/Output/Preview/iframe.html?raw'

interface PreviewProps {
    iframeKey: string
    files: IFiles
    importMap: IImportMap
}

interface IMessage {
    type: 'LOADED' | 'ERROR' | 'UPDATE' | 'DONE'
    msg: string
    data: {
        compiledCode: string
    }
}

const getIframeUrl = (iframeRaw: string) => {
    const shimsUrl = '//unpkg.com/es-module-shims@1.8.0/dist/es-module-shims.js'
    // 判断浏览器是否支持esm ，不支持esm就引入es-module-shims
    const newIframeRaw =
        typeof import.meta === 'undefined'
            ? iframeRaw.replace(
                  '<!-- es-module-shims -->',
                  `<script async src="${shimsUrl}"></script>`
              )
            : iframeRaw
    return URL.createObjectURL(new Blob([newIframeRaw], { type: 'text/html' }))
}

const iframeUrl = getIframeUrl(iframeRaw)

const Preview = ({ iframeKey, files, importMap }: PreviewProps) => {
    const iframeRef = useRef<HTMLIFrameElement>(null)
    const [errorMsg, setErrorMsg] = useState('')
    const [loaded, setLoaded] = useState(false)

    const handleMessage = ({ data }: { data: IMessage }) => {
        const { type, msg } = data
        switch (type) {
            case 'LOADED':
                setLoaded(true)
                break
            case 'ERROR':
                setErrorMsg(msg)
                break
            case 'DONE':
                setErrorMsg('')
        }
    }

    useUpdatedEffect(() => {
        window.addEventListener('message', handleMessage)

        return () => {
            window.removeEventListener('message', handleMessage)
        }
    }, [])

    useUpdatedEffect(() => {
        Compiler.compile(files, importMap)
            .then((result) => {
                if (loaded) {
                    iframeRef.current?.contentWindow?.postMessage({
                        type: 'UPDATE',
                        data: { compiledCode: result.outputFiles[0].text }
                    } as IMessage)
                }
            })
            .catch((e) => {
                setErrorMsg(`编译失败：${e.message}`)
            })
    }, [files, Compiler, loaded])

    return (
        <div data-component={'playground-preview'}>
            <iframe
                key={iframeKey}
                ref={iframeRef}
                src={iframeUrl}
                sandbox="allow-popups-to-escape-sandbox allow-scripts allow-popups allow-forms allow-pointer-lock allow-top-navigation allow-modals allow-same-origin"
            />
            {errorMsg && <div className={'playground-error-message'}>{errorMsg}</div>}
        </div>
    )
}

export default Preview
