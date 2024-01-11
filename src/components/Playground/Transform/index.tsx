import React from 'react'
import MonacoEditor from '@monaco-editor/react'
import { Loader } from 'esbuild-wasm'
import { useUpdatedEffect } from '@/util/hooks'
import { IFiles, IImportMap, ITheme } from '@/components/Playground/shared'
import Compiler from '@/components/Playground/compiler'
import { cssToJs, jsonToJs } from '@/components/Playground/files'
import { MonacoEditorConfig } from '@/components/Playground/CodeEditor/Editor/monacoConfig'
import { addReactImport } from '@/components/Playground/utils.ts'

interface OutputProps {
    files: IFiles
    selectedFileName: string
    theme?: ITheme
}

const Preview: React.FC<OutputProps> = ({ files, selectedFileName, theme }) => {
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

        compiler.current
            ?.compile(files, {
                imports: {
                    react: 'https://esm.sh/react@18.2.0',
                    'react-dom/client': 'https://esm.sh/react-dom@18.2.0'
                }
            })
            .then((r) => {
                console.log(r)
            })
    }

    useUpdatedEffect(() => {
        if (files[selectedFileName]) {
            try {
                const code = files[selectedFileName].value

                switch (files[selectedFileName].language) {
                    case 'typescript':
                        compile(code, 'tsx')
                        break
                    case 'javascript':
                        compile(code, 'jsx')
                        break
                    case 'css':
                        setCompileCode(cssToJs(files[selectedFileName]))
                        break
                    case 'json':
                        setCompileCode(jsonToJs(files[selectedFileName]))
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
    }, [files[selectedFileName]])

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
