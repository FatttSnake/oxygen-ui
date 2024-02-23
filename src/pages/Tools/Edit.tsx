import '@/assets/css/pages/tools/edit.scss'
import Draggable from 'react-draggable'
import Icon from '@ant-design/icons'
import {
    DATABASE_NO_RECORD_FOUND,
    DATABASE_SELECT_SUCCESS,
    DATABASE_UPDATE_SUCCESS,
    TOOL_HAS_BEEN_PUBLISHED,
    TOOL_UNDER_REVIEW
} from '@/constants/common.constants'
import { r_tool_category_get, r_tool_detail, r_tool_update } from '@/services/tool'
import { IFiles, IImportMap, ITsconfig } from '@/components/Playground/shared'
import {
    base64ToFiles,
    base64ToStr,
    filesToBase64,
    IMPORT_MAP_FILE_NAME,
    TS_CONFIG_FILE_NAME
} from '@/components/Playground/files'
import Playground from '@/components/Playground'
import FitFullscreen from '@/components/common/FitFullscreen'
import FlexBox from '@/components/common/FlexBox'
import LoadingMask from '@/components/common/LoadingMask'

const Edit = () => {
    const navigate = useNavigate()
    const { toolId } = useParams()
    const [form] = AntdForm.useForm<ToolUpdateParam>()
    const formValues = AntdForm.useWatch([], form)
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
    const [showDraggableMask, setShowDraggableMask] = useState(false)
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [submittable, setSubmittable] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [hasEdited, setHasEdited] = useState(false)
    const [categoryData, setCategoryData] = useState<ToolCategoryVo[]>()
    const [loadingCategory, setLoadingCategory] = useState(false)

    const handleOnChangeFileContent = (content: string, fileName: string, files: IFiles) => {
        setHasEdited(true)

        if (fileName === IMPORT_MAP_FILE_NAME) {
            setImportMapRaw(content)
            return
        }
        if (fileName === TS_CONFIG_FILE_NAME) {
            setTsconfigRaw(content)
            return
        }

        setFiles(files)
    }

    const handleOnSetting = () => {
        setIsDrawerOpen(true)
        form.setFieldValue('icon', toolData?.icon)
        form.setFieldValue('name', toolData?.name)
        form.setFieldValue('description', toolData?.description)
        form.setFieldValue('keywords', toolData?.keywords)
        form.setFieldValue(
            'categories',
            toolData?.categories.map((value) => value.id)
        )
        if (!categoryData || !categoryData.length) {
            getCategory()
        }
        void form.validateFields()
    }

    const handleOnSave = () => {
        if (isSubmitting) {
            return
        }
        setIsSubmitting(true)
        void message.loading({ content: '保存中', key: 'SAVING', duration: 0 })

        void r_tool_update({
            id: toolData!.id,
            source: filesToBase64(files)
        })
            .then((res) => {
                const response = res.data
                switch (response.code) {
                    case DATABASE_UPDATE_SUCCESS:
                        void message.success('保存成功')
                        getTool()
                        break
                    case TOOL_UNDER_REVIEW:
                        void message.error('保存失败：工具审核中')
                        setTimeout(() => {
                            navigate(-1)
                        }, 3000)
                        break
                    case TOOL_HAS_BEEN_PUBLISHED:
                        void message.error('保存失败：工具已发布')
                        setTimeout(() => {
                            navigate(-1)
                        }, 3000)
                        break
                    default:
                        void message.error('保存失败，请稍后重试')
                }
            })
            .finally(() => {
                setIsSubmitting(false)
                message.destroy('SAVING')
            })
    }

    const handleOnDrawerClose = () => {
        setIsDrawerOpen(false)
    }

    const handleOnIconBeforeUpload = (
        file: Parameters<_GetProp<_UploadProps, 'beforeUpload'>>[0]
    ) => {
        if (file.type !== 'image/svg+xml') {
            void message.error('仅支持 svg 文件')
            return false
        }
        if (file.size / 1024 / 1024 > 2) {
            void message.error('文件大小不能大于2MiB')
        }

        const reader = new FileReader()
        reader.addEventListener('load', () => {
            // eslint-disable-next-line @typescript-eslint/no-base-to-string
            form.setFieldValue('icon', reader.result!.toString().split(',')[1])
            void form.validateFields(['icon'])
        })
        reader.readAsDataURL(file)

        return false
    }

    const handleOnSubmit = () => {
        if (isSubmitting) {
            return
        }
        setIsSubmitting(true)

        void r_tool_update({
            ...formValues,
            id: toolData!.id
        })
            .then((res) => {
                const response = res.data
                switch (response.code) {
                    case DATABASE_UPDATE_SUCCESS:
                        setIsDrawerOpen(false)
                        void message.success('保存成功')
                        getTool()
                        break
                    case TOOL_UNDER_REVIEW:
                        void message.error('保存失败：工具审核中')
                        setTimeout(() => {
                            navigate(-1)
                        }, 3000)
                        break
                    case TOOL_HAS_BEEN_PUBLISHED:
                        void message.error('保存失败：工具已发布')
                        setTimeout(() => {
                            navigate(-1)
                        }, 3000)
                        break
                    default:
                        void message.error('保存失败，请稍后重试')
                }
            })
            .finally(() => {
                setIsSubmitting(false)
            })
    }

    const getCategory = () => {
        if (loadingCategory) {
            return
        }
        setLoadingCategory(true)

        void r_tool_category_get()
            .then((res) => {
                const response = res.data
                switch (response.code) {
                    case DATABASE_SELECT_SUCCESS:
                        setCategoryData(response.data!)
                        break
                    default:
                        void message.error('获取类别列表失败，请稍后重试')
                }
            })
            .finally(() => {
                setLoadingCategory(false)
            })
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
                                setHasEdited(false)
                                break
                            case 'PROCESSING':
                                void message.warning('工具审核中，请勿修改')
                                setTimeout(() => {
                                    navigate(-1)
                                }, 3000)
                                break
                            default:
                                void message.warning('请先创建新版本后编辑工具')
                                setTimeout(() => {
                                    navigate(-1)
                                }, 3000)
                        }
                        break
                    case DATABASE_NO_RECORD_FOUND:
                        void message.error('未找到指定工具')
                        setTimeout(() => {
                            navigate(-1)
                        }, 3000)
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
            }, 500)
        } catch (e) {
            console.error(e)
            void message.error('载入工具失败')
        }
    }, [toolData])

    useEffect(() => {
        form.validateFields({ validateOnly: true }).then(
            () => {
                setSubmittable(true)
            },
            () => {
                setSubmittable(false)
            }
        )
    }, [formValues])

    useEffect(() => {
        getTool()
    }, [])

    const drawerToolbar = (
        <AntdSpace>
            <AntdTooltip title={'刷新类别列表'}>
                <AntdButton onClick={getCategory} disabled={isSubmitting}>
                    <Icon component={IconOxygenRefresh} />
                </AntdButton>
            </AntdTooltip>
            <AntdButton onClick={handleOnDrawerClose} disabled={isSubmitting}>
                取消
            </AntdButton>
            <AntdButton
                type={'primary'}
                disabled={!submittable}
                loading={isSubmitting}
                onClick={handleOnSubmit}
            >
                提交
            </AntdButton>
        </AntdSpace>
    )

    const editForm = (
        <AntdForm form={form} disabled={isSubmitting} layout={'vertical'}>
            <AntdForm.Item
                label={'图标'}
                name={'icon'}
                rules={[
                    ({ getFieldValue }) => ({
                        validator() {
                            if (!getFieldValue('icon')) {
                                return Promise.reject(new Error('请选择图标'))
                            }
                            return Promise.resolve()
                        }
                    })
                ]}
                getValueFromEvent={() => {}}
            >
                <AntdUpload
                    listType={'picture-card'}
                    showUploadList={false}
                    beforeUpload={handleOnIconBeforeUpload}
                    accept={'image/svg+xml'}
                >
                    {formValues?.icon ? (
                        <img
                            src={`data:image/svg+xml;base64,${formValues.icon}`}
                            alt={'icon'}
                            style={{ width: '100%' }}
                        />
                    ) : (
                        <Icon component={IconOxygenPlus} />
                    )}
                </AntdUpload>
            </AntdForm.Item>
            <AntdForm.Item name={'icon'} hidden>
                <AntdInput />
            </AntdForm.Item>
            <AntdForm.Item label={'名称'} name={'name'} rules={[{ required: true }]}>
                <AntdInput maxLength={20} showCount placeholder={'请输入名称'} />
            </AntdForm.Item>
            <AntdForm.Item label={'简介'} name={'description'}>
                <AntdInput.TextArea
                    autoSize={{ minRows: 6, maxRows: 6 }}
                    maxLength={200}
                    showCount
                    placeholder={'请输入简介'}
                />
            </AntdForm.Item>
            <AntdForm.Item
                label={'关键字'}
                tooltip={'工具搜索（每个不超过10个字符）'}
                name={'keywords'}
                rules={[{ required: true, message: '请输入关键字' }]}
            >
                <AntdSelect placeholder={'请输入关键字'} mode={'tags'} maxCount={20} />
            </AntdForm.Item>
            <AntdForm.Item
                label={'类别'}
                tooltip={'工具分类'}
                name={'categories'}
                rules={[{ required: true }]}
            >
                <AntdSelect
                    placeholder={'请选择类别'}
                    mode={'multiple'}
                    options={categoryData?.map((value) => ({
                        value: value.id,
                        label: value.name
                    }))}
                    loading={loadingCategory}
                    disabled={loadingCategory}
                />
            </AntdForm.Item>
        </AntdForm>
    )

    return (
        <>
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
                    {showDraggableMask && <div className={'draggable-mask'} />}
                </FlexBox>
                <Draggable
                    onStart={() => setShowDraggableMask(true)}
                    onStop={() => setShowDraggableMask(false)}
                    bounds={'#root'}
                >
                    <div className={'draggable-content'}>
                        {hasEdited ? (
                            <AntdFloatButton
                                type={'primary'}
                                icon={<Icon component={IconOxygenSave} />}
                                onClick={handleOnSave}
                            />
                        ) : (
                            <AntdFloatButton
                                icon={<Icon component={IconOxygenSetting} />}
                                onClick={handleOnSetting}
                            />
                        )}
                    </div>
                </Draggable>
            </FitFullscreen>
            <AntdDrawer
                title={'配置工具'}
                onClose={handleOnDrawerClose}
                open={isDrawerOpen}
                closable={!isSubmitting}
                maskClosable={true}
                extra={drawerToolbar}
            >
                {editForm}
            </AntdDrawer>
        </>
    )
}

export default Edit