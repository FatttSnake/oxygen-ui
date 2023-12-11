import React, { useEffect, useState } from 'react'
import Icon from '@ant-design/icons'
import * as echarts from 'echarts/core'
import {
    TooltipComponent,
    TooltipComponentOption,
    GridComponent,
    GridComponentOption
} from 'echarts/components'
import { BarChart, BarSeriesOption } from 'echarts/charts'
import { SVGRenderer } from 'echarts/renderers'
import '@/assets/css/pages/system/index.scss'
import { useUpdatedEffect } from '@/util/hooks'
import { formatByteSize } from '@/util/common'
import { utcToLocalTime } from '@/util/datetime'
import {
    r_sys_statistics_cpu,
    r_sys_statistics_hardware,
    r_sys_statistics_software,
    r_sys_statistics_storage
} from '@/services/system'
import Card from '@/components/common/Card'
import FlexBox from '@/components/common/FlexBox'
import FitFullScreen from '@/components/common/FitFullScreen'
import HideScrollbar from '@/components/common/HideScrollbar'
import LoadingMask from '@/components/common/LoadingMask'

echarts.use([TooltipComponent, GridComponent, BarChart, SVGRenderer])
type EChartsOption = echarts.ComposeOption<
    TooltipComponentOption | GridComponentOption | BarSeriesOption
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

const eChartsBaseOption: EChartsOption = {
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

interface CommonCardProps extends React.PropsWithChildren {
    icon: IconComponent
    title: string
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
                                ...eChartsBaseOption,
                                yAxis: {
                                    ...eChartsBaseOption.yAxis,
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
        ...eChartsBaseOption,
        xAxis: {
            ...eChartsBaseOption.xAxis,
            max: used + free
        },
        yAxis: {
            ...eChartsBaseOption.yAxis,
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

const System: React.FC = () => {
    return (
        <>
            <FitFullScreen>
                <HideScrollbar isShowVerticalScrollbar autoHideWaitingTime={500}>
                    <FlexBox direction={'horizontal'} className={'root-content'}>
                        <SoftwareInfo />
                        <HardwareInfo />
                        <CPUInfo />
                        <StorageInfo />
                    </FlexBox>
                </HideScrollbar>
            </FitFullScreen>
        </>
    )
}

export default System
