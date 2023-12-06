import React, { useState } from 'react'
import Icon from '@ant-design/icons'
// import { DualAxes, DualAxesConfig } from '@ant-design/plots'
import '@/assets/css/pages/system/index.scss'
import { useUpdatedEffect } from '@/util/hooks'
import { utcToLocalTime } from '@/util/datetime'
import { r_sys_statistics_hardware, r_sys_statistics_software } from '@/services/system'
import Card from '@/components/common/Card'
import FlexBox from '@/components/common/FlexBox'
import FitFullScreen from '@/components/common/FitFullScreen'
import HideScrollbar from '@/components/common/HideScrollbar'
import LoadingMask from '@/components/common/LoadingMask'

interface CommonCardProps extends React.PropsWithChildren {
    icon: IconComponent
    title: string
    loading?: boolean
}

const CommonCard: React.FC<CommonCardProps> = (props) => {
    return (
        <Card>
            <FlexBox className={'common-card'}>
                <FlexBox direction={'horizontal'} className={'head'}>
                    <Icon component={props.icon} className={'icon'} />
                    <div className={'title'}>{props.title}</div>
                </FlexBox>
                <LoadingMask
                    hidden={!props.loading}
                    maskContent={<AntdSkeleton active paragraph={{ rows: 10 }} />}
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
                    <div>{softwareInfoData?.os}</div>
                    <div>{softwareInfoData?.bitness}</div>
                    <div>{`${softwareInfoData?.javaVersion} (${softwareInfoData?.javaVersionDate})`}</div>
                    <div>{softwareInfoData?.javaVendor}</div>
                    <div>{`${softwareInfoData?.javaRuntime} (build ${softwareInfoData?.javaRuntimeVersion})`}</div>
                    <div>{`${softwareInfoData?.jvm} (build ${softwareInfoData?.jvmVersion}, ${softwareInfoData?.jvmInfo})`}</div>
                    <div>{softwareInfoData?.jvmVendor}</div>
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
                    <div>架构</div>
                    <div>微架构</div>
                    <div>64位</div>
                    <div>CPU 插槽</div>
                    <div>CPU 内核</div>
                    <div>CPU 逻辑处理器</div>
                </FlexBox>
                <FlexBox className={'value'}>
                    <div>{hardwareInfoData?.cpu}</div>
                    <div>{hardwareInfoData?.arch}</div>
                    <div>{hardwareInfoData?.microarchitecture}</div>
                    <div>{hardwareInfoData?.is64Bit ? '是' : '否'}</div>
                    <div>{hardwareInfoData?.cpuPhysicalPackageCount}</div>
                    <div>{hardwareInfoData?.cpuPhysicalProcessorCount}</div>
                    <div>{hardwareInfoData?.cpuLogicalProcessorCount}</div>
                </FlexBox>
            </FlexBox>
        </CommonCard>
    )
}

const System: React.FC = () => {
    /*
    const dualAxesData = [
        { year: '1991', value: 3, count: 10 },
        { year: '1992', value: 4, count: 4 },
        { year: '1993', value: 3.5, count: 5 },
        { year: '1994', value: 5, count: 5 },
        { year: '1995', value: 4.9, count: 4.9 },
        { year: '1996', value: 6, count: 35 },
        { year: '1997', value: 7, count: 7 },
        { year: '1998', value: 9, count: 1 },
        { year: '1999', value: 13, count: 20 }
    ]

    const userStatisticsData = [
        { time: '2023-12-01', type: 'register', number: 23 },
        { time: '2023-12-02', type: 'register', number: 123 },
        { time: '2023-12-03', type: 'register', number: 1432 },
        { time: '2023-12-05', type: 'register', number: 1 },
        { time: '2023-12-04', type: 'register', number: 234 },
        { time: '2023-12-06', type: 'register', number: 23 },
        { time: '2023-12-07', type: 'register', number: 54 },
        { time: '2023-12-08', type: 'register', number: 87 },
        { time: '2023-12-09', type: 'register', number: 12 },
        { time: '2023-12-10', type: 'register', number: 123 },
        { time: '2023-12-11', type: 'register', number: 20 },
        { time: '2023-12-01', type: 'login', number: 433 },
        { time: '2023-12-02', type: 'login', number: 2 },
        { time: '2023-12-03', type: 'login', number: 34 },
        { time: '2023-12-05', type: 'login', number: 12 },
        { time: '2023-12-04', type: 'login', number: 345 },
        { time: '2023-12-06', type: 'login', number: 121 },
        { time: '2023-12-07', type: 'login', number: 2 },
        { time: '2023-12-08', type: 'login', number: 435 },
        { time: '2023-12-09', type: 'login', number: 1 },
        { time: '2023-12-10', type: 'login', number: 54 },
        { time: '2023-12-11', type: 'login', number: 56 }
    ]

    const dualAxesConfig: DualAxesConfig = {
        data: userStatisticsData,
        slider: { x: true },
        shapeField: 'smooth',
        xField: 'time',
        children: [
            {
                type: 'line',
                yField: 'number',
                colorField: 'type'
            }
        ]
    }
*/

    return (
        <>
            <FitFullScreen>
                <HideScrollbar isShowVerticalScrollbar autoHideWaitingTime={500}>
                    <FlexBox className={'root-content'}>
                        <FlexBox direction={'horizontal'} className={'root-row'}>
                            <SoftwareInfo />
                            <HardwareInfo />
                        </FlexBox>
                        <FlexBox direction={'horizontal'} className={'root-row'}>
                            <Card style={{ height: '400px' }}>
                                {/*<DualAxes {...dualAxesConfig} />*/}
                            </Card>
                            <div />
                        </FlexBox>
                    </FlexBox>
                </HideScrollbar>
            </FitFullScreen>
        </>
    )
}

export default System
