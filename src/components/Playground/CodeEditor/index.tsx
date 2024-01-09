import React from 'react'
import _ from 'lodash'
import '@/components/Playground/CodeEditor/code-editor.scss'
import { IEditorOptions, IFiles, ITheme } from '@/components/Playground/shared'
import { fileNameToLanguage } from '@/components/Playground/files'
import FileSelector from '@/components/Playground/CodeEditor/FileSelector'
import Editor from '@/components/Playground/CodeEditor/Editor'
import FlexBox from '@/components/common/FlexBox'

interface CodeEditorProps {
    theme?: ITheme
    files: IFiles
    readonly?: boolean
    readonlyFiles?: string[]
    notRemovable?: string[]
    selectedFileName: string
    options?: IEditorOptions
    onSelectedFileChange?: (fileName: string) => void
    onAddFile?: (fileName: string, files: IFiles) => void
    onRemoveFile?: (fileName: string, files: IFiles) => void
    onRenameFile?: (newFileName: string, oldFileName: string, files: IFiles) => void
    onChangeFileContent?: (content: string, fileName: string, files: IFiles) => void
    onError?: (msg: string) => void
}

const CodeEditor: React.FC<CodeEditorProps> = ({
    theme,
    files,
    readonly,
    readonlyFiles,
    notRemovable,
    options,
    onSelectedFileChange,
    onAddFile,
    onRemoveFile,
    onRenameFile,
    onChangeFileContent,
    onError,
    ...props
}) => {
    const [selectedFileName, setSelectedFileName] = useState(props.selectedFileName)
    const [errorMsg, setErrorMsg] = useState('')

    const handleOnChangeSelectedFile = (fileName: string) => {
        if (onSelectedFileChange) {
            onSelectedFileChange(fileName)
        } else {
            setSelectedFileName(fileName)
        }
    }

    const handleOnRemoveFile = (fileName: string) => {
        const clone = _.cloneDeep(files)
        delete clone[fileName]
        onRemoveFile?.(fileName, clone)
    }

    const handleOnAddFile = (fileName: string) => {
        const clone = _.cloneDeep(files)
        clone[fileName] = {
            name: fileName,
            language: fileNameToLanguage(fileName),
            value: ''
        }
        onAddFile?.(fileName, clone)
        handleOnChangeSelectedFile(fileName)
    }

    const handleOnUpdateFileName = (newFileName: string, oldFileName: string) => {
        if (!files[oldFileName] || !newFileName) {
            return
        }

        const { [oldFileName]: value, ...rest } = files
        const newFile: IFiles = {
            [newFileName]: {
                ...value,
                language: fileNameToLanguage(newFileName),
                name: newFileName
            }
        }
        const newFiles: IFiles = { ...rest, ...newFile }

        onRenameFile?.(newFileName, oldFileName, newFiles)
    }

    const handleOnError = (msg: string) => {
        if (onError) {
            onError(msg)
        } else {
            setErrorMsg(msg)
        }
    }

    const handleOnChangeFileContent = _.debounce((code = '') => {
        if (!files[onSelectedFileChange ? props.selectedFileName : selectedFileName]) {
            return
        }
        const clone = _.cloneDeep(files)
        clone[onSelectedFileChange ? props.selectedFileName : selectedFileName].value = code ?? ''
        onChangeFileContent?.(
            code,
            onSelectedFileChange ? props.selectedFileName : selectedFileName,
            clone
        )
    }, 250)

    return (
        <>
            <FlexBox data-component={'playground-code-editor'}>
                <FileSelector
                    files={files}
                    readonly={readonly}
                    notRemovableFiles={notRemovable}
                    selectedFileName={
                        onSelectedFileChange ? props.selectedFileName : selectedFileName
                    }
                    onChange={handleOnChangeSelectedFile}
                    onRemoveFile={handleOnRemoveFile}
                    onUpdateFileName={handleOnUpdateFileName}
                    onAddFile={handleOnAddFile}
                    onError={handleOnError}
                />
                <Editor
                    theme={theme}
                    selectedFileName={
                        onSelectedFileChange ? props.selectedFileName : selectedFileName
                    }
                    files={files}
                    options={options}
                    readonly={
                        readonly ||
                        readonlyFiles?.includes(
                            onSelectedFileChange ? props.selectedFileName : selectedFileName
                        ) ||
                        !files[onSelectedFileChange ? props.selectedFileName : selectedFileName]
                    }
                    onChange={handleOnChangeFileContent}
                />
                {errorMsg && <div className={'playground-code-editor-message'}>{errorMsg}</div>}
            </FlexBox>
        </>
    )
}

export default CodeEditor
