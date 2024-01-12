import React, { useState } from 'react'
import FlexBox from '@/components/common/FlexBox.tsx'
import FileSelector from '@/components/Playground/CodeEditor/FileSelector'
import Transform from '@/components/Playground/Output/Transform'
import { IFiles, IImportMap } from '@/components/Playground/shared.ts'
import Preview from '@/components/Playground/Output/Preview'

interface OutputProps {
    files: IFiles
    selectedFileName: string
    importMap: IImportMap
}

const Output: React.FC<OutputProps> = ({ files, selectedFileName, importMap }) => {
    const [selectedTab, setSelectedTab] = useState('Preview')

    return (
        <FlexBox data-component={'playground-code-output'}>
            <FileSelector
                files={{
                    Preview: { name: 'Preview', language: 'json', value: '' },
                    Transform: { name: 'Transform', language: 'json', value: '' }
                }}
                selectedFileName={selectedTab}
                onChange={(tabName) => setSelectedTab(tabName)}
                readonly
            />
            {selectedTab === 'Preview' && (
                <Preview
                    iframeKey={JSON.stringify(importMap)}
                    files={files}
                    importMap={importMap}
                />
            )}
            {selectedTab === 'Transform' && <Transform file={files[selectedFileName]} />}
        </FlexBox>
    )
}

export default Output
