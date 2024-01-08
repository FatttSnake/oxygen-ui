import React, { useState } from 'react'
import CodeEditor from '@/components/ReactPlayground/CodeEditor'
import { fileNameToLanguage } from '@/components/ReactPlayground/utils.ts'
import { IFiles } from '@/components/ReactPlayground/shared.ts'

const OnlineEditor: React.FC = () => {
    const [files, setFiles] = useState<IFiles>({
        ['App.tsx']: {
            name: 'App.tsx',
            language: fileNameToLanguage('App.tsx'),
            value: 'const a = () => {}'
        },
        ['App.css']: {
            name: 'App.css',
            language: fileNameToLanguage('App.css'),
            value: '.title {}'
        },
        cde: {
            name: 'App.css',
            language: fileNameToLanguage('App.css'),
            value: '.title {}'
        },
        def: {
            name: 'App.css',
            language: fileNameToLanguage('App.css'),
            value: '.title {}'
        },
        efg: {
            name: 'App.css',
            language: fileNameToLanguage('App.css'),
            value: '.title {}'
        },
        fgh: {
            name: 'App.css',
            language: fileNameToLanguage('App.css'),
            value: '.title {}'
        },
        ghi: {
            name: 'App.css',
            language: fileNameToLanguage('App.css'),
            value: '.title {}'
        }
    })

    return (
        <>
            <CodeEditor
                theme={'vs-dark'}
                files={files}
                selectedFileName={'App.css'}
                notRemovable={['App.css']}
                readonlyFiles={['App.tsx']}
                onRemoveFile={(_, files) => setFiles(files)}
                onRenameFile={(_, __, files) => setFiles(files)}
            />
        </>
    )
}

export default OnlineEditor
