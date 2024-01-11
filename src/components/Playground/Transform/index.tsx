import React from 'react'
import MonacoEditor from '@monaco-editor/react'
import { Loader } from 'esbuild-wasm'
import { useUpdatedEffect } from '@/util/hooks'
import { IFile, ITheme } from '@/components/Playground/shared'
import Compiler from '@/components/Playground/compiler'
import { cssToJs, jsonToJs } from '@/components/Playground/files'
import { MonacoEditorConfig } from '@/components/Playground/CodeEditor/Editor/monacoConfig'
import { addReactImport } from '@/components/Playground/utils.ts'

interface OutputProps {
    file: IFile
    theme?: ITheme
}

const Preview: React.FC<OutputProps> = ({ file, theme }) => {
    const compiler = useRef<Compiler>()
    const [compileCode, setCompileCode] = useState('')

    useUpdatedEffect(() => {
        if (!compiler.current) {
            compiler.current = new Compiler()
        }
    }, [])

    const compile = (code: string, loader: Loader) => {
        let _code = code
        if (['jsx', 'tsx'].includes(loader)) {
            _code = addReactImport(code)
        }

        compiler.current
            ?.transform(_code, loader)
            .then((value) => {
                setCompileCode(value.code)
            })
            .catch((e) => {
                console.error('编译失败', e)
            })
    }

    useUpdatedEffect(() => {
        if (file) {
            try {
                const code = file.value

                switch (file.language) {
                    case 'typescript':
                        compile(code, 'tsx')
                        break
                    case 'javascript':
                        compile(code, 'jsx')
                        break
                    case 'css':
                        setCompileCode(cssToJs(file))
                        break
                    case 'json':
                        setCompileCode(jsonToJs(file))
                        break
                    case 'xml':
                        setCompileCode(code)
                }
            } catch (e) {
                setCompileCode('')
            }
        } else {
            setCompileCode('')
        }
    }, [file])

    return (
        <>
            <MonacoEditor
                theme={theme}
                language={'javascript'}
                value={compileCode}
                options={{ ...MonacoEditorConfig, readOnly: false }}
            />
        </>
    )
}

export default Preview
