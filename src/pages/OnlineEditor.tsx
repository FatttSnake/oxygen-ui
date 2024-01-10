import React from 'react'
import CodeEditor from '@/components/Playground/CodeEditor'
import { initFiles } from '@/components/Playground/files'
import { IFiles } from '@/components/Playground/shared'
import FitFullscreen from '@/components/common/FitFullscreen.tsx'
import FlexBox from '@/components/common/FlexBox.tsx'
import Preview from '@/components/Playground/Preview'

const OnlineEditor: React.FC = () => {
    const [files, setFiles] = useState<IFiles>(initFiles)

    return (
        <>
            <FitFullscreen>
                <FlexBox style={{ width: '100%', height: '100%' }} direction={'horizontal'}>
                    <CodeEditor
                        files={files}
                        onAddFile={(_, files) => setFiles(files)}
                        onRemoveFile={(_, files) => setFiles(files)}
                        onRenameFile={(_, __, files) => setFiles(files)}
                        onChangeFileContent={(_, __, files) => setFiles(files)}
                    />
                    <Preview files={files} />
                </FlexBox>
            </FitFullscreen>
        </>
    )
}

export default OnlineEditor
