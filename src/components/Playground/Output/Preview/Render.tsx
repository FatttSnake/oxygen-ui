import '@/components/Playground/Output/Preview/render.scss'
import iframeRaw from '@/components/Playground/Output/Preview/iframe.html?raw'

interface RenderProps {
    iframeKey: string
    compiledCode: string
    onError?: (errorMsg: string) => void
}

interface IMessage {
    type: 'LOADED' | 'ERROR' | 'UPDATE' | 'DONE'
    msg: string
    data: {
        compiledCode: string
    }
}

const getIframeUrl = (iframeRaw: string) => {
    const shimsUrl = '//unpkg.com/es-module-shims/dist/es-module-shims.js'
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

const Render = ({ iframeKey, compiledCode, onError }: RenderProps) => {
    const iframeRef = useRef<HTMLIFrameElement>(null)
    const [loaded, setLoaded] = useState(false)

    const handleMessage = ({ data }: { data: IMessage }) => {
        const { type, msg } = data
        switch (type) {
            case 'LOADED':
                setLoaded(true)
                break
            case 'ERROR':
                onError?.(msg)
                break
            case 'DONE':
                onError?.('')
        }
    }

    useEffect(() => {
        window.addEventListener('message', handleMessage)

        return () => {
            window.removeEventListener('message', handleMessage)
        }
    }, [])

    useEffect(() => {
        if (loaded) {
            iframeRef.current?.contentWindow?.postMessage({
                type: 'UPDATE',
                data: { compiledCode }
            } as IMessage)
        }
    }, [compiledCode, loaded])

    return (
        <iframe
            data-component={'playground-output-preview-render'}
            key={iframeKey}
            ref={iframeRef}
            src={iframeUrl}
            sandbox="allow-popups-to-escape-sandbox allow-scripts allow-popups allow-forms allow-pointer-lock allow-top-navigation allow-modals allow-same-origin"
        />
    )
}

export default Render
