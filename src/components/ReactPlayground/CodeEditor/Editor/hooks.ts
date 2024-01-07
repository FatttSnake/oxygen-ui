import { editor, IPosition, Selection } from 'monaco-editor'
import ScrollType = editor.ScrollType
import { Monaco } from '@monaco-editor/react'
import { getWorker, MonacoJsxSyntaxHighlight } from 'monaco-jsx-syntax-highlight'
import { createATA } from '@/components/ReactPlayground/CodeEditor/Editor/ata.ts'

export const useEditor = () => {
    const doOpenEditor = (
        editor: editor.IStandaloneCodeEditor,
        input: { options: { selection: Selection } }
    ) => {
        const selection = input.options ? input.options.selection : null
        if (selection) {
            if (
                typeof selection.endLineNumber === 'number' &&
                typeof selection.endColumn === 'number'
            ) {
                editor.setSelection(selection)
                editor.revealRangeInCenter(selection, ScrollType.Immediate)
            } else {
                const position: IPosition = {
                    lineNumber: selection.startLineNumber,
                    column: selection.startColumn
                }
                editor.setPosition(position)
                editor.revealPositionInCenter(position, ScrollType.Immediate)
            }
        }
    }

    const loadJsxSyntaxHighlight = (editor: editor.IStandaloneCodeEditor, monaco: Monaco) => {
        const monacoJsxSyntaxHighlight = new MonacoJsxSyntaxHighlight(getWorker(), monaco)
        const { highlighter, dispose } = monacoJsxSyntaxHighlight.highlighterBuilder({ editor })

        editor.onDidChangeModelContent(() => {
            highlighter()
        })
        highlighter()

        return { highlighter, dispose }
    }

    const autoLoadExtraLib = async (
        editor: editor.IStandaloneCodeEditor,
        monaco: Monaco,
        defaultValue: string,
        onWatch: any
    ) => {
        const typeHelper = await createATA()

        onWatch(typeHelper)

        editor.onDidChangeModelContent(() => {
            typeHelper.acquireType(editor.getValue())
        })

        const addLibraryToRuntime = (code: string, path: string) => {
            monaco.languages.typescript.typescriptDefaults.addExtraLib(code, `file://${path}`)
        }

        typeHelper.addListener('receivedFile', addLibraryToRuntime)
        typeHelper.acquireType(defaultValue)

        return typeHelper
    }

    return {
        doOpenEditor,
        loadJsxSyntaxHighlight,
        autoLoadExtraLib
    }
}
