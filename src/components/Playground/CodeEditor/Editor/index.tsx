import React from 'react'
import { editor, Selection } from 'monaco-editor'
import MonacoEditor, { Monaco } from '@monaco-editor/react'
import '@/components/Playground/CodeEditor/Editor/editor.scss'
import '@/components/Playground/CodeEditor/Editor/loader'
import { IEditorOptions, IFiles, ITheme } from '@/components/Playground/shared'
import { fileNameToLanguage } from '@/components/Playground/files'
import { useEditor, useTypesProgress } from '@/components/Playground/CodeEditor/Editor/hooks'
import { MonacoEditorConfig } from '@/components/Playground/CodeEditor/Editor/monacoConfig'

interface EditorProps {
    files?: IFiles
    selectedFileName?: string
    readonly?: boolean
    onChange?: (code: string | undefined) => void
    options?: IEditorOptions
    theme?: ITheme
    onJumpFile?: (fileName: string) => void
}

const Editor: React.FC<EditorProps> = ({
    files = {},
    selectedFileName = '',
    readonly,
    theme,
    onChange,
    options,
    onJumpFile
}) => {
    const editorRef = useRef<editor.IStandaloneCodeEditor>()
    const { doOpenEditor, loadJsxSyntaxHighlight, autoLoadExtraLib } = useEditor()
    const jsxSyntaxHighlightRef = useRef<{
        highlighter: (code?: string | undefined) => void
        dispose: () => void
    }>({
        highlighter: () => undefined,
        dispose: () => undefined
    })
    const { total, finished, onWatch } = useTypesProgress()
    const file = files[selectedFileName] || { name: 'Untitled' }

    const handleOnEditorDidMount = (editor: editor.IStandaloneCodeEditor, monaco: Monaco) => {
        editorRef.current = editor
        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
            void editor.getAction('editor.action.formatDocument')?.run()
        })

        monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
            jsx: monaco.languages.typescript.JsxEmit.Preserve,
            esModuleInterop: true
        })

        files &&
            Object.entries(files).forEach(([key]) => {
                if (!monaco.editor.getModel(monaco.Uri.parse(`file:///${key}`))) {
                    monaco.editor.createModel(
                        files[key].value,
                        fileNameToLanguage(key),
                        monaco.Uri.parse(`file:///${key}`)
                    )
                }
            })

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        editor['_codeEditorService'].doOpenEditor = function (
            editor: editor.IStandaloneCodeEditor,
            input: { options: { selection: Selection }; resource: { path: string } }
        ) {
            const path = input.resource.path
            if (!path.startsWith('/node_modules/')) {
                onJumpFile?.(path.replace('/', ''))
                doOpenEditor(editor, input)
            }
        }

        jsxSyntaxHighlightRef.current = loadJsxSyntaxHighlight(editor, monaco)

        void autoLoadExtraLib(editor, monaco, file.value, onWatch)
    }

    useEffect(() => {
        editorRef.current?.focus()
        jsxSyntaxHighlightRef?.current?.highlighter?.()
    }, [file.name])

    return (
        <>
            <div data-component={'playground-code-editor-editor'}>
                <MonacoEditor
                    theme={theme}
                    path={file.name}
                    className={`monaco-editor-${theme ?? 'light'}`}
                    language={file.language}
                    value={file.value}
                    onChange={onChange}
                    onMount={handleOnEditorDidMount}
                    options={{
                        ...MonacoEditorConfig,
                        ...options,
                        theme: undefined,
                        readOnly: readonly
                    }}
                />
                {total > 0 && !finished && <div className={'playground-code-editor-loading'} />}
            </div>
        </>
    )
}

export default Editor
