import React, { useEffect, useState } from 'react'
import {
    COLOR_BACKGROUND,
    COLOR_ERROR_SECONDARY,
    COLOR_FONT_SECONDARY,
    COLOR_PRODUCTION,
    DATABASE_DELETE_SUCCESS,
    DATABASE_DUPLICATE_KEY,
    DATABASE_INSERT_SUCCESS,
    DATABASE_SELECT_SUCCESS,
    DATABASE_UPDATE_SUCCESS
} from '@/constants/common.constants'
import { ColumnsType } from 'antd/es/table/interface'
import FitFullScreen from '@/components/common/FitFullScreen.tsx'
import HideScrollbar from '@/components/common/HideScrollbar.tsx'
import FlexBox from '@/components/common/FlexBox.tsx'
import Card from '@/components/common/Card.tsx'
import Icon from '@ant-design/icons'
import {
    r_sys_group_get_list,
    r_sys_role_get_list,
    r_sys_user_add,
    r_sys_user_delete,
    r_sys_user_delete_list,
    r_sys_user_get,
    r_sys_user_update
} from '@/services/system.tsx'
import { getLocalTime, isPastTime } from '@/utils/common.tsx'
import { r_api_avatar_random_base64 } from '@/services/api/avatar.ts'
import moment from 'moment'

const User: React.FC = () => {
    const [modal, contextHolder] = AntdModal.useModal()
    const [form] = AntdForm.useForm<UserAddEditParam>()
    const formValues = AntdForm.useWatch([], form)
    const [newFormValues, setNewFormValues] = useState<UserAddEditParam>()
    const [userData, setUserData] = useState<UserWithRoleInfoVo[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [tableParams, setTableParams] = useState<TableParam>({
        pagination: {
            current: 1,
            pageSize: 20,
            position: ['bottomCenter']
        }
    })
    const [searchValue, setSearchValue] = useState('')
    const [isUseRegex, setIsUseRegex] = useState(false)
    const [isRegexLegal, setIsRegexLegal] = useState(true)
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [isDrawerEdit, setIsDrawerEdit] = useState(false)
    const [submittable, setSubmittable] = useState(false)
    const [roleData, setRoleData] = useState<RoleVo[]>([])
    const [groupData, setGroupData] = useState<GroupVo[]>([])
    const [isLoadingRole, setIsLoadingRole] = useState(false)
    const [isLoadingGroup, setIsLoadingGroup] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [tableSelectedItem, setTableSelectedItem] = useState<React.Key[]>([])
    const [avatar, setAvatar] = useState('')

    const dataColumns: ColumnsType<UserWithRoleInfoVo> = [
        {
            dataIndex: 'username',
            title: '用户',
            render: (value, record) => `${value}(${record.id})`,
            width: '0'
        },
        {
            dataIndex: ['userInfo', 'avatar'],
            title: '头像',
            render: (value) => (
                <AntdAvatar
                    src={<img src={`data:image/png;base64,${value}`} alt={'avatar'} />}
                    style={{ background: COLOR_BACKGROUND }}
                />
            ),
            width: '0',
            align: 'center'
        },
        {
            dataIndex: ['userInfo', 'nickname'],
            title: '昵称'
        },
        {
            dataIndex: ['userInfo', 'email'],
            title: '邮箱'
        },
        {
            dataIndex: ['roles'],
            title: '角色',
            render: (value: RoleVo[], record) =>
                record.id === '0' ? (
                    <AntdTag color={'blue'}>管理员</AntdTag>
                ) : value.length ? (
                    value.map((role) => (
                        <AntdTag key={role.id} color={role.enable ? 'purple' : 'orange'}>
                            {role.name}
                        </AntdTag>
                    ))
                ) : (
                    <AntdTag>无</AntdTag>
                ),
            align: 'center'
        },
        {
            dataIndex: ['groups'],
            title: '用户组',
            render: (value: GroupVo[], record) =>
                record.id === '0' ? (
                    <AntdTag color={'blue'}>管理员</AntdTag>
                ) : value.length ? (
                    value.map((role) => (
                        <AntdTag key={role.id} color={role.enable ? 'purple' : 'orange'}>
                            {role.name}
                        </AntdTag>
                    ))
                ) : (
                    <AntdTag>无</AntdTag>
                ),
            align: 'center'
        },
        {
            title: '最近登录',
            render: (_, record) =>
                record.currentLoginTime
                    ? `${getLocalTime(record.currentLoginTime)}【${record.currentLoginIp}】`
                    : '无',
            align: 'center'
        },
        {
            title: '状态',
            render: (_, record) =>
                !record.locking &&
                (!record.expiration || !isPastTime(record.expiration)) &&
                (!record.credentialsExpiration || !isPastTime(record.credentialsExpiration)) &&
                record.enable ? (
                    <AntdTag color={'green'}>正常</AntdTag>
                ) : (
                    <>
                        {record.locking ? <AntdTag>锁定</AntdTag> : undefined}
                        {record.expiration && isPastTime(record.expiration) ? (
                            <AntdTag>过期</AntdTag>
                        ) : undefined}
                        {record.credentialsExpiration &&
                        isPastTime(record.credentialsExpiration) ? (
                            <AntdTag>改密</AntdTag>
                        ) : undefined}
                        {!record.enable ? <AntdTag>禁用</AntdTag> : undefined}
                    </>
                ),
            align: 'center'
        },
        {
            title: '操作',
            width: '10em',
            align: 'center',
            render: (_, record) => (
                <>
                    <AntdSpace size={'middle'}>
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
        sorter: _SorterResult<UserWithRoleInfoVo> | _SorterResult<UserWithRoleInfoVo>[]
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
            setGroupData([])
        }
    }

    const handleOnTableSelectChange = (selectedRowKeys: React.Key[]) => {
        setTableSelectedItem(selectedRowKeys)
    }

    const handleOnAddBtnClick = () => {
        setIsDrawerEdit(false)
        setIsDrawerOpen(true)
        form.setFieldValue('id', undefined)
        form.setFieldValue('username', newFormValues?.username)
        form.setFieldValue('password', undefined)
        form.setFieldValue('locking', newFormValues?.locking ?? false)
        form.setFieldValue('expiration', newFormValues?.expiration)
        form.setFieldValue('credentialsExpiration', newFormValues?.credentialsExpiration)
        form.setFieldValue('enable', newFormValues?.enable ?? true)
        form.setFieldValue('nickname', newFormValues?.nickname)
        form.setFieldValue('avatar', newFormValues?.avatar)
        form.setFieldValue('email', newFormValues?.email)
        form.setFieldValue('roleIds', newFormValues?.roleIds)
        form.setFieldValue('groupIds', newFormValues?.groupIds)

        getAvatar()
    }

    const handleOnListDeleteBtnClick = () => {
        modal
            .confirm({
                title: '确定删除',
                content: `确定删除选中的 ${tableSelectedItem.length} 个用户吗？`
            })
            .then(
                (confirmed) => {
                    if (confirmed) {
                        setIsLoading(true)

                        void r_sys_user_delete_list(tableSelectedItem)
                            .then((res) => {
                                const data = res.data

                                if (data.code === DATABASE_DELETE_SUCCESS) {
                                    void message.success('删除成功')
                                    setTimeout(() => {
                                        getUser()
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

    const handleOnEditBtnClick = (value: UserWithRoleInfoVo) => {
        return () => {
            setIsDrawerEdit(true)
            setIsDrawerOpen(true)

            form.setFieldValue('id', value.id)
            form.setFieldValue('username', value.username)
            form.setFieldValue('password', undefined)
            form.setFieldValue('locking', value.locking)
            form.setFieldValue('expiration', value.expiration)
            form.setFieldValue('credentialsExpiration', value.credentialsExpiration)
            form.setFieldValue('enable', value.enable)
            form.setFieldValue('nickname', value.userInfo.nickname)
            form.setFieldValue('avatar', value.userInfo.avatar)
            form.setFieldValue('email', value.userInfo.email)
            form.setFieldValue(
                'roleIds',
                value.roles.map((role) => role.id)
            )
            form.setFieldValue(
                'groupIds',
                value.groups.map((group) => group.id)
            )
            void form.validateFields()
        }
    }

    const handleOnDeleteBtnClick = (value: UserWithRoleInfoVo) => {
        return () => {
            modal
                .confirm({
                    title: '确定删除',
                    content: `确定删除用户 ${value.username} 吗？`
                })
                .then(
                    (confirmed) => {
                        if (confirmed) {
                            setIsLoading(true)

                            void r_sys_user_delete(value.id)
                                .then((res) => {
                                    const data = res.data
                                    if (data.code === DATABASE_DELETE_SUCCESS) {
                                        void message.success('删除成功')
                                        setTimeout(() => {
                                            getUser()
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

    const handleOnDrawerClose = () => {
        setIsDrawerOpen(false)
    }

    const filterOption = (input: string, option?: { label: string; value: string }) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())

    const handleOnSubmit = () => {
        if (isSubmitting) {
            return
        }

        setIsSubmitting(true)

        if (isDrawerEdit) {
            void r_sys_user_update({
                ...formValues,
                expiration: formValues.expiration
                    ? new Date(formValues.expiration).toISOString()
                    : undefined,
                credentialsExpiration: formValues.credentialsExpiration
                    ? new Date(formValues.credentialsExpiration).toISOString()
                    : undefined
            })
                .then((res) => {
                    const data = res.data
                    switch (data.code) {
                        case DATABASE_UPDATE_SUCCESS:
                            setIsDrawerOpen(false)
                            void message.success('更新成功')
                            getUser()
                            break
                        case DATABASE_DUPLICATE_KEY:
                            void message.error('已存在相同用户名')
                            break
                        default:
                            void message.error('更新失败，请稍后重试')
                    }
                })
                .finally(() => {
                    setIsSubmitting(false)
                })
        } else {
            void r_sys_user_add({
                ...formValues,
                expiration: formValues.expiration
                    ? new Date(formValues.expiration).toISOString()
                    : undefined,
                credentialsExpiration: formValues.credentialsExpiration
                    ? new Date(formValues.credentialsExpiration).toISOString()
                    : undefined
            })
                .then((res) => {
                    const data = res.data
                    switch (data.code) {
                        case DATABASE_INSERT_SUCCESS:
                            setIsDrawerOpen(false)
                            void message.success('添加成功')
                            setNewFormValues(undefined)
                            getUser()
                            break
                        case DATABASE_DUPLICATE_KEY:
                            void message.error('已存在相同用户名')
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

    const handleOnSearchValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value)

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
            getUser()
        }
    }

    const handleOnUseRegexChange = (e: _CheckboxChangeEvent) => {
        setIsUseRegex(e.target.checked)
        if (e.target.checked) {
            try {
                RegExp(searchValue)
                setIsRegexLegal(!(searchValue.includes('{}') || searchValue.includes('[]')))
            } catch (e) {
                setIsRegexLegal(false)
            }
        } else {
            setIsRegexLegal(true)
        }
    }

    const handleOnQueryBtnClick = () => {
        getUser()
    }

    const getUser = () => {
        if (isLoading) {
            return
        }

        if (!isRegexLegal) {
            void message.error('非法正则表达式')
            return
        }

        setIsLoading(true)

        void r_sys_user_get()
            .then((res) => {
                const data = res.data
                if (data.code === DATABASE_SELECT_SUCCESS) {
                    const records = data.data?.records

                    records && setUserData(records)
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

    const handleOnDrawerRefresh = () => {
        getRoleData()
        getGroupData()
    }

    const getRoleData = () => {
        if (isLoadingRole) {
            return
        }

        setIsLoadingRole(true)

        void r_sys_role_get_list()
            .then((res) => {
                const data = res.data

                if (data.code === DATABASE_SELECT_SUCCESS) {
                    data.data && setRoleData(data.data)
                } else {
                    void message.error('获取角色列表失败，请稍后重试')
                }
            })
            .finally(() => {
                setIsLoadingRole(false)
            })
    }

    const getGroupData = () => {
        if (isLoadingGroup) {
            return
        }

        setIsLoadingGroup(true)

        void r_sys_group_get_list()
            .then((res) => {
                const data = res.data

                if (data.code === DATABASE_SELECT_SUCCESS) {
                    data.data && setGroupData(data.data)
                } else {
                    void message.error('获取用户组列表失败，请稍后重试')
                }
            })
            .finally(() => {
                setIsLoadingGroup(false)
            })
    }

    const getAvatar = () => {
        void r_api_avatar_random_base64().then((res) => {
            const response = res.data
            if (response.success) {
                response.data && setAvatar(response.data.base64)
                response.data && form.setFieldValue('avatar', response.data.base64)
            }
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
                username: formValues.username,
                locking: formValues.locking,
                expiration: formValues.expiration,
                credentialsExpiration: formValues.credentialsExpiration,
                enable: formValues.enable,
                nickname: formValues.nickname,
                avatar: formValues.avatar,
                email: formValues.email,
                roleIds: formValues.roleIds,
                groupIds: formValues.groupIds
            })
        }
    }, [formValues])

    useEffect(() => {
        handleOnDrawerRefresh()
    }, [])

    useEffect(() => {
        getUser()
    }, [
        JSON.stringify(tableParams.filters),
        JSON.stringify(tableParams.sortField),
        JSON.stringify(tableParams.sortOrder),
        JSON.stringify(tableParams.pagination?.pageSize),
        JSON.stringify(tableParams.pagination?.current)
    ])

    const addAndEditForm = (
        <AntdForm form={form} disabled={isSubmitting}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                <AntdTooltip title={'点击获取新头像'}>
                    <AntdAvatar
                        src={
                            <img
                                src={`data:image/png;base64,${
                                    isDrawerEdit ? formValues?.avatar : avatar
                                }`}
                                alt={'avatar'}
                            />
                        }
                        size={100}
                        style={{ background: COLOR_BACKGROUND }}
                        onClick={getAvatar}
                    />
                </AntdTooltip>
            </div>
            <AntdForm.Item hidden name={'avatar'}>
                <AntdInput />
            </AntdForm.Item>
            <AntdForm.Item hidden={!isDrawerEdit} name={'id'} label={'ID'}>
                <AntdInput disabled />
            </AntdForm.Item>
            <AntdForm.Item
                name={'username'}
                label={'用户名'}
                rules={[{ required: true, whitespace: false }]}
            >
                <AntdInput allowClear />
            </AntdForm.Item>
            <AntdForm.Item
                hidden={isDrawerEdit}
                name={'password'}
                label={'密码'}
                rules={[{ required: true, whitespace: false }]}
            >
                <AntdInput.Password allowClear />
            </AntdForm.Item>
            <AntdForm.Item name={'nickname'} label={'昵称'} rules={[{ whitespace: false }]}>
                <AntdInput allowClear />
            </AntdForm.Item>
            <AntdForm.Item
                name={'email'}
                label={'邮箱'}
                rules={[{ whitespace: false, type: 'email' }]}
            >
                <AntdInput type={'email'} allowClear />
            </AntdForm.Item>
            <AntdForm.Item name={'roleIds'} label={'角色'}>
                <AntdSelect
                    mode={'multiple'}
                    allowClear
                    showSearch
                    filterOption={filterOption}
                    options={roleData.map((value) => ({
                        value: value.id,
                        label: `${value.name}${!value.enable ? '(已禁用)' : ''}`
                    }))}
                />
            </AntdForm.Item>
            <AntdForm.Item name={'groupIds'} label={'用户组'}>
                <AntdSelect
                    mode={'multiple'}
                    allowClear
                    showSearch
                    filterOption={filterOption}
                    options={groupData.map((value) => ({
                        value: value.id,
                        label: `${value.name}${!value.enable ? '(已禁用)' : ''}`
                    }))}
                />
            </AntdForm.Item>
            <AntdForm.Item
                valuePropName={'checked'}
                name={'locking'}
                label={'锁定'}
                rules={[{ required: true, type: 'boolean' }]}
            >
                <AntdSwitch />
            </AntdForm.Item>
            <AntdForm.Item
                name={'expiration'}
                label={'过期时间'}
                getValueProps={(date: string) => (date ? { value: moment.utc(date) } : {})}
                getValueFromEvent={(_, dateString: string) =>
                    dateString ? moment(dateString).format('yyyy-MM-DD HH:mm:ss') : undefined
                }
            >
                <AntdDatePicker showTime allowClear changeOnBlur style={{ width: '100%' }} />
            </AntdForm.Item>
            <AntdForm.Item
                name={'credentialsExpiration'}
                label={'认证过期时间'}
                getValueProps={(date: string) => (date ? { value: moment.utc(date) } : {})}
                getValueFromEvent={(_, dateString: string) =>
                    dateString ? moment(dateString).format('yyyy-MM-DD HH:mm:ss') : undefined
                }
            >
                <AntdDatePicker showTime allowClear changeOnBlur style={{ width: '100%' }} />
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
    )

    const toolbar = (
        <FlexBox direction={'horizontal'} gap={10}>
            <Card style={{ overflow: 'inherit', flex: '0 0 auto' }}>
                <AntdButton
                    type={'primary'}
                    style={{ padding: '4px 8px' }}
                    onClick={handleOnAddBtnClick}
                >
                    <Icon component={IconFatwebPlus} style={{ fontSize: '1.2em' }} />
                </AntdButton>
            </Card>
            <Card
                hidden={tableSelectedItem.length === 0}
                style={{ overflow: 'inherit', flex: '0 0 auto' }}
            >
                <AntdButton style={{ padding: '4px 8px' }} onClick={handleOnListDeleteBtnClick}>
                    <Icon component={IconFatwebDelete} style={{ fontSize: '1.2em' }} />
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
                            内容
                        </span>
                    }
                    suffix={
                        <>
                            {!isRegexLegal ? (
                                <span style={{ color: COLOR_ERROR_SECONDARY }}>非法表达式</span>
                            ) : undefined}
                            <AntdCheckbox checked={isUseRegex} onChange={handleOnUseRegexChange}>
                                <AntdTooltip title={'正则表达式'}>.*</AntdTooltip>
                            </AntdCheckbox>
                        </>
                    }
                    allowClear
                    value={searchValue}
                    onChange={handleOnSearchValueChange}
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
    )

    const table = (
        <Card>
            <AntdTable
                dataSource={userData}
                columns={dataColumns}
                rowKey={(record) => record.id}
                pagination={tableParams.pagination}
                loading={isLoading}
                onChange={handleOnTableChange}
                rowSelection={{
                    type: 'checkbox',
                    onChange: handleOnTableSelectChange
                }}
            />
        </Card>
    )

    const drawerToolbar = (
        <AntdSpace>
            <AntdTooltip title={'刷新角色和用户组列表'}>
                <AntdButton onClick={handleOnDrawerRefresh} disabled={isSubmitting}>
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
    )

    return (
        <>
            <FitFullScreen>
                <HideScrollbar
                    style={{ padding: 30 }}
                    isShowVerticalScrollbar
                    autoHideWaitingTime={500}
                >
                    <FlexBox gap={20}>
                        {toolbar}
                        {table}
                    </FlexBox>
                </HideScrollbar>
            </FitFullScreen>
            <AntdDrawer
                title={isDrawerEdit ? '编辑用户' : '新增用户'}
                width={'36vw'}
                onClose={handleOnDrawerClose}
                open={isDrawerOpen}
                closable={!isSubmitting}
                maskClosable={!isSubmitting}
                extra={drawerToolbar}
            >
                {addAndEditForm}
            </AntdDrawer>
            {contextHolder}
        </>
    )
}

export default User
