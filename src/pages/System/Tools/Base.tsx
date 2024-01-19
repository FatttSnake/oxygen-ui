import '@/assets/css/pages/system/tools/base.scss'
import FitFullscreen from '@/components/common/FitFullscreen.tsx'
import FlexBox from '@/components/common/FlexBox.tsx'
import HideScrollbar from '@/components/common/HideScrollbar.tsx'
import Card from '@/components/common/Card.tsx'
import CodeEditor from '@/components/Playground/CodeEditor'
import { useState } from 'react'
import { IFile, IFiles } from '@/components/Playground/shared.ts'
import {
    r_sys_tool_base_add,
    r_sys_tool_base_delete,
    r_sys_tool_base_get_one,
    r_sys_tool_base_getList,
    r_sys_tool_base_update
} from '@/services/system.tsx'
import {
    COLOR_PRODUCTION,
    DATABASE_DELETE_SUCCESS,
    DATABASE_DUPLICATE_KEY,
    DATABASE_INSERT_SUCCESS,
    DATABASE_SELECT_SUCCESS,
    DATABASE_UPDATE_SUCCESS
} from '@/constants/common.constants.ts'
import { utcToLocalTime } from '@/util/datetime.tsx'
import Permission from '@/components/common/Permission.tsx'
import { base64ToFiles, filesToBase64, getFilesSize } from '@/components/Playground/files.ts'

const Base = () => {
    const [modal, contextHolder] = AntdModal.useModal()
    const [form] = AntdForm.useForm<ToolBaseAddEditParam>()
    const formValues = AntdForm.useWatch([], form)
    const [newFormValues, setNewFormValues] = useState<ToolBaseAddEditParam>()
    const [isLoading, setIsLoading] = useState(false)
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [isDrawerEdit, setIsDrawerEdit] = useState(false)
    const [submittable, setSubmittable] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [editingFiles, setEditingFiles] = useState<IFiles>()
    const [editingFileName, setEditingFileName] = useState('')
    const [hasEdited, setHasEdited] = useState(false)
    const [baseData, setBaseData] = useState<ToolBaseVo[]>([])
    const [baseDetailData, setBaseDetailData] = useState<Record<string, ToolBaseVo>>({})
    const [baseDetailLoading, setBaseDetailLoading] = useState<Record<string, boolean>>({})

    const handleOnAddBtnClick = () => {
        setIsDrawerEdit(false)
        setIsDrawerOpen(true)
        form.setFieldValue('id', undefined)
        form.setFieldValue('name', newFormValues?.name)
        form.setFieldValue('enable', newFormValues?.enable ?? true)
    }

    const baseColumns: _ColumnsType<ToolBaseVo> = [
        { title: '名称', dataIndex: 'name' },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            width: '20%',
            align: 'center',
            render: (value: string) => utcToLocalTime(value)
        },
        {
            title: '修改时间',
            dataIndex: 'updateTime',
            width: '20%',
            align: 'center',
            render: (value: string) => utcToLocalTime(value)
        },
        {
            title: '状态',
            dataIndex: 'enable',
            width: '5%',
            align: 'center',
            render: (value) =>
                value ? <AntdTag color={'success'}>启用</AntdTag> : <AntdTag>禁用</AntdTag>
        },
        {
            title: (
                <>
                    操作 (
                    <a style={{ color: COLOR_PRODUCTION }} onClick={handleOnAddBtnClick}>
                        新增
                    </a>
                    )
                </>
            ),
            dataIndex: 'enable',
            width: '15em',
            align: 'center',
            render: (_, record) => (
                <>
                    <AntdSpace size={'middle'}>
                        <Permission operationCode={'system:tool:modify:base'}>
                            <a
                                style={{ color: COLOR_PRODUCTION }}
                                onClick={handleOnEditBtnClick(record)}
                            >
                                编辑
                            </a>
                        </Permission>
                        <Permission operationCode={'system:tool:delete:base'}>
                            <a
                                style={{ color: COLOR_PRODUCTION }}
                                onClick={handleOnDeleteBtnClick(record)}
                            >
                                删除
                            </a>
                        </Permission>
                    </AntdSpace>
                </>
            )
        }
    ]

    const handleOnEditBtnClick = (value: ToolBaseVo) => {
        return () => {
            setIsDrawerEdit(true)
            setIsDrawerOpen(true)
            form.setFieldValue('id', value.id)
            form.setFieldValue('name', value.name)
            form.setFieldValue('enable', value.enable)
            void form.validateFields()
        }
    }

    const handleOnDeleteBtnClick = (value: ToolBaseVo) => {
        return () => {
            modal
                .confirm({
                    title: '确定删除',
                    content: `确定删除基板 ${value.name} 吗？`
                })
                .then(
                    (confirmed) => {
                        if (confirmed) {
                            setIsLoading(true)

                            void r_sys_tool_base_delete(value.id)
                                .then((res) => {
                                    const response = res.data
                                    if (response.code === DATABASE_DELETE_SUCCESS) {
                                        void message.success('删除成功')
                                        setTimeout(() => {
                                            getBase()
                                        })
                                    } else {
                                        void message.error('删除失败，请稍后重试')
                                    }
                                })
                                .finally(() => {
                                    setIsLoading(false)
                                })
                        }
                    },
                    () => {}
                )
        }
    }

    const handleOnSubmit = () => {
        if (isSubmitting) {
            return
        }
        setIsSubmitting(true)

        if (isDrawerEdit) {
            void r_sys_tool_base_update(formValues)
                .then((res) => {
                    const response = res.data
                    switch (response.code) {
                        case DATABASE_UPDATE_SUCCESS:
                            setIsDrawerOpen(false)
                            void message.success('更新成功')
                            getBase()
                            break
                        case DATABASE_DUPLICATE_KEY:
                            void message.error('已存在相同名称的基板')
                            break
                        default:
                            void message.error('更新失败，请稍后重试')
                    }
                })
                .finally(() => {
                    setIsSubmitting(false)
                })
        } else {
            void r_sys_tool_base_add(formValues)
                .then((res) => {
                    const response = res.data
                    switch (response.code) {
                        case DATABASE_INSERT_SUCCESS:
                            setIsDrawerOpen(false)
                            void message.success('添加成功')
                            setNewFormValues(undefined)
                            getBase()
                            break
                        case DATABASE_DUPLICATE_KEY:
                            void message.error('已存在相同名称的基板')
                            break
                        default:
                            void message.error('添加失败，请稍后重试')
                    }
                })
                .finally(() => {
                    setIsSubmitting(false)
                })
        }
    }

    const handleOnDrawerClose = () => {
        setIsDrawerOpen(false)
    }

    const getBase = () => {
        if (isLoading) {
            return
        }
        setIsLoading(true)

        void r_sys_tool_base_getList()
            .then((res) => {
                const response = res.data
                if (response.code === DATABASE_SELECT_SUCCESS) {
                    setBaseData(response.data!)
                } else {
                    void message.error('获取失败，请稍后重试')
                }
            })
            .finally(() => {
                setIsLoading(false)
            })
    }

    const handleOnExpand = (expanded: boolean, record: ToolBaseVo) => {
        if (!expanded) {
            setEditingFiles(undefined)
            return
        }
        getBaseDetail(record)
    }

    const getBaseDetail = (record: ToolBaseVo) => {
        if (baseDetailLoading[record.id]) {
            return
        }
        setBaseDetailLoading({ ...baseDetailLoading, [record.id]: true })

        void r_sys_tool_base_get_one(record.id)
            .then((res) => {
                const response = res.data
                switch (response.code) {
                    case DATABASE_SELECT_SUCCESS:
                        setBaseDetailData({ ...baseDetailData, [record.id]: response.data! })
                        break
                    default:
                        void message.error(`获取基板 ${record.name} 文件内容失败，请稍后重试`)
                }
            })
            .finally(() => {
                setBaseDetailLoading({ ...baseDetailLoading, [record.id]: false })
            })
    }

    const expandedRowRender = (record: ToolBaseVo) => {
        const baseDetailVo = baseDetailData[record.id]
        let sourceFiles: IFiles | undefined = undefined
        let sourceFileList: IFile[] = []
        if (baseDetailVo) {
            sourceFiles = base64ToFiles(baseDetailVo.source.data)
            sourceFileList = Object.values(sourceFiles)
        }

        const detailColumns: _ColumnsType<IFile> = [
            { title: '文件名', dataIndex: 'name' },
            {
                title: (
                    <>
                        文件总大小
                        <br />
                        {sourceFiles ? getFilesSize(sourceFiles) : 'Unknown'}
                    </>
                ),
                width: '10em',
                align: 'center'
            },
            {
                title: (
                    <>
                        修改时间
                        <br />
                        {baseDetailVo ? utcToLocalTime(baseDetailVo.source.updateTime) : 'Unknown'}
                    </>
                ),
                width: '15em',
                align: 'center'
            },
            {
                title: (
                    <>
                        操作 (<a style={{ color: COLOR_PRODUCTION }}>新增</a>)
                    </>
                ),
                dataIndex: 'enable',
                width: '10em',
                align: 'center',
                render: (_, record) => (
                    <>
                        <AntdSpace size={'middle'}>
                            <Permission operationCode={'system:tool:modify:category'}>
                                <a onClick={handleOnEditFile()} style={{ color: COLOR_PRODUCTION }}>
                                    编辑
                                </a>
                            </Permission>
                            <Permission operationCode={'system:tool:delete:category'}>
                                <a
                                    onClick={handleOnDeleteFile(record.name)}
                                    style={{ color: COLOR_PRODUCTION }}
                                >
                                    删除
                                </a>
                            </Permission>
                        </AntdSpace>
                    </>
                )
            }
        ]

        const handleOnEditFile = () => {
            return () => {}
        }

        const handleOnDeleteFile = (fileName: string) => {
            return () => {
                if (hasEdited) {
                    void message.warning('删除文件前请先保存更改')
                    return
                }

                modal
                    .confirm({
                        title: '确定删除',
                        content: `确定删除文件 ${fileName} 吗？`
                    })
                    .then(
                        (confirmed) => {
                            if (confirmed) {
                                setBaseDetailLoading({ ...baseDetailLoading, [record.id]: true })

                                delete sourceFiles![fileName]

                                void r_sys_tool_base_update({
                                    id: record.id,
                                    source: filesToBase64(sourceFiles!)
                                })
                                    .then((res) => {
                                        const response = res.data
                                        switch (response.code) {
                                            case DATABASE_UPDATE_SUCCESS:
                                                void message.success('删除成功')
                                                setTimeout(() => {
                                                    getBaseDetail(record)
                                                })
                                                break
                                            default:
                                                void message.error('删除失败，请稍后重试')
                                        }
                                    })
                                    .finally(() => {
                                        setBaseDetailLoading({
                                            ...baseDetailLoading,
                                            [record.id]: false
                                        })
                                    })
                            }
                        },
                        () => {}
                    )
            }
        }

        return (
            <Card>
                <AntdTable
                    loading={baseDetailLoading[record.id]}
                    dataSource={sourceFileList}
                    columns={detailColumns}
                    pagination={false}
                />
            </Card>
        )
    }

    useEffect(() => {
        form.validateFields({ validateOnly: true }).then(
            () => {
                setSubmittable(true)
            },
            () => {
                setSubmittable(false)
            }
        )

        if (!isDrawerEdit && formValues) {
            setNewFormValues({
                name: formValues.name,
                enable: formValues.enable
            })
        }
    }, [formValues])

    useEffect(() => {
        getBase()
    }, [])

    const drawerToolbar = (
        <AntdSpace>
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

    const addAndEditForm = (
        <AntdForm form={form} disabled={isSubmitting} layout={'vertical'}>
            <AntdForm.Item hidden={!isDrawerEdit} name={'id'} label={'ID'}>
                <AntdInput disabled />
            </AntdForm.Item>
            <AntdForm.Item
                name={'name'}
                label={'名称'}
                rules={[{ required: true, whitespace: false }]}
            >
                <AntdInput allowClear />
            </AntdForm.Item>
            <AntdForm.Item name={'enable'} label={'状态'}>
                <AntdSwitch checkedChildren={'启用'} unCheckedChildren={'禁用'} />
            </AntdForm.Item>
        </AntdForm>
    )

    return (
        <>
            <FitFullscreen data-component={'system-tools-base'}>
                <FlexBox direction={'horizontal'} className={'root-content'}>
                    <HideScrollbar>
                        <Card>
                            <AntdTable
                                dataSource={baseData}
                                columns={baseColumns}
                                rowKey={(record) => record.id}
                                loading={isLoading}
                                pagination={false}
                                expandable={{
                                    expandedRowRender,
                                    onExpand: handleOnExpand
                                }}
                            />
                        </Card>
                    </HideScrollbar>
                    {editingFiles && (
                        <Card>
                            <CodeEditor
                                files={editingFiles}
                                selectedFileName={editingFileName}
                                onSelectedFileChange={() => {}}
                                showFileSelector={false}
                            />
                        </Card>
                    )}
                </FlexBox>
                <AntdDrawer
                    title={isDrawerEdit ? '编辑基板' : '添加基板'}
                    onClose={handleOnDrawerClose}
                    open={isDrawerOpen}
                    closable={!isSubmitting}
                    maskClosable={!isSubmitting}
                    extra={drawerToolbar}
                >
                    {addAndEditForm}
                </AntdDrawer>
            </FitFullscreen>
            {contextHolder}
        </>
    )
}

export default Base
