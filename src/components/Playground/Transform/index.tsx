import React from 'react'
import MonacoEditor from '@monaco-editor/react'
import { Loader } from 'esbuild-wasm'
import { useUpdatedEffect } from '@/util/hooks'
import { IFile, ITheme } from '@/components/Playground/shared'
import Compiler from '@/components/Playground/compiler'
import { cssToJs, jsonToJs } from '@/components/Playground/files'
import { MonacoEditorConfig } from '@/components/Playground/CodeEditor/Editor/monacoConfig'
import { addReactImport } from '@/components/Playground/utils'

interface OutputProps {
    file: IFile
    theme?: ITheme
}

const Transform: React.FC<OutputProps> = ({ file, theme }) => {
    const [compiledCode, setCompiledCode] = useState('')

    const compile = (code: string, loader: Loader) => {
        let _code = code
        if (['jsx', 'tsx'].includes(loader)) {
            _code = addReactImport(code)
        }

        Compiler?.transform(_code, loader)
            .then((value) => {
                setCompiledCode(value.code)
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
                        setCompiledCode(cssToJs(file))
                        break
                    case 'json':
                        setCompiledCode(jsonToJs(file))
                        break
                    case 'xml':
                        setCompiledCode(code)
                }
            } catch (e) {
                console.log(e)
                setCompiledCode('')
            }
        } else {
            setCompiledCode('')
        }
    }, [file, Compiler])

    return (
        <>
            <MonacoEditor
                theme={theme}
                language={'javascript'}
                value={compiledCode}
                options={{ ...MonacoEditorConfig, readOnly: true }}
            />
        </>
    )
}

export default Transform
