import React, { useState } from 'react'
import CodeEditor from '@/components/Playground/CodeEditor'
import { initFiles, MAIN_FILE_NAME } from '@/components/Playground/files'
import { IFiles } from '@/components/Playground/shared'
import FitFullscreen from '@/components/common/FitFullscreen'
import FlexBox from '@/components/common/FlexBox'
import Transform from '@/components/Playground/Transform'

const OnlineEditor: React.FC = () => {
    const [files, setFiles] = useState<IFiles>(initFiles)
    const [selectedFileName, setSelectedFileName] = useState(MAIN_FILE_NAME)

    return (
        <>
            <FitFullscreen>
                <FlexBox style={{ width: '100%', height: '100%' }} direction={'horizontal'}>
                    <CodeEditor
                        files={files}
                        onSelectedFileChange={setSelectedFileName}
                        selectedFileName={selectedFileName}
                        onAddFile={(_, files) => setFiles(files)}
                        onRemoveFile={(_, files) => setFiles(files)}
                        onRenameFile={(_, __, files) => setFiles(files)}
                        onChangeFileContent={(_, __, files) => setFiles(files)}
                    />
                    <Transform file={files[selectedFileName]} />
                </FlexBox>
            </FitFullscreen>
        </>
    )
}

export default OnlineEditor
