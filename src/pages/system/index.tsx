import React from 'react'
import Icon from '@ant-design/icons'
import VanillaTilt, { TiltOptions } from 'vanilla-tilt'
import '@/assets/css/pages/system/index.scss'
import HideScrollbar from '@/components/common/HideScrollbar'
import FitFullScreen from '@/components/common/FitFullScreen'
import FlexBox from '@/components/common/FlexBox'
import Card from '@/components/common/Card'
import Permission from '@/components/common/Permission.tsx'

interface CommonCardProps
    extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    icon: IconComponent
    description?: React.ReactNode
    options?: TiltOptions
    url?: string
}

const CommonCard = forwardRef<HTMLDivElement, CommonCardProps>((props) => {
    const navigate = useNavigate()
    const cardRef = useRef<HTMLDivElement>(null)
    const {
        style,
        ref,
        icon,
        description,
        options = {
            reverse: true,
            max: 8,
            glare: true,
            scale: 1.03
        },
        url,
        children,
        ..._props
    } = props

    useEffect(() => {
        cardRef.current && VanillaTilt.init(cardRef.current, options)
    }, [options])

    const handleCardOnClick = () => {
        url && navigate(url)
    }

    return (
        <Card
            style={{ overflow: 'visible', ...style }}
            ref={cardRef}
            {..._props}
            onClick={handleCardOnClick}
        >
            <FlexBox className={'common-card'}>
                <Icon component={icon} className={'icon'} />
                <div className={'text'}>{children}</div>
                <div className={'description'}>{description}</div>
            </FlexBox>
        </Card>
    )
})

const System: React.FC = () => {
    return (
        <>
            <FitFullScreen data-component={'system'}>
                <HideScrollbar isShowVerticalScrollbar autoHideWaitingTime={500}>
                    <FlexBox direction={'horizontal'} className={'root-content'}>
                        <Permission path={'/system/statistics'}>
                            <CommonCard icon={IconFatwebAnalysis} url={'statistics'}>
                                系统概况
                            </CommonCard>
                        </Permission>
                        <Permission path={'/system/settings'}>
                            <CommonCard icon={IconFatwebOption} url={'settings'}>
                                系统设置
                            </CommonCard>
                        </Permission>
                        <Permission path={'/system/user'}>
                            <CommonCard icon={IconFatwebUser} url={'user'}>
                                用户管理
                            </CommonCard>
                        </Permission>
                        <Permission path={'/system/role'}>
                            <CommonCard icon={IconFatwebRole} url={'role'}>
                                角色管理
                            </CommonCard>
                        </Permission>
                        <Permission path={'/system/group'}>
                            <CommonCard icon={IconFatwebGroup} url={'group'}>
                                群组管理
                            </CommonCard>
                        </Permission>
                        <Permission path={'/system/log'}>
                            <CommonCard icon={IconFatwebLog} url={'log'}>
                                系统日志
                            </CommonCard>
                        </Permission>
                    </FlexBox>
                </HideScrollbar>
            </FitFullScreen>
        </>
    )
}

export default System
