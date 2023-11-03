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
        { title: '类型', dataIndex: 'logType' },
        {
            title: '操作者',
            dataIndex: 'operateUserId'
        },
        {
            title: '操作时间',
            dataIndex: 'operateTime',
            render: (value) => getLocalTime(value)
        },
        {
            title: '请求 Uri',
            dataIndex: 'requestUri'
        },
        {
            title: '请求方式',
            dataIndex: 'requestMethod'
        },
        {
            title: '请求参数',
            dataIndex: 'requestParams'
        },
        {
            title: '请求 IP',
            dataIndex: 'requestIp'
        },
        {
            title: '请求服务器地址',
            dataIndex: 'requestServerAddress'
        },
        {
            title: '异常信息',
            dataIndex: 'exceptionInfo'
        },
        {
            title: '执行时间',
            dataIndex: 'executeTime',
            render: (value) => `${value}ms`
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

        r_getSysLog({
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
