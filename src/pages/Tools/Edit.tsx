import '@/assets/css/pages/tools/edit.scss'
import { r_tool_detail } from '@/services/tool.tsx'
import { DATABASE_NO_RECORD_FOUND, DATABASE_SELECT_SUCCESS } from '@/constants/common.constants.ts'
import { useEffect, useState } from 'react'
import Playground from '@/components/Playground'
import FitFullscreen from '@/components/common/FitFullscreen.tsx'
import FlexBox from '@/components/common/FlexBox.tsx'
import { IFiles, IImportMap, ITsconfig } from '@/components/Playground/shared.ts'
import {
    base64ToFiles,
    base64ToStr,
    IMPORT_MAP_FILE_NAME,
    TS_CONFIG_FILE_NAME
} from '@/components/Playground/files.ts'
import LoadingMask from '@/components/common/LoadingMask.tsx'

const Edit = () => {
    const navigate = useNavigate()
    const { toolId } = useParams()
    const [loading, setLoading] = useState(false)
    const [toolData, setToolData] = useState<ToolVo>()
    const [files, setFiles] = useState<IFiles>({})
    const [selectedFileName, setSelectedFileName] = useState('')
    const [importMapRaw, setImportMapRaw] = useState<string>('')
    const [importMap, setImportMap] = useState<IImportMap>()
    const [tsconfigRaw, setTsconfigRaw] = useState<string>('')
    const [tsconfig, setTsconfig] = useState<ITsconfig>()
    const [entryPoint, setEntryPoint] = useState('')
    const [baseDist, setBaseDist] = useState('')

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

    const getTool = () => {
        if (loading) {
            return
        }
        setLoading(true)
        void message.loading({ content: '加载中……', key: 'LOADING', duration: 0 })

        void r_tool_detail('!', toolId!, 'latest')
            .then((res) => {
                const response = res.data
                switch (response.code) {
                    case DATABASE_SELECT_SUCCESS:
                        switch (response.data!.review) {
                            case 'NONE':
                            case 'REJECT':
                                setToolData(response.data!)
                                break
                            case 'PROCESSING':
                                void message.warning('工具审核中，请勿修改')
                                navigate('/')
                                break
                            default:
                                void message.warning('请先创建新版本后编辑工具')
                                navigate('/')
                        }
                        break
                    case DATABASE_NO_RECORD_FOUND:
                        void message.error('未找到指定工具')
                        navigate('/')
                        break
                    default:
                        void message.error('获取工具信息失败，请稍后重试')
                }
            })
            .finally(() => {
                setLoading(false)
                message.destroy('LOADING')
            })
    }

    useEffect(() => {
        try {
            setImportMap(JSON.parse(importMapRaw) as IImportMap)
        } catch (e) {
            /* empty */
        }
    }, [importMapRaw])

    useEffect(() => {
        setTimeout(() => {
            try {
                setTsconfig(JSON.parse(tsconfigRaw) as ITsconfig)
            } catch (e) {
                /* empty */
            }
        }, 1000)
    }, [tsconfigRaw])

    useEffect(() => {
        if (!toolData) {
            return
        }
        try {
            setBaseDist(base64ToStr(toolData.base.dist.data!))
            const files = base64ToFiles(toolData.source.data!)
            setFiles(files)
            setImportMapRaw(files[IMPORT_MAP_FILE_NAME].value)
            setTsconfigRaw(files[TS_CONFIG_FILE_NAME].value)
            setEntryPoint(toolData.entryPoint)
            setTimeout(() => {
                setSelectedFileName(toolData.entryPoint)
            }, 100)
        } catch (e) {
            console.error(e)
            void message.error('载入工具失败')
        }
    }, [toolData])

    useEffect(() => {
        getTool()
    }, [])

    return (
        <FitFullscreen data-component={'tools-edit'}>
            <FlexBox direction={'horizontal'} className={'root-content'}>
                <LoadingMask hidden={!loading}>
                    <Playground.CodeEditor
                        tsconfig={tsconfig}
                        files={{
                            ...files,
                            [IMPORT_MAP_FILE_NAME]: {
                                name: IMPORT_MAP_FILE_NAME,
                                language: 'json',
                                value: importMapRaw
                            },
                            [TS_CONFIG_FILE_NAME]: {
                                name: TS_CONFIG_FILE_NAME,
                                language: 'json',
                                value: tsconfigRaw
                            }
                        }}
                        notRemovable={[entryPoint]}
                        selectedFileName={selectedFileName}
                        onAddFile={(_, files) => setFiles(files)}
                        onRemoveFile={(_, files) => setFiles(files)}
                        onRenameFile={(_, __, files) => setFiles(files)}
                        onChangeFileContent={handleOnChangeFileContent}
                        onSelectedFileChange={setSelectedFileName}
                    />
                    <Playground.Output
                        files={files}
                        selectedFileName={selectedFileName}
                        importMap={importMap!}
                        entryPoint={entryPoint}
                        postExpansionCode={baseDist}
                    />
                </LoadingMask>
            </FlexBox>
        </FitFullscreen>
    )
}

export default Edit
