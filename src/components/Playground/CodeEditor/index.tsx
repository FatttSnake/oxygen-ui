import _ from 'lodash'
import '@/components/Playground/CodeEditor/code-editor.scss'
import FlexBox from '@/components/common/FlexBox'
import { IEditorOptions, IFiles, ITheme, ITsconfig } from '@/components/Playground/shared'
import {
    fileNameToLanguage,
    getFileNameList,
    IMPORT_MAP_FILE_NAME,
    TS_CONFIG_FILE_NAME
} from '@/components/Playground/files'
import FileSelector from '@/components/Playground/CodeEditor/FileSelector'
import Editor from '@/components/Playground/CodeEditor/Editor'

interface CodeEditorProps {
    theme?: ITheme
    showFileSelector?: boolean
    tsconfig?: ITsconfig
    files: IFiles
    readonly?: boolean
    readonlyFiles?: string[]
    notRemovable?: string[]
    selectedFileName?: string
    options?: IEditorOptions
    onSelectedFileChange?: (fileName: string) => void
    onAddFile?: (fileName: string, files: IFiles) => void
    onRemoveFile?: (fileName: string, files: IFiles) => void
    onRenameFile?: (newFileName: string, oldFileName: string, files: IFiles) => void
    onChangeFileContent?: (content: string, fileName: string, files: IFiles) => void
    onError?: (msg: string) => void
}

const CodeEditor = ({
    theme,
    showFileSelector = true,
    tsconfig,
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
}: CodeEditorProps) => {
    const filteredFilesName = getFileNameList(files).filter(
        (item) => ![IMPORT_MAP_FILE_NAME, TS_CONFIG_FILE_NAME].includes(item) && !files[item].hidden
    )
    const propsSelectedFileName =
        props.selectedFileName || (filteredFilesName.length ? filteredFilesName[0] : '')
    const [selectedFileName, setSelectedFileName] = useState(propsSelectedFileName)
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

    const handleOnChangeFileContent = (code: string = '') => {
        if (!files[onSelectedFileChange ? propsSelectedFileName : selectedFileName]) {
            return
        }
        const clone = _.cloneDeep(files)
        clone[onSelectedFileChange ? propsSelectedFileName : selectedFileName].value = code ?? ''
        onChangeFileContent?.(
            code,
            onSelectedFileChange ? propsSelectedFileName : selectedFileName,
            clone
        )
    }

    return (
        <>
            <FlexBox data-component={'playground-code-editor'}>
                {showFileSelector && (
                    <FileSelector
                        files={files}
                        readonly={readonly}
                        notRemovableFiles={notRemovable}
                        selectedFileName={
                            onSelectedFileChange ? propsSelectedFileName : selectedFileName
                        }
                        onChange={handleOnChangeSelectedFile}
                        onRemoveFile={handleOnRemoveFile}
                        onUpdateFileName={handleOnUpdateFileName}
                        onAddFile={handleOnAddFile}
                        onError={handleOnError}
                    />
                )}
                <Editor
                    tsconfig={tsconfig}
                    theme={theme}
                    selectedFileName={
                        onSelectedFileChange ? propsSelectedFileName : selectedFileName
                    }
                    files={files}
                    options={options}
                    readonly={
                        readonly ||
                        readonlyFiles?.includes(
                            onSelectedFileChange ? propsSelectedFileName : selectedFileName
                        ) ||
                        !files[onSelectedFileChange ? propsSelectedFileName : selectedFileName]
                    }
                    onChange={handleOnChangeFileContent}
                    onJumpFile={handleOnChangeSelectedFile}
                />
                {errorMsg && <div className={'playground-error-message'}>{errorMsg}</div>}
            </FlexBox>
        </>
    )
}

CodeEditor.Editor = Editor
CodeEditor.FileSelector = FileSelector

export default CodeEditor
