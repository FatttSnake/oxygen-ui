import React from 'react'
import Editor from '@/components/ReactPlayground/CodeEditor/Editor'

const OnlineEditor: React.FC = () => {
    return (
        <>
            <Editor
                theme={'light'}
                file={{
                    name: 'App.tsx',
                    language: 'typescript',
                    value: 'const a = () => {}'
                }}
            />
        </>
    )
}

export default OnlineEditor
