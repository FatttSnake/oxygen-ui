import React from 'react'
import FitFullScreen from '@/components/common/FitFullScreen'
import Card from '@/components/common/Card'
import { r_getSysLog } from '@/services/system'
import {
    COLOR_ERROR_SECONDARY,
    COLOR_FONT_SECONDARY,
    DATABASE_SELECT_SUCCESS
} from '@/constants/common.constants'
import HideScrollbar from '@/components/common/HideScrollbar'
import { getLocalTime } from '@/utils/common'
import FlexBox from '@/components/common/FlexBox'

const Log: React.FC = () => {
    const [logData, setLogData] = useState<SysLogGetVo[]>([])
    const [loading, setLoading] = useState(false)
    const [tableParams, setTableParams] = useState<TableParams>({
        pagination: {
            current: 1,
            pageSize: 20,
            position: ['bottomCenter']
        }
    })
    const [searchRequestUrl, setSearchRequestUrl] = useState('')
    const [useRegex, setUseRegex] = useState(false)
    const [isRegexLegal, setIsRegexLegal] = useState(true)
    const [timeRange, setTimeRange] = useState<[string, string]>()

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
            align: 'center',
            onCell: () => ({
                style: {
                    wordBreak: 'break-word'
                }
            })
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

    const handleOnSearchUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchRequestUrl(e.target.value)

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

    const handleOnSearchUrlKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            getLog()
        }
    }

    const handleOnUseRegexChange = (e: _CheckboxChangeEvent) => {
        setUseRegex(e.target.checked)
        if (e.target.checked) {
            try {
                RegExp(searchRequestUrl)
                setIsRegexLegal(
                    !(searchRequestUrl.includes('{}') || searchRequestUrl.includes('[]'))
                )
            } catch (e) {
                setIsRegexLegal(false)
            }
        } else {
            setIsRegexLegal(true)
        }
    }

    const handleOnDateRangeChange = (_dates: unknown, dateStrings: [string, string]) => {
        if (dateStrings[0] && dateStrings[1]) {
            setTimeRange([
                new Date(dateStrings[0]).toISOString(),
                new Date(dateStrings[1]).toISOString()
            ])
        } else {
            setTimeRange(undefined)
        }
    }

    const handleOnQueryBtnClick = () => {
        getLog()
    }

    const getLog = () => {
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

        void r_getSysLog({
            currentPage: tableParams.pagination?.current,
            pageSize: tableParams.pagination?.pageSize,
            sortField:
                tableParams.sortField && tableParams.sortOrder
                    ? (tableParams.sortField as string)
                    : undefined,
            sortOrder:
                tableParams.sortField && tableParams.sortOrder ? tableParams.sortOrder : undefined,
            searchRequestUrl: searchRequestUrl.trim().length ? searchRequestUrl : undefined,
            searchRegex: useRegex ? useRegex : undefined,
            searchStartTime: timeRange && timeRange[0],
            searchEndTime: timeRange && timeRange[1],
            ...tableParams.filters
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
                    <FlexBox gap={20}>
                        <FlexBox direction={'horizontal'} gap={10}>
                            <Card style={{ overflow: 'inherit' }}>
                                <AntdInput
                                    addonBefore={
                                        <span
                                            style={{
                                                fontSize: '0.9em',
                                                color: COLOR_FONT_SECONDARY
                                            }}
                                        >
                                            请求 Url
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
                                    value={searchRequestUrl}
                                    onChange={handleOnSearchUrlChange}
                                    onKeyDown={handleOnSearchUrlKeyDown}
                                    status={isRegexLegal ? undefined : 'error'}
                                />
                            </Card>
                            <Card style={{ overflow: 'inherit', flex: '0 0 auto' }}>
                                <AntdDatePicker.RangePicker
                                    showTime
                                    allowClear
                                    changeOnBlur
                                    onChange={handleOnDateRangeChange}
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
                                dataSource={logData}
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

export default Log
