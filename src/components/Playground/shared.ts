import { editor } from 'monaco-editor'

export type ILanguage = 'javascript' | 'typescript' | 'json' | 'css' | 'xml'

export interface IFile {
    name: string
    value: string
    language: ILanguage
    hidden?: boolean
}

export interface IFiles {
    [key: string]: IFile
}

export type ITheme = 'light' | 'vs-dark'

export type IEditorOptions = editor.IStandaloneEditorConstructionOptions
