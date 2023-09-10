import React from 'react'
import '@/assets/css/home.scss'
import FitFullScreen from '@/components/FitFullScreen.tsx'
import FitCenter from '@/components/FitCenter.tsx'
import Icon from '@ant-design/icons'
import { MainFrameworkContext } from '@/pages/MainFramework.tsx'

const Home: React.FC = () => {
    const {
        hideScrollbarRef,
        navbarHiddenState: { navbarHidden, setNavbarHidden }
    } = useContext(MainFrameworkContext)
    const fitFullScreenRef = useRef<HTMLDivElement>(null)
    const pathname = useLocation().pathname

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

    const hideScrollbarDOM = hideScrollbarRef.current
    const scrollListener = useCallback(() => {
        if (
            hideScrollbarDOM &&
            fitFullScreenRef.current &&
            hideScrollbarDOM.getY() < fitFullScreenRef.current?.offsetHeight
        ) {
            if (!navbarHidden) {
                setNavbarHidden(true)
            }
        } else {
            if (navbarHidden) {
                setNavbarHidden(false)
            }
        }
    }, [hideScrollbarDOM, navbarHidden, setNavbarHidden])

    useEffect(() => {
        hideScrollbarDOM?.removeEventListener('scroll', scrollListener)
        hideScrollbarDOM?.addEventListener('scroll', scrollListener)
        return () => {
            hideScrollbarDOM?.removeEventListener('scroll', scrollListener)
        }
    }, [hideScrollbarDOM, scrollListener])

    useEffect(() => {
        scrollListener()
    }, [pathname, scrollListener])

    const handleScrollDown = () => {
        hideScrollbarRef.current?.scrollY(fitFullScreenRef.current?.offsetHeight ?? 0)
    }

    return (
        <>
            <FitFullScreen backgroundColor={'#FBFBFB'} ref={fitFullScreenRef}>
                <FitCenter>
                    <div className={'center-box'}>
                        <div className={'big-logo'}>FatWeb</div>
                        <span id={'slogan'} className={'slogan'}>
                            {slogan || <>&nbsp;</>}
                        </span>
                    </div>
                    <div className={'scroll-down'} onClick={handleScrollDown}>
                        <Icon
                            component={IconFatwebDown}
                            style={{ fontSize: '1.8em', color: '#666' }}
                        />
                    </div>
                </FitCenter>
            </FitFullScreen>
            <FitFullScreen />
            <FitFullScreen />
        </>
    )
}

export default Home
