import React, { useEffect, useState } from 'react'
import FitFullScreen from '@/components/common/FitFullScreen'
import HideScrollbar from '@/components/common/HideScrollbar'
import FlexBox from '@/components/common/FlexBox'
import Card from '@/components/common/Card'
import {
    r_role_add,
    r_role_changStatus,
    r_power_get,
    r_role_get,
    r_role_update,
    r_role_delete
} from '@/services/system.tsx'
import {
    COLOR_ERROR_SECONDARY,
    COLOR_FONT_SECONDARY,
    COLOR_PRODUCTION,
    DATABASE_DELETE_SUCCESS,
    DATABASE_DUPLICATE_KEY,
    DATABASE_INSERT_SUCCESS,
    DATABASE_SELECT_SUCCESS,
    DATABASE_UPDATE_SUCCESS
} from '@/constants/common.constants.ts'
import Icon from '@ant-design/icons'
import { powerListToPowerTree } from '@/utils/common.ts'

const Role: React.FC = () => {
    const [modal, contextHolder] = AntdModal.useModal()
    const [form] = AntdForm.useForm<RoleAddEditParam>()
    const formValues = AntdForm.useWatch([], form)
    const [newFormValues, setNewFormValues] = useState<RoleAddEditParam>()
    const [roleData, setRoleData] = useState<RoleWithPowerGetVo[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [tableParams, setTableParams] = useState<TableParam>({
        pagination: {
            current: 1,
            pageSize: 20,
            position: ['bottomCenter']
        }
    })
    const [searchName, setSearchName] = useState('')
    const [isUseRegex, setIsUseRegex] = useState(false)
    const [isRegexLegal, setIsRegexLegal] = useState(true)
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [isDrawerEdit, setIsDrawerEdit] = useState(false)
    const [submittable, setSubmittable] = useState(false)
    const [powerTreeData, setPowerTreeData] = useState<_DataNode[]>([])
    const [isLoadingPower, setIsLoadingPower] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const dataColumns: _ColumnsType<RoleWithPowerGetVo> = [
        {
            title: '名称',
            dataIndex: 'name',
            width: '20%'
        },
        {
            title: '权限',
            dataIndex: 'tree',
            render: (value: _DataNode[]) => <AntdTree treeData={value} />
        },
        {
            title: '状态',
            dataIndex: 'enable',
            width: '0',
            align: 'center',
            render: (value) =>
                value ? <AntdTag color={'success'}>启用</AntdTag> : <AntdTag>禁用</AntdTag>
        },
        {
            title: '操作',
            dataIndex: 'enable',
            width: '15em',
            align: 'center',
            render: (value, record) => (
                <>
                    <AntdSpace size={'middle'}>
                        {value ? (
                            <a
                                style={{ color: COLOR_PRODUCTION }}
                                onClick={handleOnChangStatusBtnClick(record.id, false)}
                            >
                                禁用
                            </a>
                        ) : (
                            <a
                                style={{ color: COLOR_PRODUCTION }}
                                onClick={handleOnChangStatusBtnClick(record.id, true)}
                            >
                                启用
                            </a>
                        )}
                        <a
                            style={{ color: COLOR_PRODUCTION }}
                            onClick={handleOnEditBtnClick(record)}
                        >
                            编辑
                        </a>
                        <a
                            style={{ color: COLOR_PRODUCTION }}
                            onClick={handleOnDeleteBtnClick(record)}
                        >
                            删除
                        </a>
                    </AntdSpace>
                </>
            )
        }
    ]

    const handleOnTableChange = (
        pagination: _TablePaginationConfig,
        filters: Record<string, _FilterValue | null>,
        sorter: _SorterResult<RoleWithPowerGetVo> | _SorterResult<RoleWithPowerGetVo>[]
    ) => {
        if (Array.isArray(sorter)) {
            setTableParams({
                pagination,
                filters,
                sortField: sorter.map((value) => value.field).join(',')
            })
        } else {
            setTableParams({
                pagination,
                filters,
                sortField: sorter.field,
                sortOrder: sorter.order
            })
        }

        if (pagination.pageSize !== tableParams.pagination?.pageSize) {
            setRoleData([])
        }
    }

    const handleOnAddBtnClick = () => {
        setIsDrawerEdit(false)
        setIsDrawerOpen(true)
        form.setFieldValue('id', undefined)
        form.setFieldValue('name', newFormValues?.name)
        form.setFieldValue('powerIds', newFormValues?.powerIds)
        form.setFieldValue('enable', newFormValues?.enable ?? true)
    }

    const handleOnEditBtnClick = (value: RoleWithPowerGetVo) => {
        return () => {
            setIsDrawerEdit(true)
            setIsDrawerOpen(true)
            form.setFieldValue('id', value.id)
            form.setFieldValue('name', value.name)
            form.setFieldValue(
                'powerIds',
                value.operations.map((operation) => operation.powerId)
            )
            form.setFieldValue('enable', value.enable)
            void form.validateFields()
        }
    }

    const handleOnDeleteBtnClick = (value: RoleWithPowerGetVo) => {
        return () => {
            modal
                .confirm({
                    title: '确定删除',
                    content: `确定删除角色 ${value.name} 吗？`
                })
                .then(
                    (confirmed) => {
                        if (confirmed) {
                            setIsSubmitting(true)
                            r_role_delete(value.id)
                                .then((res) => {
                                    const data = res.data
                                    if (data.code === DATABASE_DELETE_SUCCESS) {
                                        void message.success('删除成功')
                                        getRole()
                                    } else {
                                        void message.error('删除失败，请稍后重试')
                                    }
                                })
                                .finally(() => {
                                    setIsSubmitting(false)
                                })
                        }
                    },
                    () => {}
                )
        }
    }

    const handleOnDrawerClose = () => {
        setIsDrawerOpen(false)
    }

    const handleOnSubmit = () => {
        if (isSubmitting) {
            return
        }

        setIsSubmitting(true)

        if (isDrawerEdit) {
            void r_role_update(formValues)
                .then((res) => {
                    const data = res.data
                    switch (data.code) {
                        case DATABASE_UPDATE_SUCCESS:
                            setIsDrawerOpen(false)
                            void message.success('更新成功')
                            getRole()
                            break
                        case DATABASE_DUPLICATE_KEY:
                            void message.error('已存在相同名称的角色')
                            break
                        default:
                            void message.error('更新失败，请稍后重试')
                    }
                })
                .finally(() => {
                    setIsSubmitting(false)
                })
        } else {
            void r_role_add(formValues)
                .then((res) => {
                    const data = res.data
                    switch (data.code) {
                        case DATABASE_INSERT_SUCCESS:
                            setIsDrawerOpen(false)
                            void message.success('添加成功')
                            setNewFormValues(undefined)
                            getRole()
                            break
                        case DATABASE_DUPLICATE_KEY:
                            void message.error('已存在相同名称的角色')
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

    const handleOnSearchNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchName(e.target.value)

        if (isUseRegex) {
            try {
                RegExp(e.target.value)
                setIsRegexLegal(!(e.target.value.includes('{}') || e.target.value.includes('[]')))
            } catch (e) {
                setIsRegexLegal(false)
            }
        } else {
            setIsRegexLegal(true)
        }
    }

    const handleOnSearchNameKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            getRole()
        }
    }

    const handleOnUseRegexChange = (e: _CheckboxChangeEvent) => {
        setIsUseRegex(e.target.checked)
        if (e.target.checked) {
            try {
                RegExp(searchName)
                setIsRegexLegal(!(searchName.includes('{}') || searchName.includes('[]')))
            } catch (e) {
                setIsRegexLegal(false)
            }
        } else {
            setIsRegexLegal(true)
        }
    }

    const handleOnQueryBtnClick = () => {
        getRole()
    }

    const handleOnChangStatusBtnClick = (id: string, newStatus: boolean) => {
        return () => {
            if (isLoading) {
                return
            }

            setIsLoading(true)
            void r_role_changStatus({ id, enable: newStatus })
                .then((res) => {
                    const data = res.data
                    if (data.code === DATABASE_UPDATE_SUCCESS) {
                        getRole()
                    } else {
                        void message.error('更新失败，请稍后重试')
                    }
                })
                .finally(() => {
                    setIsLoading(false)
                })
        }
    }

    const getRole = () => {
        if (isLoading) {
            return
        }

        if (!isRegexLegal) {
            void message.error('非法正则表达式')
            return
        }

        setIsLoading(true)

        void r_role_get({
            currentPage: tableParams.pagination?.current,
            pageSize: tableParams.pagination?.pageSize,
            sortField:
                tableParams.sortField && tableParams.sortOrder
                    ? (tableParams.sortField as string)
                    : undefined,
            sortOrder:
                tableParams.sortField && tableParams.sortOrder ? tableParams.sortOrder : undefined,
            searchName: searchName.trim().length ? searchName : undefined,
            searchRegex: isUseRegex ? isUseRegex : undefined,
            ...tableParams.filters
        })
            .then((res) => {
                const data = res.data
                if (data.code === DATABASE_SELECT_SUCCESS) {
                    const records = data.data?.records

                    records?.map((value) => {
                        value.tree = powerListToPowerTree(
                            value.modules,
                            value.menus,
                            value.elements,
                            value.operations
                        )

                        return value
                    })

                    records && setRoleData(records)
                    data.data &&
                        setTableParams({
                            ...tableParams,
                            pagination: {
                                ...tableParams.pagination,
                                total: data.data.total
                            }
                        })
                } else {
                    void message.error('获取失败，请稍后重试')
                }
            })
            .finally(() => {
                setIsLoading(false)
            })
    }

    const getPowerTreeData = () => {
        if (isLoadingPower) {
            return
        }

        setIsLoadingPower(true)

        void r_power_get()
            .then((res) => {
                const data = res.data

                if (data.code === DATABASE_SELECT_SUCCESS) {
                    const powerSet = data.data
                    powerSet &&
                        setPowerTreeData(
                            powerListToPowerTree(
                                powerSet.moduleList,
                                powerSet.menuList,
                                powerSet.elementList,
                                powerSet.operationList
                            )
                        )
                } else {
                    void message.error('获取权限列表失败，请稍后重试')
                }
            })
            .finally(() => {
                setIsLoadingPower(false)
            })
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
                powerIds: formValues.powerIds,
                enable: formValues.enable
            })
        }
    }, [formValues])

    useEffect(() => {
        getPowerTreeData()
    }, [])

    useEffect(() => {
        getRole()
    }, [
        JSON.stringify(tableParams.filters),
        JSON.stringify(tableParams.sortField),
        JSON.stringify(tableParams.sortOrder),
        JSON.stringify(tableParams.pagination?.pageSize),
        JSON.stringify(tableParams.pagination?.current)
    ])

    return (
        <>
            <FitFullScreen>
                <HideScrollbar
                    style={{ padding: 30 }}
                    isShowVerticalScrollbar
                    autoHideWaitingTime={500}
                >
                    <FlexBox gap={20}>
                        <FlexBox direction={'horizontal'} gap={10}>
                            <Card style={{ overflow: 'inherit', flex: '0 0 auto' }}>
                                <AntdButton
                                    type={'primary'}
                                    style={{ padding: '4px 8px' }}
                                    onClick={handleOnAddBtnClick}
                                >
                                    <Icon
                                        component={IconFatwebPlus}
                                        style={{ fontSize: '1.5em' }}
                                    />
                                </AntdButton>
                            </Card>
                            <Card style={{ overflow: 'inherit' }}>
                                <AntdInput
                                    addonBefore={
                                        <span
                                            style={{
                                                fontSize: '0.9em',
                                                color: COLOR_FONT_SECONDARY
                                            }}
                                        >
                                            名称
                                        </span>
                                    }
                                    suffix={
                                        <>
                                            {!isRegexLegal ? (
                                                <span style={{ color: COLOR_ERROR_SECONDARY }}>
                                                    非法表达式
                                                </span>
                                            ) : undefined}
                                            <AntdCheckbox
                                                checked={isUseRegex}
                                                onChange={handleOnUseRegexChange}
                                            >
                                                <AntdTooltip title={'正则表达式'}>.*</AntdTooltip>
                                            </AntdCheckbox>
                                        </>
                                    }
                                    allowClear
                                    value={searchName}
                                    onChange={handleOnSearchNameChange}
                                    onKeyDown={handleOnSearchNameKeyDown}
                                    status={isRegexLegal ? undefined : 'error'}
                                />
                            </Card>
                            <Card style={{ overflow: 'inherit', flex: '0 0 auto' }}>
                                <AntdButton onClick={handleOnQueryBtnClick} type={'primary'}>
                                    查询
                                </AntdButton>
                            </Card>
                        </FlexBox>
                        <Card>
                            <AntdTable
                                dataSource={roleData}
                                columns={dataColumns}
                                rowKey={(record) => record.id}
                                pagination={tableParams.pagination}
                                loading={isLoading}
                                onChange={handleOnTableChange}
                            />
                        </Card>
                    </FlexBox>
                </HideScrollbar>
            </FitFullScreen>
            <AntdDrawer
                title={isDrawerEdit ? '编辑角色' : '添加角色'}
                onClose={handleOnDrawerClose}
                open={isDrawerOpen}
                closable={!isSubmitting}
                maskClosable={!isSubmitting}
                extra={
                    <AntdSpace>
                        <AntdTooltip title={'刷新权限列表'}>
                            <AntdButton onClick={getPowerTreeData} disabled={isSubmitting}>
                                <Icon component={IconFatwebRefresh} />
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
                }
            >
                <AntdForm form={form} disabled={isSubmitting}>
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
                    <AntdForm.Item name={'powerIds'} label={'权限'}>
                        <AntdTreeSelect
                            treeData={powerTreeData}
                            treeCheckable
                            treeNodeLabelProp={'fullTitle'}
                            allowClear
                            loading={isLoadingPower}
                        />
                    </AntdForm.Item>
                    <AntdForm.Item
                        valuePropName={'checked'}
                        name={'enable'}
                        label={'启用'}
                        rules={[{ required: true, type: 'boolean' }]}
                    >
                        <AntdSwitch />
                    </AntdForm.Item>
                </AntdForm>
            </AntdDrawer>
            {contextHolder}
        </>
    )
}

export default Role
