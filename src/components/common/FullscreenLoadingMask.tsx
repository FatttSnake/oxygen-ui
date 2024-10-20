import Icon from '@ant-design/icons'
import useStyles from '@/assets/css/components/common/fullscreen-loading-mask.style'
import { COLOR_FONT_MAIN } from '@/constants/common.constants'
import FitFullscreen from '@/components/common/FitFullscreen'

const FullscreenLoadingMask = () => {
    const { styles } = useStyles()

    const loadingIcon = (
        <>
            <Icon
                component={IconOxygenLoading}
                style={{ fontSize: 24, color: COLOR_FONT_MAIN }}
                spin
            />
        </>
    )
    return (
        <>
            <FitFullscreen>
                <div className={styles.fullscreenLoadingMask}>
                    <AntdSpin indicator={loadingIcon} />
                </div>
            </FitFullscreen>
        </>
    )
}

export default FullscreenLoadingMask
