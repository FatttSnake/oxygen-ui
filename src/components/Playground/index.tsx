import '@/components/Playground/playground.scss'
import { useUpdatedEffect } from '@/util/hooks'
import { IFiles, IImportMap, ITsConfig } from '@/components/Playground/shared'
import {
    IMPORT_MAP_FILE_NAME,
    MAIN_FILE_NAME,
    TS_CONFIG_FILE_NAME
} from '@/components/Playground/files'
import FlexBox from '@/components/common/FlexBox'
import CodeEditor from '@/components/Playground/CodeEditor'
import Output from '@/components/Playground/Output'

interface PlaygroundProps {
    initFiles: IFiles
    initImportMapRaw: string
    initTsConfigRaw: string
}

const Playground = ({ initFiles, initImportMapRaw, initTsConfigRaw }: PlaygroundProps) => {
    const [files, setFiles] = useState(initFiles)
    const [selectedFileName, setSelectedFileName] = useState(MAIN_FILE_NAME)
    const [importMapRaw, setImportMapRaw] = useState<string>(initImportMapRaw)
    const [importMap, setImportMap] = useState<IImportMap>()
    const [tsConfigRaw, setTsConfigRaw] = useState<string>(initTsConfigRaw)
    const [tsConfig, setTsConfig] = useState<ITsConfig>()

    if (!importMap) {
        try {
            setImportMap(JSON.parse(importMapRaw) as IImportMap)
        } catch (e) {
            setImportMap({ imports: {} })
        }
    }
    if (!tsConfig) {
        try {
            setTsConfig(JSON.parse(tsConfigRaw) as ITsConfig)
        } catch (e) {
            setTsConfig({ compilerOptions: {} })
        }
    }

    const handleOnChangeFileContent = (content: string, fileName: string, files: IFiles) => {
        if (fileName === IMPORT_MAP_FILE_NAME) {
            setImportMapRaw(content)
            return
        }
        if (fileName === TS_CONFIG_FILE_NAME) {
            setTsConfigRaw(content)
            return
        }

        delete files[IMPORT_MAP_FILE_NAME]
        delete files[TS_CONFIG_FILE_NAME]
        setFiles(files)
    }

    useUpdatedEffect(() => {
        try {
            setImportMap(JSON.parse(importMapRaw) as IImportMap)
        } catch (e) {
            /* empty */
        }
    }, [importMapRaw])

    useUpdatedEffect(() => {
        try {
            setTsConfig(JSON.parse(tsConfigRaw) as ITsConfig)
        } catch (e) {
            /* empty */
        }
    }, [tsConfigRaw])

    return (
        <FlexBox data-component={'playground'} direction={'horizontal'}>
            <CodeEditor
                tsConfig={tsConfig}
                files={{
                    ...files,
                    'import-map.json': {
                        name: IMPORT_MAP_FILE_NAME,
                        language: 'json',
                        value: importMapRaw
                    },
                    'tsconfig.json': {
                        name: TS_CONFIG_FILE_NAME,
                        language: 'json',
                        value: tsConfigRaw
                    }
                }}
                selectedFileName={selectedFileName}
                onAddFile={(_, files) => setFiles(files)}
                onRemoveFile={(_, files) => setFiles(files)}
                onRenameFile={(_, __, files) => setFiles(files)}
                onChangeFileContent={handleOnChangeFileContent}
                onSelectedFileChange={setSelectedFileName}
            />
            <Output files={files} selectedFileName={selectedFileName} importMap={importMap!} />
        </FlexBox>
    )
}

export default Playground
