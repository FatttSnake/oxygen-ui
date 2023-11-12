import React, { useState } from 'react'
import FitFullScreen from '@/components/common/FitFullScreen'
import HideScrollbar from '@/components/common/HideScrollbar'
import FlexBox from '@/components/common/FlexBox'
import Card from '@/components/common/Card'
import { r_changeRoleStatus, r_getRole } from '@/services/system.tsx'
import {
    COLOR_ERROR_SECONDARY,
    COLOR_FONT_SECONDARY,
    COLOR_PRODUCTION,
    DATABASE_SELECT_SUCCESS
} from '@/constants/common.constants.ts'
import Icon from '@ant-design/icons'

const Role: React.FC = () => {
    const [roleData, setRoleData] = useState<RoleWithPowerGetVo[]>([])
    const [loading, setLoading] = useState(false)
    const [tableParams, setTableParams] = useState<TableParam>({
        pagination: {
            current: 1,
            pageSize: 20,
            position: ['bottomCenter']
        }
    })
    const [searchName, setSearchName] = useState('')
    const [useRegex, setUseRegex] = useState(false)
    const [isRegexLegal, setIsRegexLegal] = useState(true)

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
                        <a style={{ color: COLOR_PRODUCTION }}>编辑</a>
                        <a style={{ color: COLOR_PRODUCTION }}>删除</a>
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

    const handleOnSearchNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchName(e.target.value)

        if (useRegex) {
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
        setUseRegex(e.target.checked)
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
            void r_changeRoleStatus({ id, enable: newStatus })
        }
    }

    const getRole = () => {
        if (loading) {
            return
        }

        if (!isRegexLegal) {
            void message.error({
                content: '非法正则表达式'
            })
            return
        }

        setLoading(true)

        void r_getRole({
            currentPage: tableParams.pagination?.current,
            pageSize: tableParams.pagination?.pageSize,
            sortField:
                tableParams.sortField && tableParams.sortOrder
                    ? (tableParams.sortField as string)
                    : undefined,
            sortOrder:
                tableParams.sortField && tableParams.sortOrder ? tableParams.sortOrder : undefined,
            searchName: searchName.trim().length ? searchName : undefined,
            searchRegex: useRegex ? useRegex : undefined,
            ...tableParams.filters
        })
            .then((res) => {
                const data = res.data
                if (data.code === DATABASE_SELECT_SUCCESS) {
                    const records = data.data?.records

                    records?.map((value) => {
                        const menuMap = new Map<number, _DataNode[]>()
                        const elementMap = new Map<number, _DataNode[]>()
                        const operationMap = new Map<number, _DataNode[]>()

                        value.operations.forEach((operation) => {
                            if (
                                operationMap.has(operation.elementId) &&
                                operationMap.get(operation.elementId) !== null
                            ) {
                                operationMap
                                    .get(operation.elementId)
                                    ?.push({ title: operation.name, key: operation.powerId })
                            } else {
                                operationMap.set(operation.elementId, [
                                    { title: operation.name, key: operation.powerId }
                                ])
                            }
                        })

                        value.elements.forEach((element) => {
                            if (
                                elementMap.has(element.menuId) &&
                                elementMap.get(element.menuId) !== null
                            ) {
                                elementMap.get(element.menuId)?.push({
                                    title: element.name,
                                    key: element.powerId,
                                    children: operationMap.get(element.id)
                                })
                            } else {
                                elementMap.set(element.menuId, [
                                    {
                                        title: element.name,
                                        key: element.powerId,
                                        children: operationMap.get(element.id)
                                    }
                                ])
                            }
                        })

                        value.menus.forEach((menu) => {
                            if (menuMap.has(menu.moduleId) && menuMap.get(menu.moduleId) !== null) {
                                menuMap.get(menu.moduleId)?.push({
                                    title: menu.name,
                                    key: menu.powerId,
                                    children: elementMap.get(menu.id)
                                })
                            } else {
                                menuMap.set(menu.moduleId, [
                                    {
                                        title: menu.name,
                                        key: menu.powerId,
                                        children: elementMap.get(menu.id)
                                    }
                                ])
                            }
                        })

                        value.tree = value.modules.map((module) => ({
                            title: module.name,
                            key: module.powerId,
                            children: menuMap.get(module.id)
                        }))

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
                    void message.error({
                        content: '获取失败，请稍后重试'
                    })
                }
            })
            .finally(() => {
                setLoading(false)
            })
    }

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
                                <AntdButton type={'primary'} style={{ padding: '4px 8px' }}>
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
                                                checked={useRegex}
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
                                loading={loading}
                                onChange={handleOnTableChange}
                            />
                        </Card>
                    </FlexBox>
                </HideScrollbar>
            </FitFullScreen>
        </>
    )
}

export default Role
