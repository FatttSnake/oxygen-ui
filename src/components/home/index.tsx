import React, { useEffect } from 'react'
import '@/assets/css/components/home/home.scss'
import FitFullScreen from '@/components/common/FitFullScreen'
import FitCenter from '@/components/common/FitCenter'
import { MainFrameworkContext } from '@/pages/MainFramework'
import Slogan from '@/components/home/Slogan'
import OxygenToolbox from '@/components/home/OxygenToolbox'
import Indicator from '@/components/common/Indicator.tsx'

const Home: React.FC = () => {
    const {
        hideScrollbarRef,
        navbarHiddenState: { navbarHidden, setNavbarHidden },
        preventScrollState: { setPreventScroll }
    } = useContext(MainFrameworkContext)

    const fitFullScreenRef = useRef<HTMLDivElement>(null)
    const scrollTimeout = useRef(0)
    const clickStart = useRef(0)

    const [currentContent, setCurrentContent] = useState(0)

    useEffect(() => {
        setTimeout(() => {
            setNavbarHidden(true)
            setPreventScroll(true)
        })
    }, [setNavbarHidden, setPreventScroll])

    useLayoutEffect(() => {
        const handleWindowResize = () => {
            handleScrollToContent(currentContent)()
        }
        window.addEventListener('resize', handleWindowResize)
        return () => window.removeEventListener('resize', handleWindowResize)
    })

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

    const handleScrollUp = () => {
        if (currentContent <= 0) {
            return
        }
        handleScrollToContent(currentContent - 1)()
        clearTimeout(scrollTimeout.current)
        scrollTimeout.current = setTimeout(() => {
            setCurrentContent(currentContent - 1)
        }, 500)
    }

    const handleScrollDown = () => {
        if (currentContent >= content.length - 1) {
            return
        }
        handleScrollToContent(currentContent + 1)()
        clearTimeout(scrollTimeout.current)
        scrollTimeout.current = setTimeout(() => {
            setCurrentContent(currentContent + 1)
        }, 500)
    }

    const handleWheel = (event: React.WheelEvent) => {
        if (event.altKey || event.ctrlKey || event.shiftKey) {
            return
        }

        if (event.deltaY > 0) {
            handleScrollDown()
        } else {
            handleScrollUp()
        }
    }

    const handleTouchStart = (event: React.TouchEvent) => {
        clickStart.current = event.touches[0].clientY
    }

    const handleTouchEnd = (event: React.TouchEvent) => {
        const moveLength = clickStart.current - event.changedTouches[0].clientY
        if (Math.abs(moveLength) < 100) {
            return
        }

        if (moveLength > 0) {
            handleScrollDown()
        } else {
            handleScrollUp()
        }
    }

    const handleMouseDown = (event: React.MouseEvent) => {
        clickStart.current = event.clientY
    }

    const handleMouseUp = (event: React.MouseEvent) => {
        const moveLength = clickStart.current - event.clientY
        if (Math.abs(moveLength) < 100) {
            return
        }

        if (moveLength > 0) {
            handleScrollDown()
        } else {
            handleScrollUp()
        }
    }

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'ArrowUp') {
            handleScrollUp()
        }
        if (event.key === 'ArrowDown') {
            handleScrollDown()
        }
    }

    const handleIndicatorSwitch = (index: number) => {
        setCurrentContent(index)
        handleScrollToContent(index)()
    }

    const content = [
        {
            backgroundColor: '#FBFBFB',
            ref: fitFullScreenRef,
            children: <Slogan onClickScrollDown={handleScrollDown} />
        },
        { children: <OxygenToolbox /> },
        { children: <FitCenter>3</FitCenter> }
    ]

    return (
        <>
            <div
                tabIndex={0}
                onWheel={handleWheel}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onKeyDown={handleKeyDown}
            >
                {content.map((element, index) => {
                    return <FitFullScreen key={index} {...element} />
                })}
            </div>

            <div hidden={navbarHidden} className={'indicator'}>
                <Indicator
                    total={content.length}
                    current={currentContent}
                    onSwitch={handleIndicatorSwitch}
                />
            </div>
        </>
    )
}

export default Home
