import React, { useRef, useState } from 'react'
import { IFiles } from '@/components/Playground/shared.ts'
import { useUpdatedEffect } from '@/util/hooks.tsx'
import Compiler from '@/components/Playground/compiler.ts'
import { Loader } from 'esbuild-wasm'
import { cssToJs, jsonToJs } from '@/components/Playground/files.ts'

interface OutputProps {
    files: IFiles
}

const Preview: React.FC<OutputProps> = ({ files }) => {
    const compiler = useRef<Compiler>()
    const [compileCode, setCompileCode] = useState('')
    const [fileName, setFileName] = useState('main.tsx')

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFileName(e.target.value)
    }

    useUpdatedEffect(() => {
        if (!compiler.current) {
            compiler.current = new Compiler()
        }
    }, [])

    useUpdatedEffect(() => {
        if (files[fileName]) {
            try {
                const file = files[fileName]

                let loader: Loader
                let code = file.value

                switch (file.language) {
                    case 'typescript':
                        loader = 'tsx'
                        break
                    case 'javascript':
                        loader = 'jsx'
                        break
                    case 'css':
                        code = cssToJs(file)
                        loader = 'js'
                        break
                    case 'json':
                        code = jsonToJs(file)
                        loader = 'js'
                        break
                    case 'xml':
                        loader = 'default'
                }

                compiler.current
                    ?.transform(code, loader)
                    .then((value) => {
                        setCompileCode(value.code)
                    })
                    .catch((e) => {
                        console.error('编译失败', e)
                    })
            } catch (e) {
                setCompileCode('')
            }
        } else {
            setCompileCode('')
        }
    }, [fileName, files])

    return (
        <>
            <AntdInput.TextArea value={compileCode} />
            <AntdInput value={fileName} onChange={handleOnChange} />
        </>
    )
}

export default Preview
