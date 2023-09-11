import React from 'react'
import '@/assets/css/home.scss'
import FitFullScreen from '@/components/FitFullScreen.tsx'
import FitCenter from '@/components/FitCenter.tsx'
import Icon from '@ant-design/icons'
import { MainFrameworkContext } from '@/pages/MainFramework.tsx'

const Home: React.FC = () => {
    const {
        hideScrollbarRef,
        navbarHiddenState: { setNavbarHidden },
        preventScrollState: { setPreventScroll }
    } = useContext(MainFrameworkContext)
    const fitFullScreenRef = useRef<HTMLDivElement>(null)

    const [slogan, setSlogan] = useState('')
    const [sloganType, setSloganType] = useState(true)

    const typeText = '/* 因为热爱 所以折腾 */'
    if (sloganType) {
        setTimeout(() => {
            if (slogan.length < typeText.length) {
                setSlogan(typeText.substring(0, slogan.length + 1))
            } else {
                setSloganType(false)
            }
        }, 150)
    } else {
        setTimeout(() => {
            if (slogan.length > 0) {
                setSlogan(typeText.substring(0, slogan.length - 1))
            } else {
                setSloganType(true)
            }
        }, 50)
    }

    useEffect(() => {
        setTimeout(() => {
            setNavbarHidden(true)
            setPreventScroll(true)
        })
    }, [setNavbarHidden, setPreventScroll])

    const handleScrollToDown = () => {
        hideScrollbarRef.current?.scrollY(fitFullScreenRef.current?.offsetHeight ?? 0)
        setNavbarHidden(false)
    }

    const handleScrollToTop = () => {
        hideScrollbarRef.current?.scrollY(0)
        setNavbarHidden(true)
    }

    const handleWheel = (event: React.WheelEvent) => {
        if (event.altKey || event.ctrlKey) {
            return
        }

        if (event.deltaY > 0) {
            handleScrollToDown()
            setNavbarHidden(false)
        } else {
            handleScrollToTop()
            setNavbarHidden(true)
        }
    }

    return (
        <>
            <div onWheel={handleWheel}>
                <FitFullScreen backgroundColor={'#FBFBFB'} ref={fitFullScreenRef}>
                    <FitCenter>
                        <div className={'center-box'}>
                            <div className={'big-logo'}>FatWeb</div>
                            <span id={'slogan'} className={'slogan'}>
                                {slogan || <>&nbsp;</>}
                            </span>
                        </div>
                        <div className={'scroll-down'} onClick={handleScrollToDown}>
                            <Icon
                                component={IconFatwebDown}
                                style={{ fontSize: '1.8em', color: '#666' }}
                            />
                        </div>
                    </FitCenter>
                </FitFullScreen>
                <FitFullScreen />
                <FitFullScreen />
            </div>
        </>
    )
}

export default Home
