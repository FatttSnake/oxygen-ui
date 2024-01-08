import React from 'react'
import _ from 'lodash'
import { IEditorOptions, IFiles, ITheme } from '@/components/ReactPlayground/shared'
import { fileNameToLanguage } from '@/components/ReactPlayground/utils'
import FileSelector from '@/components/ReactPlayground/CodeEditor/FileSelector'
import Editor from '@/components/ReactPlayground/CodeEditor/Editor'
import FitFullscreen from '@/components/common/FitFullscreen'
import FlexBox from '@/components/common/FlexBox'

interface CodeEditorProps {
    theme: ITheme
    files: IFiles
    readonly?: boolean
    readonlyFiles?: string[]
    notRemovable?: string[]
    selectedFileName: string
    options?: IEditorOptions
    onSelectedFileChange?: (fileName: string) => void
    onRemoveFile?: (fileName: string, files: IFiles) => void
    onRenameFile?: (newFileName: string, oldFileName: string, files: IFiles) => void
}

const CodeEditor: React.FC<CodeEditorProps> = ({
    theme,
    files,
    readonly,
    readonlyFiles,
    notRemovable,
    options,
    onSelectedFileChange,
    onRemoveFile,
    onRenameFile,
    ...props
}) => {
    const [selectedFileName, setSelectedFileName] = useState(props.selectedFileName)

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

    return (
        <>
            <FitFullscreen>
                <FlexBox style={{ height: '100%' }}>
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
                    />
                    <Editor
                        theme={theme}
                        selectedFileName={selectedFileName}
                        files={files}
                        options={options}
                        readonly={readonly || readonlyFiles?.includes(selectedFileName)}
                    />
                </FlexBox>
            </FitFullscreen>
        </>
    )
}

export default CodeEditor
