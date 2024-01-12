import React, { useState } from 'react'
import MonacoEditor from '@monaco-editor/react'
import { Loader } from 'esbuild-wasm'
import '@/components/Playground/Output/Transform/transform.scss'
import { useUpdatedEffect } from '@/util/hooks.tsx'
import { IFile, ITheme } from '@/components/Playground/shared.ts'
import Compiler from '@/components/Playground/compiler.ts'
import { cssToJs, jsonToJs } from '@/components/Playground/files.ts'
import { MonacoEditorConfig } from '@/components/Playground/CodeEditor/Editor/monacoConfig.ts'
import { addReactImport } from '@/components/Playground/utils.ts'

interface OutputProps {
    file: IFile
    theme?: ITheme
}

const Transform: React.FC<OutputProps> = ({ file, theme }) => {
    const [compiledCode, setCompiledCode] = useState('')
    const [errorMsg, setErrorMsg] = useState('')

    const compile = (code: string, loader: Loader) => {
        let _code = code
        if (['jsx', 'tsx'].includes(loader)) {
            _code = addReactImport(code)
        }

        Compiler?.transform(_code, loader)
            .then((value) => {
                setCompiledCode(value.code)
                setErrorMsg('')
            })
            .catch((e) => {
                setErrorMsg(`编译失败：${e.message}`)
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
        <div data-component={'playground-transform'}>
            <MonacoEditor
                theme={theme}
                language={'javascript'}
                value={compiledCode}
                options={{ ...MonacoEditorConfig, readOnly: true }}
            />
            {errorMsg && <div className={'playground-error-message'}>{errorMsg}</div>}
        </div>
    )
}

export default Transform
