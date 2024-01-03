import React from 'react'
import Icon from '@ant-design/icons'
import '@/assets/css/pages/system/statistics.scss'
import Card from '@/components/common/Card'
import FlexBox from '@/components/common/FlexBox'
import FitFullscreen from '@/components/common/FitFullscreen'
import HideScrollbar from '@/components/common/HideScrollbar'
import LoadingMask from '@/components/common/LoadingMask'
import Permission from '@/components/common/Permission'
import OnlineInfo from '@/pages/system/statistics/OnlineInfo'
import ActiveInfo from '@/pages/system/statistics/ActiveInfo'
import SoftwareInfo from '@/pages/system/statistics/SoftwareInfo'
import HardwareInfo from '@/pages/system/statistics/HardwareInfo'
import CPUInfo from '@/pages/system/statistics/CPUInfo'
import StorageInfo from '@/pages/system/statistics/StorageInfo'

interface CommonCardProps extends React.PropsWithChildren {
    icon: IconComponent
    title: React.ReactNode
    loading?: boolean
    expand?: React.ReactNode
}

export const CommonCard: React.FC<CommonCardProps> = (props) => {
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
                            <HardwareInfo />
                            <SoftwareInfo />
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
