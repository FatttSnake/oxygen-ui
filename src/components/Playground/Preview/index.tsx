import React, { useRef, useState } from 'react'
import { IFiles } from '@/components/Playground/shared'
import iframeRaw from '@/components/Playground/Preview/iframe.html?raw'
import { useUpdatedEffect } from '@/util/hooks'
import { IMPORT_MAP_FILE_NAME } from '@/components/Playground/files'
import Compiler from '@/components/Playground/compiler'
import '@/components/Playground/Preview/preview.scss'

interface PreviewProps {
    iframeKey: string
    files: IFiles
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

const Preview: React.FC<PreviewProps> = ({ iframeKey, files }) => {
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
            default:
                setErrorMsg('')
        }
    }

    useEffect(() => {
        console.error(errorMsg)
    }, [errorMsg])

    useUpdatedEffect(() => {
        window.addEventListener('message', handleMessage)

        return () => {
            window.removeEventListener('message', handleMessage)
        }
    }, [])

    useUpdatedEffect(() => {
        Compiler.compile(files, JSON.parse(files[IMPORT_MAP_FILE_NAME].value))
            .then((result) => {
                if (loaded) {
                    iframeRef.current?.contentWindow?.postMessage({
                        type: 'UPDATE',
                        data: { compiledCode: result.outputFiles[0].text }
                    } as IMessage)
                }
            })
            .catch((e) => {
                setErrorMsg(e)
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
        </div>
    )
}

export default Preview
