import '@/components/Playground/playground.scss'
import { useUpdatedEffect } from '@/util/hooks'
import { IFiles, IImportMap, ITsconfig } from '@/components/Playground/shared'
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
    initTsconfigRaw: string
}

const Playground = ({ initFiles, initImportMapRaw, initTsconfigRaw }: PlaygroundProps) => {
    const [files, setFiles] = useState(initFiles)
    const [selectedFileName, setSelectedFileName] = useState(MAIN_FILE_NAME)
    const [importMapRaw, setImportMapRaw] = useState<string>(initImportMapRaw)
    const [importMap, setImportMap] = useState<IImportMap>()
    const [tsconfigRaw, setTsconfigRaw] = useState<string>(initTsconfigRaw)
    const [tsconfig, setTsconfig] = useState<ITsconfig>()

    if (!importMap) {
        try {
            setImportMap(JSON.parse(importMapRaw) as IImportMap)
        } catch (e) {
            setImportMap({ imports: {} })
        }
    }
    if (!tsconfig) {
        try {
            setTsconfig(JSON.parse(tsconfigRaw) as ITsconfig)
        } catch (e) {
            setTsconfig({ compilerOptions: {} })
        }
    }

    const handleOnChangeFileContent = (content: string, fileName: string, files: IFiles) => {
        if (fileName === IMPORT_MAP_FILE_NAME) {
            setImportMapRaw(content)
            return
        }
        if (fileName === TS_CONFIG_FILE_NAME) {
            setTsconfigRaw(content)
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
            setTsconfig(JSON.parse(tsconfigRaw) as ITsconfig)
        } catch (e) {
            /* empty */
        }
    }, [tsconfigRaw])

    return (
        <FlexBox data-component={'playground'} direction={'horizontal'}>
            <CodeEditor
                tsconfig={tsconfig}
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
                        value: tsconfigRaw
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
