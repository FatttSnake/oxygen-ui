import React, { useState } from 'react'
import FileSelector from '@/components/ReactPlayground/CodeEditor/FileSelector'
import Editor from '@/components/ReactPlayground/CodeEditor/Editor'
import { IEditorOptions, IFiles, ITheme } from '@/components/ReactPlayground/shared.ts'
import FitFullscreen from '@/components/common/FitFullscreen.tsx'
import FlexBox from '@/components/common/FlexBox.tsx'
import _ from 'lodash'

interface CodeEditorProps {
    theme: ITheme
    files: IFiles
    readonly?: boolean
    readonlyFiles?: string[]
    selectedFileName: string
    options?: IEditorOptions
    onSelectedFileChange?: (fileName: string) => void
    onRemoveFile?: (fileName: string, files: IFiles) => void
}

const CodeEditor: React.FC<CodeEditorProps> = ({
    theme,
    files,
    readonly,
    readonlyFiles,
    options,
    onSelectedFileChange,
    onRemoveFile,
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

    return (
        <>
            <FitFullscreen>
                <FlexBox style={{ height: '100%' }}>
                    <FileSelector
                        files={files}
                        readonly={readonly}
                        readonlyFiles={readonlyFiles}
                        selectedFileName={
                            onSelectedFileChange ? props.selectedFileName : selectedFileName
                        }
                        onChange={handleOnChangeSelectedFile}
                        onRemoveFile={handleOnRemoveFile}
                    />
                    <Editor
                        theme={theme}
                        selectedFileName={selectedFileName}
                        files={files}
                        options={options}
                    />
                </FlexBox>
            </FitFullscreen>
        </>
    )
}

export default CodeEditor
