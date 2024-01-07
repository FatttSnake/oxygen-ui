import React from 'react'
import { editor, Selection } from 'monaco-editor'
import MonacoEditor, { Monaco } from '@monaco-editor/react'
import '@/components/ReactPlayground/CodeEditor/Editor/editor.scss'
import { IEditorOptions, IFile, IFiles, ITheme } from '@/components/ReactPlayground/shared'
import { MonacoEditorConfig } from '@/components/ReactPlayground/CodeEditor/Editor/monacoConfig'
import { fileNameToLanguage } from '@/components/ReactPlayground/utils'
import { useEditor } from '@/components/ReactPlayground/CodeEditor/Editor/hooks'

interface EditorProps {
    file: IFile
    onChange?: (code: string | undefined) => void
    options?: IEditorOptions
    theme?: ITheme
    files?: IFiles
    onJumpFile?: (fileName: string) => void
}

const Editor: React.FC<EditorProps> = ({ file, files, theme, onChange, options, onJumpFile }) => {
    const editorRef = useRef<editor.IStandaloneCodeEditor>()
    const { doOpenEditor, loadJsxSyntaxHighlight } = useEditor()
    const jsxSyntaxHighlightRef = useRef<{
        highlighter: (code?: string | undefined) => void
        dispose: () => void
    }>({
        highlighter: () => undefined,
        dispose: () => undefined
    })

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
    }

    useEffect(() => {
        editorRef.current?.focus()
        jsxSyntaxHighlightRef?.current?.highlighter?.()
    }, [file.name])

    return (
        <>
            <MonacoEditor
                theme={theme}
                path={file.name}
                className={`monaco-editor-${theme ?? 'light'}`}
                language={file.language}
                value={file.value}
                onChange={onChange}
                onMount={handleOnEditorDidMount}
                options={{ ...MonacoEditorConfig, ...options, theme: undefined }}
            />
        </>
    )
}

export default Editor
