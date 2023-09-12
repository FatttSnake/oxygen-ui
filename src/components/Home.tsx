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

    const scrollTimeout = useRef<number>()

    const [slogan, setSlogan] = useState('')
    const [sloganType, setSloganType] = useState(true)
    const [currentContent, setCurrentContent] = useState(0)

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

    const handleScrollToContent = (index: number) => {
        return () => {
            if (!index) {
                setNavbarHidden(true)
                hideScrollbarRef.current?.scrollY(0)
            } else {
                hideScrollbarRef.current?.scrollY(
                    (fitFullScreenRef.current?.offsetHeight ?? 0) * index
                )
                setNavbarHidden(false)
            }
        }
    }

    const handleWheel = (event: React.WheelEvent) => {
        if (event.altKey || event.ctrlKey) {
            return
        }

        if (event.deltaY > 0) {
            if (currentContent >= content.length) {
                return
            }
            handleScrollToContent(currentContent + 1)()
            clearTimeout(scrollTimeout.current ?? 0)
            scrollTimeout.current = setTimeout(() => {
                setCurrentContent(currentContent + 1)
                console.log(`up ${currentContent + 1}`)
            }, 500)
        } else {
            if (currentContent <= 0) {
                return
            }
            handleScrollToContent(currentContent - 1)()
            clearTimeout(scrollTimeout.current ?? 0)
            scrollTimeout.current = setTimeout(() => {
                setCurrentContent(currentContent - 1)
                console.log(`down ${currentContent - 1}`)
            }, 500)
        }
    }

    const content = [
        {
            backgroundColor: '#FBFBFB',
            ref: fitFullScreenRef,
            children: (
                <FitCenter>
                    <div className={'center-box'}>
                        <div className={'big-logo'}>FatWeb</div>
                        <span id={'slogan'} className={'slogan'}>
                            {slogan || <>&nbsp;</>}
                        </span>
                    </div>
                    <div className={'scroll-down'} onClick={handleScrollToContent(1)}>
                        <Icon
                            component={IconFatwebDown}
                            style={{ fontSize: '1.8em', color: '#666' }}
                        />
                    </div>
                </FitCenter>
            )
        },
        { children: <FitCenter>2</FitCenter> },
        { children: <FitCenter>3</FitCenter> }
    ]

    return (
        <>
            <div onWheel={handleWheel}>
                {content.map((element, index) => {
                    return <FitFullScreen key={index} {...element} />
                })}
            </div>
        </>
    )
}

export default Home
