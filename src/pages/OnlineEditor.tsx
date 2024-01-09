import React from 'react'
import CodeEditor from '@/components/Playground/CodeEditor'
import { initFiles } from '@/components/Playground/files'
import { IFiles } from '@/components/Playground/shared'

const OnlineEditor: React.FC = () => {
    const [files, setFiles] = useState<IFiles>(initFiles)

    return (
        <>
            <CodeEditor
                files={files}
                selectedFileName={'App.css'}
                onAddFile={(_, files) => setFiles(files)}
                onRemoveFile={(_, files) => setFiles(files)}
                onRenameFile={(_, __, files) => setFiles(files)}
                onChangeFileContent={(_, __, files) => setFiles(files)}
            />
        </>
    )
}

export default OnlineEditor
