import React, { useState } from 'react'
import { ColumnsType, FilterValue, SorterResult } from 'antd/es/table/interface'
import { TablePaginationConfig } from 'antd/lib'
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

    const dataColumns: ColumnsType<SysLogGetVo> = [
        {
            title: '类型',
            dataIndex: 'logType',
            render: (value) =>
                value === 'ERROR' ? (
                    <AntdTag color={'error'}>{value}</AntdTag>
                ) : (
                    <AntdTag>{value}</AntdTag>
                ),
            align: 'center'
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
            title: '操作时间',
            dataIndex: 'operateTime',
            render: (value: string) => getLocalTime(value),
            align: 'center'
        },
        {
            title: '请求方式',
            dataIndex: 'requestMethod',
            align: 'center'
        },
        {
            title: '请求 Url',
            render: (_value, record) =>
                `${record.requestServerAddress}${record.requestUri}${
                    record.requestParams ? `?${record.requestParams}` : ''
                }`
        },
        {
            title: '请求 IP',
            dataIndex: 'requestIp',
            align: 'center'
        },
        {
            title: '异常',
            dataIndex: 'exception',
            render: (value: boolean, record) => (value ? record.exceptionInfo : '无'),
            align: 'center'
        },
        {
            title: '执行时间',
            dataIndex: 'executeTime',
            render: (value, record) => (
                <AntdTooltip
                    title={`${getLocalTime(record.startTime)} - ${getLocalTime(record.endTime)}`}
                >
                    {`${value}ms`}
                </AntdTooltip>
            ),
            align: 'center'
        },
        {
            title: '用户代理',
            dataIndex: 'userAgent'
        }
    ]

    const handleOnTableChange = (
        pagination: TablePaginationConfig,
        filters: Record<string, FilterValue | null>,
        sorter: SorterResult<SysLogGetVo> | SorterResult<SysLogGetVo>[]
    ) => {
        setTableParams({ pagination, filters, ...sorter })

        if (pagination.pageSize !== tableParams.pagination?.pageSize) {
            setLogData([])
        }
    }

    const getLog = () => {
        if (loading) {
            return
        }

        void r_getSysLog({
            currentPage: tableParams.pagination?.current,
            pageSize: tableParams.pagination?.pageSize
        })
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
