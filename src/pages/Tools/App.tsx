import GetItOnGooglePlay from '@/assets/svg/GetItOnGooglePlay.svg'
import useStyles from '@/assets/css/pages/tools/app.style'
import FitFullscreen from '@/components/common/FitFullscreen'
import FlexBox from '@/components/common/FlexBox'

const App = () => {
    const { styles } = useStyles()

    return (
        <FitFullscreen>
            <FlexBox className={styles.root}>
                <a href={import.meta.env.VITE_GET_ANDROID_APP_URL} target={'_blank'}>
                    <img
                        className={styles.getItOnGooglePlay}
                        src={GetItOnGooglePlay}
                        alt={'GetItOnGooglePlay'}
                    />
                </a>
            </FlexBox>
        </FitFullscreen>
    )
}

export default App
