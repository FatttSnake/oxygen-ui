import React, { useState } from 'react'
import CodeEditor from '@/components/ReactPlayground/CodeEditor'
import { fileNameToLanguage } from '@/components/ReactPlayground/utils.ts'
import { IFiles } from '@/components/ReactPlayground/shared.ts'

const OnlineEditor: React.FC = () => {
    const [files, setFiles] = useState<IFiles>({
        abc: {
            name: 'App.tsx',
            language: fileNameToLanguage('App.tsx'),
            value: 'const a = () => {}'
        },
        cde: {
            name: 'App.css',
            language: fileNameToLanguage('App.css'),
            value: '.title {}'
        }
    })

    return (
        <>
            <CodeEditor
                theme={'light'}
                files={files}
                selectedFileName={'abc'}
                onRemoveFile={(_, files) => setFiles(files)}
            />
        </>
    )
}

export default OnlineEditor
