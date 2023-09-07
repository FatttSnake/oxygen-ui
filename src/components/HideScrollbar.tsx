import React, { PropsWithChildren } from 'react'
import '@/assets/css/hide-scrollbar.scss'

const HideScrollbar: React.FC<PropsWithChildren> = (prop: PropsWithChildren) => {
    const hideScrollbarRef = useRef<HTMLDivElement>(null)
    const [verticalScrollbarWidth, setVerticalScrollbarWidth] = useState(0)
    const [horizontalScrollbarWidth, setHorizontalScrollbarWidth] = useState(0)

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

        window.addEventListener('resize', windowResizeListener())

        return () => {
            window.removeEventListener('resize', windowResizeListener())
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
                {prop.children}
            </div>
        </>
    )
}

export default HideScrollbar
