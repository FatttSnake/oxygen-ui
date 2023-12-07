import React, { useState } from 'react'
import Icon from '@ant-design/icons'
import * as echarts from 'echarts/core'
import {
    TooltipComponent,
    TooltipComponentOption,
    GridComponent,
    GridComponentOption
} from 'echarts/components'
import { BarChart, BarSeriesOption } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'
import '@/assets/css/pages/system/index.scss'
import { useUpdatedEffect } from '@/util/hooks'
import { utcToLocalTime } from '@/util/datetime'
import {
    r_sys_statistics_cpu,
    r_sys_statistics_hardware,
    r_sys_statistics_software
} from '@/services/system'
import Card from '@/components/common/Card'
import FlexBox from '@/components/common/FlexBox'
import FitFullScreen from '@/components/common/FitFullScreen'
import HideScrollbar from '@/components/common/HideScrollbar'
import LoadingMask from '@/components/common/LoadingMask'
import EChartReact from '@/components/common/echarts/EChartReact'

echarts.use([TooltipComponent, GridComponent, BarChart, CanvasRenderer])
type EChartsOption = echarts.ComposeOption<
    TooltipComponentOption | GridComponentOption | BarSeriesOption
>
interface CommonCardProps extends React.PropsWithChildren {
    icon: IconComponent
    title: string
    loading?: boolean
}

const CommonCard: React.FC<CommonCardProps> = (props) => {
    return (
        <Card style={{ overflow: 'visible' }}>
            <FlexBox className={'common-card'}>
                <FlexBox direction={'horizontal'} className={'head'}>
                    <Icon component={props.icon} className={'icon'} />
                    <div className={'title'}>{props.title}</div>
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
    const [cpuInfoData, setCpuInfoData] = useState<BarSeriesOption[]>()

    const defaultSeriesOption: BarSeriesOption = {
        type: 'bar',
        stack: 'total',
        emphasis: {
            focus: 'series'
        }
    }

    useUpdatedEffect(() => {
        setInterval(
            () =>
                r_sys_statistics_cpu().then((res) => {
                    const response = res.data
                    if (response.success) {
                        const data = response.data
                        if (data) {
                            const cpuInfoData = Object.entries(data)
                                .filter(([key]) => key !== 'processors')
                                .map(([key, value]) => ({
                                    ...defaultSeriesOption,
                                    name: key,
                                    data: [value as number]
                                }))
                            console.log(cpuInfoData)
                            setCpuInfoData(cpuInfoData)
                        }
                    }
                }),
            5000
        )
    }, [])

    const option: EChartsOption = {
        tooltip: {},
        xAxis: {
            show: false
        },
        yAxis: {
            data: ['总使用'],
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
        },
        series: cpuInfoData
    }

    return (
        <>
            <CommonCard icon={IconFatwebCpu} title={'CPU 信息'} loading={false}>
                <FlexBox className={'card-content'} direction={'horizontal'}>
                    <FlexBox className={'key'}>
                        <div>总占用</div>
                        <div>总占用</div>
                        <div>总占用</div>
                    </FlexBox>
                    <FlexBox className={'value-chart'}>
                        <div>
                            <EChartReact
                                echarts={echarts}
                                opts={{ renderer: 'svg', height: 12 }}
                                option={option}
                            />
                        </div>
                        <div></div>
                        <div></div>
                    </FlexBox>
                </FlexBox>
            </CommonCard>
        </>
    )
}

const MemoryInfo: React.FC = () => {
    return (
        <>
            <CommonCard icon={IconFatwebMemory} title={'内存信息'} loading={true}></CommonCard>
        </>
    )
}

const JvmInfo: React.FC = () => {
    return (
        <>
            <CommonCard icon={IconFatwebJava} title={'JVM 信息'} loading={true}></CommonCard>
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
                        <MemoryInfo />
                        <JvmInfo />
                        <div />
                    </FlexBox>
                </HideScrollbar>
            </FitFullScreen>
        </>
    )
}

export default System
