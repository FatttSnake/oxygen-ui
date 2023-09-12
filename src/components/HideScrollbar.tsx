import React from 'react'
import '@/assets/css/hide-scrollbar.scss'

interface HideScrollbarProps
    extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    isPreventScroll?: boolean
}

export interface HideScrollbarElement {
    scrollTo(x: number, y: number): void
    scrollX(x: number): void
    scrollY(y: number): void
    scrollLeft(length: number): void
    scrollRight(length: number): void
    scrollUp(length: number): void
    scrollDown(length: number): void
    getX(): number
    getY(): number
    addEventListenerWithType<K extends keyof HTMLElementEventMap>(
        type: K,
        listener: (this: HTMLDivElement, ev: HTMLElementEventMap[K]) => never,
        options?: boolean | AddEventListenerOptions
    ): void
    addEventListener(
        type: string,
        listener: EventListenerOrEventListenerObject,
        options?: boolean | AddEventListenerOptions
    ): void
    removeEventListenerWithType<K extends keyof HTMLElementEventMap>(
        type: K,
        listener: (this: HTMLDivElement, ev: HTMLElementEventMap[K]) => never,
        options?: boolean | EventListenerOptions
    ): void
    removeEventListener(
        type: string,
        listener: EventListenerOrEventListenerObject,
        options?: boolean | EventListenerOptions
    ): void
}

const HideScrollbar = forwardRef<HideScrollbarElement, HideScrollbarProps>((props, ref) => {
    const rootRef = useRef<HTMLDivElement>(null)
    const [verticalScrollbarWidth, setVerticalScrollbarWidth] = useState(0)
    const [horizontalScrollbarWidth, setHorizontalScrollbarWidth] = useState(0)

    const { isPreventScroll, ..._props } = props
    const handleDefaultWheel = useCallback((event: WheelEvent) => {
        if (!event.altKey && !event.ctrlKey) {
            event.preventDefault()
        }
    }, [])

    const handleDefaultTouchmove = useCallback((event: TouchEvent) => {
        event.preventDefault()
    }, [])

    const handleDefaultClickMiddleMouseButton = useCallback((event: MouseEvent) => {
        if (event.button === 1) {
            event.preventDefault()
        }
    }, [])

    const handleDefaultKeyDown = (event: KeyboardEvent) => {
        if (
            [
                'ArrowUp',
                'ArrowDown',
                'ArrowLeft',
                'ArrowRight',
                ' ',
                '',
                'PageUp',
                'PageDown',
                'Home',
                'End'
            ].find((value) => value === event.key)
        ) {
            event.preventDefault()
        }
    }

    useImperativeHandle<HideScrollbarElement, HideScrollbarElement>(
        ref,
        () => {
            return {
                scrollTo(x, y) {
                    rootRef.current?.scrollTo({
                        left: x,
                        top: y,
                        behavior: 'smooth'
                    })
                },
                scrollX(x) {
                    rootRef.current?.scrollTo({
                        left: x,
                        behavior: 'smooth'
                    })
                },
                scrollY(y) {
                    rootRef.current?.scrollTo({
                        top: y,
                        behavior: 'smooth'
                    })
                },
                scrollLeft(length) {
                    rootRef.current?.scrollTo({
                        left: rootRef.current?.scrollLeft - length,
                        behavior: 'smooth'
                    })
                },
                scrollRight(length) {
                    rootRef.current?.scrollTo({
                        left: rootRef.current?.scrollLeft + length,
                        behavior: 'smooth'
                    })
                },
                scrollUp(length) {
                    rootRef.current?.scrollTo({
                        top: rootRef.current?.scrollTop - length,
                        behavior: 'smooth'
                    })
                },
                scrollDown(length) {
                    rootRef.current?.scrollTo({
                        top: rootRef.current?.scrollTop + length,
                        behavior: 'smooth'
                    })
                },
                getX() {
                    return rootRef.current?.scrollLeft ?? 0
                },
                getY() {
                    return rootRef.current?.scrollTop ?? 0
                },
                addEventListenerWithType<K extends keyof HTMLElementEventMap>(
                    type: K,
                    listener: (this: HTMLDivElement, ev: HTMLElementEventMap[K]) => never,
                    options?: boolean | AddEventListenerOptions
                ): void {
                    rootRef.current?.addEventListener<K>(type, listener, options)
                },
                addEventListener(
                    type: string,
                    listener: EventListenerOrEventListenerObject,
                    options?: boolean | AddEventListenerOptions
                ): void {
                    rootRef.current?.addEventListener(type, listener, options)
                },
                removeEventListenerWithType<K extends keyof HTMLElementEventMap>(
                    type: K,
                    listener: (this: HTMLDivElement, ev: HTMLElementEventMap[K]) => never,
                    options?: boolean | EventListenerOptions
                ): void {
                    rootRef.current?.removeEventListener<K>(type, listener, options)
                },
                removeEventListener(
                    type: string,
                    listener: EventListenerOrEventListenerObject,
                    options?: boolean | EventListenerOptions
                ): void {
                    rootRef.current?.removeEventListener(type, listener, options)
                }
            }
        },
        []
    )

    useEffect(() => {
        const hideScrollbarElement = rootRef.current

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
        if (isPreventScroll) {
            rootRef.current?.addEventListener('wheel', handleDefaultWheel, { passive: false })
            rootRef.current?.addEventListener('touchmove', handleDefaultTouchmove, {
                passive: false
            })
            rootRef.current?.addEventListener('mousedown', handleDefaultClickMiddleMouseButton)
            rootRef.current?.addEventListener('keydown', handleDefaultKeyDown)
        } else {
            rootRef.current?.removeEventListener('wheel', handleDefaultWheel)
            rootRef.current?.removeEventListener('touchmove', handleDefaultTouchmove)
            rootRef.current?.removeEventListener('mousedown', handleDefaultClickMiddleMouseButton)
            rootRef.current?.removeEventListener('keydown', handleDefaultKeyDown)
        }

        return () => {
            window.removeEventListener('resize', windowResizeListener)
        }
    }, [
        handleDefaultClickMiddleMouseButton,
        handleDefaultTouchmove,
        handleDefaultWheel,
        isPreventScroll
    ])

    return (
        <>
            <div className={'hide-scrollbar-mask'}>
                <div
                    ref={rootRef}
                    className={'hide-scrollbar-selection'}
                    tabIndex={0}
                    style={{
                        width: `calc(100vw + ${verticalScrollbarWidth}px)`,
                        height: `calc(100vh + ${horizontalScrollbarWidth}px`
                    }}
                    {..._props}
                >
                    {props.children}
                </div>
            </div>
        </>
    )
})

export default HideScrollbar
