import React, { useState } from 'react'
import '@/components/Playground/playground.scss'
import FlexBox from '@/components/common/FlexBox'
import CodeEditor from '@/components/Playground/CodeEditor'
import Output from '@/components/Playground/Output'
import { IFiles, IImportMap } from '@/components/Playground/shared.ts'
import { IMPORT_MAP_FILE_NAME, MAIN_FILE_NAME } from '@/components/Playground/files.ts'

interface PlaygroundProps {
    initFiles: IFiles
    initImportMap: IImportMap
}

const Playground: React.FC<PlaygroundProps> = ({ initFiles, initImportMap }) => {
    const [files, setFiles] = useState(initFiles)
    const [selectedFileName, setSelectedFileName] = useState(MAIN_FILE_NAME)
    const [importMap, setImportMap] = useState<IImportMap>(initImportMap)

    const handleOnChangeFileContent = (content: string, fileName: string, files: IFiles) => {
        if (fileName === IMPORT_MAP_FILE_NAME) {
            setImportMap(JSON.parse(content))
        } else {
            delete files[IMPORT_MAP_FILE_NAME]
            setFiles(files)
        }
    }

    return (
        <FlexBox data-component={'playground'} direction={'horizontal'}>
            <CodeEditor
                files={{
                    ...files,
                    'import-map.json': {
                        name: IMPORT_MAP_FILE_NAME,
                        language: 'json',
                        value: JSON.stringify(importMap, null, 2)
                    }
                }}
                selectedFileName={selectedFileName}
                onAddFile={(_, files) => setFiles(files)}
                onRemoveFile={(_, files) => setFiles(files)}
                onRenameFile={(_, __, files) => setFiles(files)}
                onChangeFileContent={handleOnChangeFileContent}
                onSelectedFileChange={setSelectedFileName}
            />
            <Output files={files} selectedFileName={selectedFileName} importMap={importMap} />
        </FlexBox>
    )
}

export default Playground
