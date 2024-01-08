import React from 'react'
import { editor } from 'monaco-editor'

export type ILanguage = 'javascript' | 'typescript' | 'json' | 'css' | 'xml'

export interface IFile {
    name: string
    value: string
    language: ILanguage
    active?: boolean
    hidden?: boolean
}

export interface IFiles {
    [key: string]: IFile
}

export type ITheme = 'light' | 'vs-dark'

export type IImportMap = { imports: Record<string, string> }

export interface ICustomFiles {
    [key: string]:
        | string
        | {
              code: string
              active?: boolean
              hidden?: boolean
          }
}
export type IEditorOptions = editor.IStandaloneEditorConstructionOptions
export interface IEditorContainer {
    showFileSelector?: boolean
    fileSelectorReadOnly?: boolean
    options?: IEditorOptions
}

export interface IOutput {
    showCompileOutput?: boolean
}

export interface ISplitPane {
    children?: React.ReactNode[]
    defaultSizes?: number[]
}

export type IPlayground = {
    width?: string | number
    height?: string | number
    theme?: ITheme
    importMap?: IImportMap
    files?: ICustomFiles
    options?: {
        lineNumbers?: boolean
        fontSize?: number
        tabSize?: number
    }
    showHeader?: boolean
    border?: boolean
    onFilesChange?: (url: string) => void
    saveOnUrl?: boolean
    autorun?: boolean
    // recompileDelay
} & Omit<IEditorContainer, 'options'> &
    IOutput &
    ISplitPane

export interface IPlaygroundContext {
    files: IFiles
    filesHash: string
    theme: ITheme
    selectedFileName: string
    setSelectedFileName: (fileName: string) => void
    setTheme: (theme: ITheme) => void
    setFiles: (files: IFiles) => void
    addFile: (fileName: string) => void
    removeFile: (fileName: string) => void
    changeFileName: (oldFieldName: string, newFieldName: string) => void
    changeTheme: (theme: ITheme) => void
}
