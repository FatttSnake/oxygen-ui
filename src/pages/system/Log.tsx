import React, { useState } from 'react'
import FitFullScreen from '@/components/common/FitFullScreen.tsx'
import Card from '@/components/common/Card'
import { r_getSysLog } from '@/services/system.tsx'
import { DATABASE_SELECT_SUCCESS } from '@/constants/common.constants.ts'
import HideScrollbar from '@/components/common/HideScrollbar.tsx'
import { getLocalTime } from '@/utils/common.ts'

const Log: React.FC = () => {
    const tableCardRef = useRef<HTMLDivElement>(null)
    const [logData, setLogData] = useState<SysLogGetVo[]>([])
    const [loading, setLoading] = useState(false)
    const [tableParams, setTableParams] = useState<TableParams>({
        pagination: {
            current: 1,
            pageSize: 20,
            position: ['bottomCenter']
        }
    })

    const dataColumns: _ColumnsType<SysLogGetVo> = [
        {
            title: '类型',
            dataIndex: 'logType',
            render: (value) =>
                value === 'ERROR' ? (
                    <AntdTag color={'error'}>{value}</AntdTag>
                ) : (
                    <AntdTag>{value}</AntdTag>
                ),
            align: 'center',
            filters: [
                { text: 'Info', value: 'INFO' },
                { text: 'Error', value: 'ERROR' }
            ]
        },
        {
            title: '操作者',
            dataIndex: 'operateUsername',
            align: 'center',
            render: (value, record) =>
                value ? (
                    <AntdTag color={'purple'}>{`${value}(${record.operateUserId})`}</AntdTag>
                ) : (
                    <AntdTag>Anonymous</AntdTag>
                )
        },
        {
            title: '请求方式',
            dataIndex: 'requestMethod',
            align: 'center',
            filters: [
                { text: 'GET', value: 'GET' },
                { text: 'POST', value: 'POST' },
                { text: 'PUT', value: 'PUT' },
                { text: 'PATCH', value: 'PATCH' },
                { text: 'DELETE', value: 'DELETE' },
                { text: 'HEAD', value: 'HEAD' },
                { text: 'OPTIONS', value: 'OPTIONS' }
            ]
        },
        {
            title: '请求 Url',
            render: (_value, record) =>
                `${record.requestServerAddress}${record.requestUri}${
                    record.requestParams ? `?${record.requestParams}` : ''
                }`,
            onCell: () => ({
                style: {
                    wordBreak: 'break-word'
                }
            })
        },
        {
            title: '请求 IP',
            dataIndex: 'requestIp',
            align: 'center'
        },
        {
            title: '开始时间',
            dataIndex: 'startTime',
            render: (value: string) => getLocalTime(value),
            align: 'center',
            sorter: true
        },
        {
            title: '执行时间',
            dataIndex: 'executeTime',
            render: (value, record) => (
                <AntdTooltip
                    title={`${getLocalTime(record.startTime)} ~ ${getLocalTime(record.endTime)}`}
                >
                    {`${value}ms`}
                </AntdTooltip>
            ),
            align: 'center',
            sorter: true
        },
        {
            title: '异常',
            dataIndex: 'exception',
            render: (value: boolean, record) => (value ? record.exceptionInfo : '无'),
            align: 'center'
        },
        {
            title: '用户代理',
            dataIndex: 'userAgent',
            onCell: () => ({
                style: {
                    wordBreak: 'break-word'
                }
            })
        }
    ]

    const handleOnTableChange = (
        pagination: _TablePaginationConfig,
        filters: Record<string, _FilterValue | null>,
        sorter: _SorterResult<SysLogGetVo> | _SorterResult<SysLogGetVo>[]
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
            setLogData([])
        }
    }

    const getLog = () => {
        if (loading) {
            return
        }

        void r_getSysLog(
            tableParams.sortField && tableParams.sortOrder
                ? {
                      currentPage: tableParams.pagination?.current,
                      pageSize: tableParams.pagination?.pageSize,
                      sortField: tableParams.sortField as string,
                      sortOrder: tableParams.sortOrder,
                      ...tableParams.filters
                  }
                : {
                      currentPage: tableParams.pagination?.current,
                      pageSize: tableParams.pagination?.pageSize
                  }
        )
            .then((res) => {
                const data = res.data
                if (data.code === DATABASE_SELECT_SUCCESS) {
                    data.data && setLogData(data.data.records)
                    data.data &&
                        setTableParams({
                            ...tableParams,
                            pagination: {
                                ...tableParams.pagination,
                                total: data.data.total
                            }
                        })
                }
            })
            .finally(() => {
                setLoading(false)
            })
    }

    useEffect(() => {
        getLog()
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
                    <Card ref={tableCardRef}>
                        <AntdTable
                            dataSource={logData}
                            columns={dataColumns}
                            rowKey={(record) => record.id}
                            pagination={tableParams.pagination}
                            loading={loading}
                            onChange={handleOnTableChange}
                        />
                    </Card>
                </HideScrollbar>
            </FitFullScreen>
        </>
    )
}

export default Log
