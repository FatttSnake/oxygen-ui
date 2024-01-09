import React from 'react'
import CodeEditor from '@/components/ReactPlayground/CodeEditor'
import { fileNameToLanguage } from '@/components/ReactPlayground/files'
import { IFiles } from '@/components/ReactPlayground/shared'

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
                files={files}
                selectedFileName={'App.css'}
                notRemovable={['App.css', 'fgh']}
                readonlyFiles={['App.tsx']}
                onAddFile={(_, files) => setFiles(files)}
                onRemoveFile={(_, files) => setFiles(files)}
                onRenameFile={(_, __, files) => setFiles(files)}
                onChangeFileContent={(_, __, files) => setFiles(files)}
            />
        </>
    )
}

export default OnlineEditor
