import React from 'react'
import Icon from '@ant-design/icons'
import '@/assets/css/components/common/loading-mask.scss'
import FitFullScreen from '@/components/common/FitFullScreen'
import { COLOR_FONT_MAIN } from '@/constants/Common.constants'

const LoadingMask: React.FC = () => {
    const loadingIcon = (
        <>
            <Icon
                component={IconFatwebLoading}
                style={{ fontSize: 24, color: COLOR_FONT_MAIN }}
                spin
            />
        </>
    )
    return (
        <>
            <FitFullScreen>
                <div className={'loading-mask'}>
                    <AntdSpin indicator={loadingIcon} />
                </div>
            </FitFullScreen>
        </>
    )
}

export default LoadingMask
