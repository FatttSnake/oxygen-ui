import React from 'react'
import '@/assets/css/components/common/hide-scrollbar.scss'

interface HideScrollbarProps
    extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    isPreventScroll?: boolean
    isPreventVerticalScroll?: boolean
    isPreventHorizontalScroll?: boolean
    isShowVerticalScrollbar?: boolean
    isShowHorizontalScrollbar?: boolean
}

export interface HideScrollbarElement {
    scrollTo(x: number, y: number, smooth?: boolean): void
    scrollX(x: number, smooth?: boolean): void
    scrollY(y: number, smooth?: boolean): void
    scrollLeft(length: number, smooth?: boolean): void
    scrollRight(length: number, smooth?: boolean): void
    scrollUp(length: number, smooth?: boolean): void
    scrollDown(length: number, smooth?: boolean): void
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
    const lastTouchPosition = useRef<{ x: number; y: number }>({ x: -1, y: -1 })
    const [verticalScrollbarWidth, setVerticalScrollbarWidth] = useState(0)
    const [horizontalScrollbarWidth, setHorizontalScrollbarWidth] = useState(0)

    const {
        isPreventScroll,
        isPreventVerticalScroll,
        isPreventHorizontalScroll,
        isShowVerticalScrollbar,
        isShowHorizontalScrollbar,
        ..._props
    } = props

    const handleDefaultWheel = useCallback(
        (event: WheelEvent) => {
            if (!event.altKey && !event.ctrlKey) {
                if (isPreventScroll) {
                    event.preventDefault()
                    return
                }
                if (isPreventVerticalScroll && !event.shiftKey && !event.deltaX) {
                    event.preventDefault()
                    return
                }
                if (isPreventHorizontalScroll && (event.shiftKey || !event.deltaY)) {
                    event.preventDefault()
                    return
                }
            }
        },
        [isPreventScroll, isPreventHorizontalScroll, isPreventVerticalScroll]
    )

    const handleDefaultTouchStart = useCallback(
        (event: TouchEvent) => {
            if (event.touches.length !== 1 || isPreventScroll) {
                lastTouchPosition.current = { x: -1, y: -1 }
                return
            }

            const { clientX, clientY } = event.touches[0]
            lastTouchPosition.current = { x: clientX, y: clientY }
        },
        [isPreventScroll]
    )

    const handleDefaultTouchmove = useCallback(
        (event: TouchEvent) => {
            event.preventDefault()
            if (event.touches.length !== 1 || isPreventScroll) {
                lastTouchPosition.current = { x: -1, y: -1 }
                return
            }
            const { clientX, clientY } = event.touches[0]

            if (!isPreventVerticalScroll) {
                rootRef.current?.scrollTo({
                    top: rootRef.current?.scrollTop + (lastTouchPosition.current.y - clientY),
                    behavior: 'instant'
                })
            }

            if (!isPreventHorizontalScroll) {
                rootRef.current?.scrollTo({
                    left: rootRef.current?.scrollLeft + (lastTouchPosition.current.x - clientX),
                    behavior: 'instant'
                })
            }

            lastTouchPosition.current = { x: clientX, y: clientY }
        },
        [isPreventScroll, isPreventHorizontalScroll, isPreventVerticalScroll]
    )

    const handleDefaultClickMiddleMouseButton = useCallback((event: MouseEvent) => {
        if (event.button === 1) {
            event.preventDefault()
        }
    }, [])

    const handleDefaultKeyDown = useCallback(
        (event: KeyboardEvent) => {
            if (
                isPreventScroll &&
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
            if (
                isPreventVerticalScroll &&
                ['ArrowUp', 'ArrowDown', ' ', '', 'PageUp', 'PageDown', 'Home', 'End'].find(
                    (value) => value === event.key
                )
            ) {
                event.preventDefault()
            }
            if (
                isPreventHorizontalScroll &&
                ['ArrowLeft', 'ArrowRight'].find((value) => value === event.key)
            ) {
                event.preventDefault()
            }
        },
        [isPreventScroll, isPreventHorizontalScroll, isPreventVerticalScroll]
    )

    useImperativeHandle<HideScrollbarElement, HideScrollbarElement>(
        ref,
        () => {
            return {
                scrollTo(x, y, smooth?: boolean) {
                    rootRef.current?.scrollTo({
                        left: x,
                        top: y,
                        behavior: smooth === false ? 'instant' : 'smooth'
                    })
                },
                scrollX(x, smooth?: boolean) {
                    rootRef.current?.scrollTo({
                        left: x,
                        behavior: smooth === false ? 'instant' : 'smooth'
                    })
                },
                scrollY(y, smooth?: boolean) {
                    rootRef.current?.scrollTo({
                        top: y,
                        behavior: smooth === false ? 'instant' : 'smooth'
                    })
                },
                scrollLeft(length, smooth?: boolean) {
                    rootRef.current?.scrollTo({
                        left: rootRef.current?.scrollLeft - length,
                        behavior: smooth === false ? 'instant' : 'smooth'
                    })
                },
                scrollRight(length, smooth?: boolean) {
                    rootRef.current?.scrollTo({
                        left: rootRef.current?.scrollLeft + length,
                        behavior: smooth === false ? 'instant' : 'smooth'
                    })
                },
                scrollUp(length, smooth?: boolean) {
                    rootRef.current?.scrollTo({
                        top: rootRef.current?.scrollTop - length,
                        behavior: smooth === false ? 'instant' : 'smooth'
                    })
                },
                scrollDown(length, smooth?: boolean) {
                    rootRef.current?.scrollTo({
                        top: rootRef.current?.scrollTop + length,
                        behavior: smooth === false ? 'instant' : 'smooth'
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
        if (isPreventScroll || isPreventVerticalScroll || isPreventHorizontalScroll) {
            rootRef.current?.addEventListener('wheel', handleDefaultWheel, { passive: false })
            rootRef.current?.addEventListener('touchstart', handleDefaultTouchStart, {
                passive: false
            })
            rootRef.current?.addEventListener('touchmove', handleDefaultTouchmove, {
                passive: false
            })
            rootRef.current?.addEventListener('mousedown', handleDefaultClickMiddleMouseButton)
            rootRef.current?.addEventListener('keydown', handleDefaultKeyDown)
        } else {
            rootRef.current?.removeEventListener('wheel', handleDefaultWheel)
            rootRef.current?.removeEventListener('touchstart', handleDefaultTouchStart)
            rootRef.current?.removeEventListener('touchmove', handleDefaultTouchmove)
            rootRef.current?.removeEventListener('mousedown', handleDefaultClickMiddleMouseButton)
            rootRef.current?.removeEventListener('keydown', handleDefaultKeyDown)
        }

        return () => {
            window.removeEventListener('resize', windowResizeListener)
        }
    }, [
        handleDefaultClickMiddleMouseButton,
        handleDefaultKeyDown,
        handleDefaultTouchStart,
        handleDefaultTouchmove,
        handleDefaultWheel,
        isPreventHorizontalScroll,
        isPreventScroll,
        isPreventVerticalScroll
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
