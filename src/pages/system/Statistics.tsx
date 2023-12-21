import React, { useEffect, useState } from 'react'
import Icon from '@ant-design/icons'
import * as echarts from 'echarts/core'
import {
    TooltipComponent,
    TooltipComponentOption,
    GridComponent,
    GridComponentOption,
    ToolboxComponentOption,
    DataZoomComponentOption,
    ToolboxComponent,
    DataZoomComponent
} from 'echarts/components'
import { BarChart, BarSeriesOption, LineChart, LineSeriesOption } from 'echarts/charts'
import { UniversalTransition } from 'echarts/features'
import { SVGRenderer } from 'echarts/renderers'
import { TopLevelFormatterParams } from 'echarts/types/dist/shared'
import '@/assets/css/pages/system/statistics.scss'
import { useUpdatedEffect } from '@/util/hooks'
import { formatByteSize } from '@/util/common'
import { getTimesBetweenTwoTimes, utcToLocalTime } from '@/util/datetime'
import {
    r_sys_statistics_active,
    r_sys_statistics_cpu,
    r_sys_statistics_hardware,
    r_sys_statistics_online,
    r_sys_statistics_software,
    r_sys_statistics_storage
} from '@/services/system'
import Card from '@/components/common/Card'
import FlexBox from '@/components/common/FlexBox'
import FitFullscreen from '@/components/common/FitFullscreen'
import HideScrollbar from '@/components/common/HideScrollbar'
import LoadingMask from '@/components/common/LoadingMask'
import Permission from '@/components/common/Permission'

echarts.use([
    TooltipComponent,
    ToolboxComponent,
    GridComponent,
    DataZoomComponent,
    BarChart,
    LineChart,
    SVGRenderer,
    UniversalTransition
])
type EChartsOption = echarts.ComposeOption<
    | TooltipComponentOption
    | ToolboxComponentOption
    | GridComponentOption
    | BarSeriesOption
    | DataZoomComponentOption
    | LineSeriesOption
>

const barDefaultSeriesOption: BarSeriesOption = {
    type: 'bar',
    stack: 'total',
    itemStyle: {
        color: (params) => {
            switch (params.seriesName) {
                case 'idle':
                case 'free':
                    return '#F5F5F5'
                default:
                    return params.color ?? echarts.color.random()
            }
        }
    }
}

const barEChartsBaseOption: EChartsOption = {
    tooltip: {},
    xAxis: {
        show: false
    },
    yAxis: {
        axisLine: {
            show: false
        },
        axisLabel: {
            show: false
        },
        axisTick: {
            show: false
        },
        splitLine: {
            show: false
        },
        axisPointer: {
            show: false
        }
    }
}

const getTooltipTimeFormatter = (format: string = 'yyyy-MM-DD HH:mm:ss') => {
    return (params: TopLevelFormatterParams) =>
        `${utcToLocalTime(
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access
            params[0].data[0],
            format
        )}<br><span style="display: flex; justify-content: space-between"><span>${
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            params[0]['marker']
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        }${params[0]['seriesName']}</span><span style="font-weight: bold">${
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access
            params[0].data[1]
        }</span></span> `
}

const lineEChartsBaseOption: EChartsOption = {
    tooltip: {
        trigger: 'axis'
    },
    toolbox: {
        feature: {
            dataZoom: {
                yAxisIndex: 'none'
            },
            restore: {},
            saveAsImage: {}
        }
    },
    xAxis: {
        type: 'time'
    },
    yAxis: {
        type: 'value',
        interval: 1
    },
    dataZoom: [
        {
            type: 'inside',
            start: 0,
            end: 100,
            minValueSpan: 2 * 60 * 60 * 1000
        }
    ],
    series: [{}]
}

interface CommonCardProps extends React.PropsWithChildren {
    icon: IconComponent
    title: React.ReactNode
    loading?: boolean
    expand?: React.ReactNode
}

const CommonCard: React.FC<CommonCardProps> = (props) => {
    return (
        <Card style={{ overflow: 'visible' }}>
            <FlexBox className={'common-card'}>
                <FlexBox direction={'horizontal'} className={'head'}>
                    <Icon component={props.icon} className={'icon'} />
                    <div className={'title'}>{props.title}</div>
                    {props.expand}
                </FlexBox>
                <LoadingMask
                    hidden={!props.loading}
                    maskContent={<AntdSkeleton active paragraph={{ rows: 6 }} />}
                >
                    {props.children}
                </LoadingMask>
            </FlexBox>
        </Card>
    )
}

const OnlineInfo: React.FC = () => {
    const onlineInfoDivRef = useRef<HTMLDivElement>(null)
    const onlineInfoEChartsRef = useRef<echarts.EChartsType | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [currentOnlineCount, setCurrentOnlineCount] = useState(-1)
    const [scope, setScope] = useState('WEAK')

    useUpdatedEffect(() => {
        const chartResizeObserver = new ResizeObserver(() => {
            onlineInfoEChartsRef.current?.resize()
        })

        onlineInfoDivRef.current && chartResizeObserver.observe(onlineInfoDivRef.current)

        return () => {
            onlineInfoDivRef.current && chartResizeObserver.unobserve(onlineInfoDivRef.current)
        }
    }, [isLoading])

    useUpdatedEffect(() => {
        getOnlineInfo()
    }, [])

    const handleOnScopeChange = (value: string) => {
        setScope(value)
        getOnlineInfo(value)
    }

    const handleOnRefresh = () => {
        getOnlineInfo()
    }

    const getOnlineInfo = (_scope: string = scope) => {
        if (isLoading) {
            return
        }

        setIsLoading(true)
        setCurrentOnlineCount(-1)

        void r_sys_statistics_online({ scope: _scope }).then((res) => {
            const response = res.data
            if (response.success) {
                const data = response.data
                if (data) {
                    setIsLoading(false)

                    setCurrentOnlineCount(data.current)

                    setTimeout(() => {
                        const dataList = getTimesBetweenTwoTimes(
                            data.history[0].time,
                            data.history[data.history.length - 1].time,
                            'minute'
                        ).map((time) => [
                            time,
                            data.history.find(
                                (value) => value.time.substring(0, 16) === time.substring(0, 16)
                            )?.record ?? 0
                        ])

                        onlineInfoEChartsRef.current = echarts.init(
                            onlineInfoDivRef.current,
                            null,
                            { renderer: 'svg' }
                        )

                        onlineInfoEChartsRef.current?.setOption({
                            ...lineEChartsBaseOption,
                            tooltip: {
                                ...lineEChartsBaseOption.tooltip,
                                formatter: getTooltipTimeFormatter('yyyy-MM-DD HH:mm')
                            },
                            xAxis: {
                                ...lineEChartsBaseOption.xAxis
                            },
                            series: [
                                {
                                    name: '在线人数',
                                    type: 'line',
                                    smooth: true,
                                    symbol: 'none',
                                    areaStyle: {},
                                    data: dataList
                                }
                            ]
                        })
                    })
                }
            }
        })
    }

    return (
        <CommonCard
            icon={IconFatwebOnline}
            title={
                <>
                    <FlexBox gap={10} direction={'horizontal'}>
                        <span style={{ whiteSpace: 'nowrap' }}>在线用户</span>
                        <AntdTag>
                            {currentOnlineCount === -1 ? '获取中...' : `当前 ${currentOnlineCount}`}
                        </AntdTag>
                    </FlexBox>
                </>
            }
            loading={isLoading}
            expand={
                <>
                    <AntdSelect value={scope} onChange={handleOnScopeChange} disabled={isLoading}>
                        <AntdSelect.Option key={'DAY'}>今天</AntdSelect.Option>
                        <AntdSelect.Option key={'WEAK'}>最近7天</AntdSelect.Option>
                        <AntdSelect.Option key={'MONTH'}>最近30天</AntdSelect.Option>
                        <AntdSelect.Option key={'QUARTER'}>最近3个月</AntdSelect.Option>
                        <AntdSelect.Option key={'YEAR'}>最近12个月</AntdSelect.Option>
                        <AntdSelect.Option key={'TWO_YEARS'}>最近2年</AntdSelect.Option>
                        <AntdSelect.Option key={'THREE_YEARS'}>最近3年</AntdSelect.Option>
                        <AntdSelect.Option key={'FIVE_YEARS'}>最近5年</AntdSelect.Option>
                        <AntdSelect.Option key={'ALL'}>全部</AntdSelect.Option>
                    </AntdSelect>
                    <AntdButton title={'刷新'} onClick={handleOnRefresh} disabled={isLoading}>
                        <Icon component={IconFatwebRefresh} />
                    </AntdButton>
                </>
            }
        >
            <FlexBox className={'card-content'} direction={'horizontal'}>
                <div className={'big-chart'} ref={onlineInfoDivRef} />
            </FlexBox>
        </CommonCard>
    )
}

const ActiveInfo: React.FC = () => {
    const activeInfoDivRef = useRef<HTMLDivElement>(null)
    const activeInfoEChartsRef = useRef<echarts.EChartsType | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [scope, setScope] = useState('WEAK')

    useUpdatedEffect(() => {
        const chartResizeObserver = new ResizeObserver(() => {
            activeInfoEChartsRef.current?.resize()
        })

        activeInfoDivRef.current && chartResizeObserver.observe(activeInfoDivRef.current)

        return () => {
            activeInfoDivRef.current && chartResizeObserver.unobserve(activeInfoDivRef.current)
        }
    }, [isLoading])

    useUpdatedEffect(() => {
        getActiveInfo()
    }, [])

    const handleOnScopeChange = (value: string) => {
        setScope(value)
        getActiveInfo(value)
    }

    const handleOnRefresh = () => {
        getActiveInfo()
    }

    const getActiveInfo = (_scope: string = scope) => {
        if (isLoading) {
            return
        }

        setIsLoading(true)

        void r_sys_statistics_active({ scope: _scope }).then((res) => {
            const response = res.data
            if (response.success) {
                const data = response.data
                if (data) {
                    setIsLoading(false)

                    setTimeout(() => {
                        const registerList = data.registerHistory.length
                            ? getTimesBetweenTwoTimes(
                                  data.registerHistory[0].time,
                                  data.registerHistory[data.registerHistory.length - 1].time,
                                  'day'
                              ).map((time) => [
                                  time,
                                  data.registerHistory.find(
                                      (value) =>
                                          value.time.substring(0, 10) === time.substring(0, 10)
                                  )?.count ?? 0
                              ])
                            : []
                        const loginList = data.loginHistory.length
                            ? getTimesBetweenTwoTimes(
                                  data.loginHistory[0].time,
                                  data.loginHistory[data.loginHistory.length - 1].time,
                                  'day'
                              ).map((time) => [
                                  time,
                                  data.loginHistory.find(
                                      (value) =>
                                          value.time.substring(0, 10) === time.substring(0, 10)
                                  )?.count ?? 0
                              ])
                            : []

                        activeInfoEChartsRef.current = echarts.init(
                            activeInfoDivRef.current,
                            null,
                            { renderer: 'svg' }
                        )

                        activeInfoEChartsRef.current?.setOption({
                            ...lineEChartsBaseOption,
                            tooltip: {
                                ...lineEChartsBaseOption.tooltip,
                                formatter: getTooltipTimeFormatter('yyyy-MM-DD')
                            },
                            dataZoom: [
                                {
                                    type: 'inside',
                                    start: 0,
                                    end: 100,
                                    minValueSpan: 2 * 24 * 60 * 60 * 1000
                                }
                            ],
                            series: [
                                {
                                    name: '注册人数',
                                    type: 'line',
                                    smooth: true,
                                    symbol: 'none',
                                    areaStyle: {},
                                    data: registerList
                                },
                                {
                                    name: '登录人数',
                                    type: 'line',
                                    smooth: true,
                                    symbol: 'none',
                                    areaStyle: {},
                                    data: loginList
                                }
                            ]
                        })
                    })
                }
            }
        })
    }

    return (
        <CommonCard
            icon={IconFatwebAnalysis}
            title={
                <>
                    <FlexBox gap={10} direction={'horizontal'}>
                        <span style={{ whiteSpace: 'nowrap' }}>用户活跃</span>
                    </FlexBox>
                </>
            }
            loading={isLoading}
            expand={
                <>
                    <AntdSelect value={scope} onChange={handleOnScopeChange} disabled={isLoading}>
                        <AntdSelect.Option key={'WEAK'}>最近7天</AntdSelect.Option>
                        <AntdSelect.Option key={'MONTH'}>最近30天</AntdSelect.Option>
                        <AntdSelect.Option key={'QUARTER'}>最近3个月</AntdSelect.Option>
                        <AntdSelect.Option key={'YEAR'}>最近12个月</AntdSelect.Option>
                        <AntdSelect.Option key={'TWO_YEARS'}>最近2年</AntdSelect.Option>
                        <AntdSelect.Option key={'THREE_YEARS'}>最近3年</AntdSelect.Option>
                        <AntdSelect.Option key={'FIVE_YEARS'}>最近5年</AntdSelect.Option>
                        <AntdSelect.Option key={'ALL'}>全部</AntdSelect.Option>
                    </AntdSelect>
                    <AntdButton title={'刷新'} onClick={handleOnRefresh} disabled={isLoading}>
                        <Icon component={IconFatwebRefresh} />
                    </AntdButton>
                </>
            }
        >
            <FlexBox className={'card-content'} direction={'horizontal'}>
                <div className={'big-chart'} ref={activeInfoDivRef} />
            </FlexBox>
        </CommonCard>
    )
}

const SoftwareInfo: React.FC = () => {
    const [softwareInfoData, setSoftwareInfoData] = useState<SoftwareInfoVo>()

    useUpdatedEffect(() => {
        void r_sys_statistics_software().then((res) => {
            const response = res.data
            if (response.success) {
                response.data && setSoftwareInfoData(response.data)
            } else {
                void message.error('获取软件信息失败，请稍后重试')
            }
        })
    }, [])

    return (
        <CommonCard
            icon={IconFatwebSoftware}
            title={'软件信息'}
            loading={softwareInfoData === undefined}
        >
            <FlexBox className={'card-content'} direction={'horizontal'}>
                <FlexBox className={'key'}>
                    <div>操作系统</div>
                    <div>位数</div>
                    <div>Java</div>
                    <div>Java 供应商</div>
                    <div>Runtime</div>
                    <div>JVM</div>
                    <div>JVM 供应商</div>
                    <div>操作系统启动时间</div>
                    <div>后端服务器启动时间</div>
                </FlexBox>
                <FlexBox className={'value'}>
                    <div title={softwareInfoData?.os}>{softwareInfoData?.os}</div>
                    <div title={softwareInfoData?.bitness.toString()}>
                        {softwareInfoData?.bitness}
                    </div>
                    <div
                        title={`${softwareInfoData?.javaVersion} (${softwareInfoData?.javaVersionDate})`}
                    >{`${softwareInfoData?.javaVersion} (${softwareInfoData?.javaVersionDate})`}</div>
                    <div title={softwareInfoData?.javaVendor}>{softwareInfoData?.javaVendor}</div>
                    <div
                        title={`${softwareInfoData?.javaRuntime} (build ${softwareInfoData?.javaRuntimeVersion})`}
                    >{`${softwareInfoData?.javaRuntime} (build ${softwareInfoData?.javaRuntimeVersion})`}</div>
                    <div
                        title={`${softwareInfoData?.jvm} (build ${softwareInfoData?.jvmVersion}, ${softwareInfoData?.jvmInfo})`}
                    >{`${softwareInfoData?.jvm} (build ${softwareInfoData?.jvmVersion}, ${softwareInfoData?.jvmInfo})`}</div>
                    <div title={softwareInfoData?.jvmVendor}>{softwareInfoData?.jvmVendor}</div>
                    <div>
                        {softwareInfoData?.osBootTime &&
                            utcToLocalTime(softwareInfoData?.osBootTime)}
                    </div>
                    <div>
                        {softwareInfoData?.serverStartupTime &&
                            utcToLocalTime(softwareInfoData.serverStartupTime)}
                    </div>
                </FlexBox>
            </FlexBox>
        </CommonCard>
    )
}

const HardwareInfo: React.FC = () => {
    const [hardwareInfoData, setHardwareInfoData] = useState<HardwareInfoVo>()

    useUpdatedEffect(() => {
        void r_sys_statistics_hardware().then((res) => {
            const response = res.data
            if (response.success) {
                response.data && setHardwareInfoData(response.data)
            } else {
                void message.error('获取硬件信息失败，请稍后重试')
            }
        })
    }, [])

    return (
        <CommonCard
            icon={IconFatwebHardware}
            title={'硬件信息'}
            loading={hardwareInfoData === undefined}
        >
            <FlexBox className={'card-content'} direction={'horizontal'}>
                <FlexBox className={'key'}>
                    <div>CPU</div>
                    <div>CPU 架构</div>
                    <div>微架构</div>
                    <div>64位</div>
                    <div>物理 CPU</div>
                    <div>物理核心</div>
                    <div>逻辑核心</div>
                    <div>内存</div>
                    <div>磁盘</div>
                </FlexBox>
                <FlexBox className={'value'}>
                    <div title={hardwareInfoData?.cpu}>{hardwareInfoData?.cpu}</div>
                    <div title={hardwareInfoData?.arch}>{hardwareInfoData?.arch}</div>
                    <div title={hardwareInfoData?.microarchitecture}>
                        {hardwareInfoData?.microarchitecture}
                    </div>
                    <div title={hardwareInfoData?.is64Bit ? '是' : '否'}>
                        {hardwareInfoData?.is64Bit ? '是' : '否'}
                    </div>
                    <div title={hardwareInfoData?.cpuPhysicalPackageCount.toString()}>
                        {hardwareInfoData?.cpuPhysicalPackageCount}
                    </div>
                    <div title={hardwareInfoData?.cpuPhysicalProcessorCount.toString()}>
                        {hardwareInfoData?.cpuPhysicalProcessorCount}
                    </div>
                    <div title={hardwareInfoData?.cpuLogicalProcessorCount.toString()}>
                        {hardwareInfoData?.cpuLogicalProcessorCount}
                    </div>
                    <div title={hardwareInfoData?.memories}>{hardwareInfoData?.memories}</div>
                    <div title={hardwareInfoData?.disks}>{hardwareInfoData?.disks}</div>
                </FlexBox>
            </FlexBox>
        </CommonCard>
    )
}

const CPUInfo: React.FC = () => {
    const keyDivRef = useRef<HTMLDivElement>(null)
    const percentDivRef = useRef<HTMLDivElement>(null)
    const cpuInfoDivRef = useRef<HTMLDivElement>(null)
    const cpuInfoEChartsRef = useRef<echarts.EChartsType[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [refreshInterval, setRefreshInterval] = useState('5')
    const [cpuInfoEChartsOption, setCpuInfoEChartsOption] = useState<EChartsOption[]>([])

    const cpuDefaultSeriesOption: BarSeriesOption = {
        ...barDefaultSeriesOption,
        tooltip: {
            valueFormatter: (value) => `${((value as number) * 100).toFixed(2)}%`
        }
    }

    useUpdatedEffect(() => {
        const chartResizeObserver = new ResizeObserver(() => {
            cpuInfoEChartsRef.current.forEach((value) => value.resize())
        })

        cpuInfoDivRef.current && chartResizeObserver.observe(cpuInfoDivRef.current)

        return () => {
            cpuInfoDivRef.current && chartResizeObserver.unobserve(cpuInfoDivRef.current)
        }
    }, [cpuInfoDivRef.current])

    useUpdatedEffect(() => {
        const intervalId = setInterval(getCpuInfo(), parseInt(refreshInterval) * 1000)

        return () => {
            clearInterval(intervalId)
        }
    }, [refreshInterval])

    const getCpuInfo = () => {
        void r_sys_statistics_cpu().then((res) => {
            const response = res.data
            if (response.success) {
                const data = response.data
                if (data) {
                    if (isLoading) {
                        setIsLoading(false)
                    }

                    setTimeout(() => {
                        const dataList = data.processors.map((value) =>
                            cpuInfoVoToCpuInfoData(value)
                        )
                        dataList.unshift(cpuInfoVoToCpuInfoData(data))

                        setCpuInfoEChartsOption(
                            dataList.map((value, index) => ({
                                ...barEChartsBaseOption,
                                yAxis: {
                                    ...barEChartsBaseOption.yAxis,
                                    data: [index === 0 ? '总占用' : `CPU ${index - 1}`]
                                },
                                series: value
                            }))
                        )

                        if (percentDivRef.current) {
                            percentDivRef.current.innerHTML = ''
                            dataList.forEach((value) => {
                                const percentElement = document.createElement('div')
                                const idle = value.find((item) => item.name === 'idle')?.data[0]
                                percentElement.innerText =
                                    idle !== undefined
                                        ? `${((1 - idle) * 100).toFixed(2)}%`
                                        : 'Unknown'
                                percentDivRef.current?.appendChild(percentElement)
                            })
                        }

                        if (!cpuInfoEChartsRef.current.length) {
                            keyDivRef.current && (keyDivRef.current.innerHTML = '')
                            cpuInfoDivRef.current && (cpuInfoDivRef.current.innerHTML = '')
                            for (let i = 0; i < dataList.length; i++) {
                                const keyElement = document.createElement('div')
                                keyElement.innerText = i === 0 ? '总占用' : `CPU ${i - 1}`
                                keyDivRef.current?.appendChild(keyElement)

                                const valueElement = document.createElement('div')
                                cpuInfoDivRef.current?.appendChild(valueElement)
                                cpuInfoEChartsRef.current.push(
                                    echarts.init(valueElement, null, { renderer: 'svg' })
                                )
                            }
                        }
                    })
                }
            }
        })

        return getCpuInfo
    }

    const cpuInfoVoToCpuInfoData = (cpuInfoVo: CpuInfoVo) =>
        Object.entries(cpuInfoVo)
            .filter(([key]) => !['total', 'processors'].includes(key))
            .map(([key, value]) => ({
                ...cpuDefaultSeriesOption,
                name: key,
                data: [(value as number) / cpuInfoVo.total]
            }))
            .sort((a, b) => {
                const order = [
                    'steal',
                    'irq',
                    'softirq',
                    'iowait',
                    'system',
                    'nice',
                    'user',
                    'idle'
                ]
                return order.indexOf(a.name) - order.indexOf(b.name)
            })

    useEffect(() => {
        cpuInfoEChartsRef.current?.forEach((value, index) => {
            try {
                value.setOption(cpuInfoEChartsOption[index])
            } catch (e) {
                /* empty */
            }
        })
    }, [cpuInfoEChartsOption])

    return (
        <>
            <CommonCard
                icon={IconFatwebCpu}
                title={'CPU 信息'}
                loading={isLoading}
                expand={
                    <AntdSelect
                        value={refreshInterval}
                        onChange={(value) => setRefreshInterval(value)}
                    >
                        <AntdSelect.Option key={1}>1秒</AntdSelect.Option>
                        <AntdSelect.Option key={2}>2秒</AntdSelect.Option>
                        <AntdSelect.Option key={3}>3秒</AntdSelect.Option>
                        <AntdSelect.Option key={5}>5秒</AntdSelect.Option>
                        <AntdSelect.Option key={10}>10秒</AntdSelect.Option>
                        <AntdSelect.Option key={15}>15秒</AntdSelect.Option>
                        <AntdSelect.Option key={20}>20秒</AntdSelect.Option>
                        <AntdSelect.Option key={30}>30秒</AntdSelect.Option>
                        <AntdSelect.Option key={60}>60秒</AntdSelect.Option>
                        <AntdSelect.Option key={120}>2分</AntdSelect.Option>
                        <AntdSelect.Option key={180}>3分</AntdSelect.Option>
                        <AntdSelect.Option key={300}>5分</AntdSelect.Option>
                        <AntdSelect.Option key={600}>10分</AntdSelect.Option>
                    </AntdSelect>
                }
            >
                <FlexBox className={'card-content'} direction={'horizontal'}>
                    <FlexBox className={'key'} ref={keyDivRef} />
                    <FlexBox className={'value-chart'} ref={cpuInfoDivRef} />
                    <FlexBox className={'value-percent'} ref={percentDivRef} />
                </FlexBox>
            </CommonCard>
        </>
    )
}

const StorageInfo: React.FC = () => {
    const keyDivRef = useRef<HTMLDivElement>(null)
    const percentDivRef = useRef<HTMLDivElement>(null)
    const storageInfoDivRef = useRef<HTMLDivElement>(null)
    const storageInfoEChartsRef = useRef<echarts.EChartsType[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [refreshInterval, setRefreshInterval] = useState('5')
    const [storageInfoEChartsOption, setStorageInfoEChartsOption] = useState<EChartsOption[]>([])

    const storageDefaultSeriesOption: BarSeriesOption = {
        ...barDefaultSeriesOption,
        tooltip: { valueFormatter: (value) => formatByteSize(value as number) }
    }

    useUpdatedEffect(() => {
        const chartResizeObserver = new ResizeObserver(() => {
            storageInfoEChartsRef.current.forEach((value) => value.resize())
        })

        storageInfoDivRef.current && chartResizeObserver.observe(storageInfoDivRef.current)

        return () => {
            storageInfoDivRef.current && chartResizeObserver.unobserve(storageInfoDivRef.current)
        }
    }, [storageInfoDivRef.current])

    useUpdatedEffect(() => {
        const intervalId = setInterval(getStorageInfo(), parseInt(refreshInterval) * 1000)

        return () => {
            clearInterval(intervalId)
        }
    }, [refreshInterval])

    const getStorageInfo = () => {
        void r_sys_statistics_storage().then((res) => {
            const response = res.data
            if (response.success) {
                const data = response.data
                if (data) {
                    if (isLoading) {
                        setIsLoading(false)
                    }

                    setTimeout(() => {
                        const eChartsOptions = [
                            storageInfoVoToStorageEChartsOption(
                                '物理内存',
                                data.memoryTotal - data.memoryFree,
                                data.memoryFree
                            ),
                            storageInfoVoToStorageEChartsOption(
                                '虚拟内存',
                                data.virtualMemoryInUse,
                                data.virtualMemoryMax - data.virtualMemoryInUse
                            ),
                            storageInfoVoToStorageEChartsOption(
                                'swap',
                                data.swapUsed,
                                data.swapTotal - data.swapUsed
                            ),
                            storageInfoVoToStorageEChartsOption(
                                'jvm 内存',
                                data.jvmTotal - data.jvmFree,
                                data.jvmFree
                            )
                        ]
                        data.fileStores.forEach((value) =>
                            eChartsOptions.push(
                                storageInfoVoToStorageEChartsOption(
                                    value.mount,
                                    value.total - value.free,
                                    value.free
                                )
                            )
                        )
                        setStorageInfoEChartsOption(eChartsOptions)

                        if (percentDivRef.current && keyDivRef.current) {
                            keyDivRef.current.innerHTML = ''
                            percentDivRef.current.innerHTML = ''
                            eChartsOptions.forEach((value) => {
                                const keyElement = document.createElement('div')
                                const percentElement = document.createElement('div')
                                keyElement.innerText = value.yAxis.data[0]
                                percentElement.innerText = `${(
                                    (value.series[0].data[0] /
                                        (value.series[0].data[0] + value.series[1].data[0])) *
                                    100
                                ).toFixed(2)}%`

                                keyDivRef.current?.appendChild(keyElement)
                                percentDivRef.current?.appendChild(percentElement)
                            })
                        }

                        if (!storageInfoEChartsRef.current.length) {
                            storageInfoDivRef.current && (storageInfoDivRef.current.innerHTML = '')

                            eChartsOptions.forEach(() => {
                                const element = document.createElement('div')
                                storageInfoDivRef.current?.appendChild(element)
                                storageInfoEChartsRef.current.push(
                                    echarts.init(element, null, { renderer: 'svg' })
                                )
                            })
                        }
                    })
                }
            }
        })

        return getStorageInfo
    }

    const storageInfoVoToStorageEChartsOption = (label: string, used: number, free: number) => ({
        ...barEChartsBaseOption,
        xAxis: {
            ...barEChartsBaseOption.xAxis,
            max: used + free
        },
        yAxis: {
            ...barEChartsBaseOption.yAxis,
            data: [label]
        },
        series: [
            {
                ...storageDefaultSeriesOption,
                name: 'used',
                data: [used]
            },
            {
                ...storageDefaultSeriesOption,
                name: 'free',
                data: [free]
            }
        ]
    })

    useEffect(() => {
        storageInfoEChartsRef.current?.forEach((value, index) => {
            try {
                value.setOption(storageInfoEChartsOption[index])
            } catch (e) {
                /* empty */
            }
        })
    }, [storageInfoEChartsOption])

    return (
        <>
            <CommonCard
                icon={IconFatwebMemory}
                title={'内存信息'}
                loading={isLoading}
                expand={
                    <AntdSelect
                        value={refreshInterval}
                        onChange={(value) => setRefreshInterval(value)}
                    >
                        <AntdSelect.Option key={1}>1秒</AntdSelect.Option>
                        <AntdSelect.Option key={2}>2秒</AntdSelect.Option>
                        <AntdSelect.Option key={3}>3秒</AntdSelect.Option>
                        <AntdSelect.Option key={5}>5秒</AntdSelect.Option>
                        <AntdSelect.Option key={10}>10秒</AntdSelect.Option>
                        <AntdSelect.Option key={15}>15秒</AntdSelect.Option>
                        <AntdSelect.Option key={20}>20秒</AntdSelect.Option>
                        <AntdSelect.Option key={30}>30秒</AntdSelect.Option>
                        <AntdSelect.Option key={60}>60秒</AntdSelect.Option>
                        <AntdSelect.Option key={120}>2分</AntdSelect.Option>
                        <AntdSelect.Option key={180}>3分</AntdSelect.Option>
                        <AntdSelect.Option key={300}>5分</AntdSelect.Option>
                        <AntdSelect.Option key={600}>10分</AntdSelect.Option>
                    </AntdSelect>
                }
            >
                <FlexBox className={'card-content'} direction={'horizontal'}>
                    <FlexBox className={'key'} ref={keyDivRef} />
                    <FlexBox className={'value-chart'} ref={storageInfoDivRef} />
                    <FlexBox className={'value-percent'} ref={percentDivRef} />
                </FlexBox>
            </CommonCard>
        </>
    )
}

const Statistics: React.FC = () => {
    return (
        <>
            <FitFullscreen data-component={'system-statistics'}>
                <HideScrollbar isShowVerticalScrollbar autoHideWaitingTime={500}>
                    <FlexBox direction={'horizontal'} className={'root-content'}>
                        <Permission operationCode={'system:statistics:query:usage'}>
                            <OnlineInfo />
                            <ActiveInfo />
                        </Permission>
                        <Permission operationCode={'system:statistics:query:base'}>
                            <SoftwareInfo />
                            <HardwareInfo />
                        </Permission>
                        <Permission operationCode={'system:statistics:query:real'}>
                            <CPUInfo />
                            <StorageInfo />
                        </Permission>
                    </FlexBox>
                </HideScrollbar>
            </FitFullscreen>
        </>
    )
}

export default Statistics
