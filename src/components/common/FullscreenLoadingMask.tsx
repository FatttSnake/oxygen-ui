import React from 'react'
import Icon from '@ant-design/icons'
import '@/assets/css/components/common/fullscreen-loading-mask.scss'
import { COLOR_FONT_MAIN } from '@/constants/common.constants'
import FitFullScreen from '@/components/common/FitFullScreen'

const FullscreenLoadingMask: React.FC = () => {
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
                <div className={'fullscreen-loading-mask'}>
                    <AntdSpin indicator={loadingIcon} />
                </div>
            </FitFullScreen>
        </>
    )
}

export default FullscreenLoadingMask
