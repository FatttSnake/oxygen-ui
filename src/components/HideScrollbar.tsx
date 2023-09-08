import React from 'react'
import '@/assets/css/hide-scrollbar.scss'

interface HideScrollbarProps extends PropsWithChildren {
    getHideScrollbarRef: (hideScrollbarRef: RefObject<HTMLElement>) => void
}

const HideScrollbar: React.FC<HideScrollbarProps> = (props) => {
    const hideScrollbarRef = useRef<HTMLDivElement>(null)
    const [verticalScrollbarWidth, setVerticalScrollbarWidth] = useState(0)
    const [horizontalScrollbarWidth, setHorizontalScrollbarWidth] = useState(0)

    props.getHideScrollbarRef(hideScrollbarRef)

    useEffect(() => {
        const hideScrollbarElement = hideScrollbarRef.current

        const windowResizeListener = () => {
            setVerticalScrollbarWidth(
                (hideScrollbarElement?.offsetWidth ?? 0) - (hideScrollbarElement?.clientWidth ?? 0)
            )
            setHorizontalScrollbarWidth(
                (hideScrollbarElement?.offsetHeight ?? 0) -
                    (hideScrollbarElement?.clientHeight ?? 0)
            )

            return windowResizeListener
        }

        setTimeout(() => {
            windowResizeListener()
        }, 1000)

        window.addEventListener('resize', windowResizeListener())

        return () => {
            window.removeEventListener('resize', windowResizeListener)
        }
    }, [])

    return (
        <>
            <div
                ref={hideScrollbarRef}
                id={'hide-scrollbar'}
                style={{
                    width: `calc(100vw + ${verticalScrollbarWidth}px)`,
                    height: `calc(100vh + ${horizontalScrollbarWidth}px`
                }}
            >
                {props.children}
            </div>
        </>
    )
}

export default HideScrollbar
