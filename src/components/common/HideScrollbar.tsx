import React from 'react'
import '@/assets/css/components/common/hide-scrollbar.scss'

interface HideScrollbarProps
    extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    isPreventScroll?: boolean
    isPreventVerticalScroll?: boolean
    isPreventHorizontalScroll?: boolean
    isShowVerticalScrollbar?: boolean
    isHiddenVerticalScrollbarWhenFull?: boolean
    isShowHorizontalScrollbar?: boolean
    isHiddenHorizontalScrollbarWhenFull?: boolean
    minWidth?: string | number
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

    const maskRef = useRef<HTMLDivElement>(null)
    const rootRef = useRef<HTMLDivElement>(null)
    const contentRef = useRef<HTMLDivElement>(null)
    const wheelListenerRef = useRef<(event: WheelEvent) => void>(() => undefined)
    const lastScrollbarClickPositionRef = useRef({ x: -1, y: -1 })
    const lastScrollbarTouchPositionRef = useRef({ x: -1, y: -1 })
    const lastTouchPositionRef = useRef({ x: -1, y: -1 })
    const [verticalScrollbarWidth, setVerticalScrollbarWidth] = useState(0)
    const [verticalScrollbarLength, setVerticalScrollbarLength] = useState(100)
    const [verticalScrollbarPosition, setVerticalScrollbarPosition] = useState(0)
    const [verticalScrollbarOnClick, setVerticalScrollbarOnClick] = useState(false)
    const [verticalScrollbarOnTouch, setVerticalScrollbarOnTouch] = useState(false)
    const [horizontalScrollbarWidth, setHorizontalScrollbarWidth] = useState(0)
    const [horizontalScrollbarLength, setHorizontalScrollbarLength] = useState(100)
    const [horizontalScrollbarPosition, setHorizontalScrollbarPosition] = useState(0)
    const [horizontalScrollbarOnClick, setHorizontalScrollbarOnClick] = useState(false)
    const [horizontalScrollbarOnTouch, setHorizontalScrollbarOnTouch] = useState(false)

    const {
        isPreventScroll,
        isPreventVerticalScroll,
        isPreventHorizontalScroll,
        isShowVerticalScrollbar,
        isHiddenVerticalScrollbarWhenFull,
        isShowHorizontalScrollbar,
        isHiddenHorizontalScrollbarWhenFull,
        minWidth,
        ..._props
    } = props

    const isPreventAnyScroll =
        isPreventScroll || isPreventVerticalScroll || isPreventHorizontalScroll

    const handleDefaultTouchStart = useCallback(
        (event: React.TouchEvent) => {
            if (event.touches.length !== 1 || isPreventScroll) {
                lastTouchPositionRef.current = { x: -1, y: -1 }
                return
            }

            const { clientX, clientY } = event.touches[0]
            lastTouchPositionRef.current = { x: clientX, y: clientY }
        },
        [isPreventScroll]
    )

    const handleDefaultTouchmove = useCallback(
        (event: React.TouchEvent) => {
            if (event.touches.length !== 1 || isPreventScroll) {
                lastTouchPositionRef.current = { x: -1, y: -1 }
                return
            }
            const { clientX, clientY } = event.touches[0]

            if (!isPreventVerticalScroll) {
                rootRef.current?.scrollTo({
                    top: rootRef.current?.scrollTop + (lastTouchPositionRef.current.y - clientY),
                    behavior: 'instant'
                })
            }

            if (!isPreventHorizontalScroll) {
                rootRef.current?.scrollTo({
                    left: rootRef.current?.scrollLeft + (lastTouchPositionRef.current.x - clientX),
                    behavior: 'instant'
                })
            }

            lastTouchPositionRef.current = { x: clientX, y: clientY }
        },
        [isPreventHorizontalScroll, isPreventScroll, isPreventVerticalScroll]
    )

    const handleDefaultMouseDown = (event: React.MouseEvent) => {
        if (isPreventAnyScroll)
            if (event.button === 1) {
                event.preventDefault()
            }
    }

    const handleDefaultKeyDown = useCallback(
        (event: React.KeyboardEvent) => {
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
        [isPreventHorizontalScroll, isPreventScroll, isPreventVerticalScroll]
    )

    const handleScrollbarMouseEvent = (eventFlag: string, scrollbarFlag: string) => {
        return (event: React.MouseEvent) => {
            switch (eventFlag) {
                case 'down':
                    lastScrollbarClickPositionRef.current = { x: event.clientX, y: event.clientY }
                    switch (scrollbarFlag) {
                        case 'vertical':
                            setVerticalScrollbarOnClick(true)
                            break
                        case 'horizontal':
                            setHorizontalScrollbarOnClick(true)
                            break
                    }
                    break
                case 'up':
                case 'leave':
                    setVerticalScrollbarOnClick(false)
                    setHorizontalScrollbarOnClick(false)
                    break
                case 'move':
                    if (verticalScrollbarOnClick) {
                        rootRef.current?.scrollTo({
                            top:
                                rootRef.current?.scrollTop +
                                ((event.clientY - lastScrollbarClickPositionRef.current.y) /
                                    (rootRef.current?.clientHeight ?? 1)) *
                                    (contentRef.current?.clientHeight ?? 0),
                            behavior: 'instant'
                        })
                    }
                    if (horizontalScrollbarOnClick) {
                        rootRef.current?.scrollTo({
                            left:
                                rootRef.current?.scrollLeft +
                                ((event.clientX - lastScrollbarClickPositionRef.current.x) /
                                    (rootRef.current?.clientWidth ?? 1)) *
                                    (contentRef.current?.clientWidth ?? 0),
                            behavior: 'instant'
                        })
                    }
                    lastScrollbarClickPositionRef.current = {
                        x: event.clientX,
                        y: event.clientY
                    }
            }
        }
    }

    const handleScrollbarTouchEvent = (eventFlag: string, scrollbarFlag: string) => {
        return (event: React.TouchEvent) => {
            switch (eventFlag) {
                case 'start':
                    if (event.touches.length !== 1) {
                        return
                    }
                    lastScrollbarTouchPositionRef.current = {
                        x: event.touches[0].clientX,
                        y: event.touches[0].clientY
                    }
                    switch (scrollbarFlag) {
                        case 'vertical':
                            setVerticalScrollbarOnTouch(true)
                            break
                        case 'horizontal':
                            setHorizontalScrollbarOnTouch(true)
                            break
                    }
                    break
                case 'end':
                case 'cancel':
                    setVerticalScrollbarOnTouch(false)
                    setHorizontalScrollbarOnTouch(false)
                    break
                case 'move':
                    if (event.touches.length !== 1) {
                        return
                    }
                    if (verticalScrollbarOnTouch) {
                        rootRef.current?.scrollTo({
                            top:
                                rootRef.current?.scrollTop +
                                ((event.touches[0].clientY -
                                    lastScrollbarClickPositionRef.current.y) /
                                    (rootRef.current?.clientHeight ?? 1)) *
                                    (contentRef.current?.clientHeight ?? 0),
                            behavior: 'instant'
                        })
                    }
                    if (horizontalScrollbarOnTouch) {
                        rootRef.current?.scrollTo({
                            left:
                                rootRef.current?.scrollLeft +
                                ((event.touches[0].clientX -
                                    lastScrollbarClickPositionRef.current.x) /
                                    (rootRef.current?.clientWidth ?? 1)) *
                                    (contentRef.current?.clientWidth ?? 0),
                            behavior: 'instant'
                        })
                    }
                    lastScrollbarClickPositionRef.current = {
                        x: event.touches[0].clientX,
                        y: event.touches[0].clientY
                    }
            }
        }
    }

    const handleDefaultScroll = () => {
        setVerticalScrollbarPosition(
            ((rootRef.current?.scrollTop ?? 0) / (contentRef.current?.clientHeight ?? 1)) * 100
        )
        setHorizontalScrollbarPosition(
            ((rootRef.current?.scrollLeft ?? 0) / (contentRef.current?.clientWidth ?? 1)) * 100
        )
    }

    useEffect(() => {
        const windowResizeListener = () => {
            setVerticalScrollbarWidth(
                (rootRef.current?.offsetWidth ?? 0) - (rootRef.current?.clientWidth ?? 0)
            )
            setHorizontalScrollbarWidth(
                (rootRef.current?.offsetHeight ?? 0) - (rootRef.current?.clientHeight ?? 0)
            )

            rootRef.current &&
                setVerticalScrollbarLength(
                    (rootRef.current.clientHeight / (contentRef.current?.clientHeight ?? 0)) * 100
                )

            rootRef.current &&
                setHorizontalScrollbarLength(
                    (rootRef.current.clientWidth / (contentRef.current?.clientWidth ?? 0)) * 100
                )

            return windowResizeListener
        }
        setTimeout(() => {
            windowResizeListener()
        }, 1000)
        window.addEventListener('resize', windowResizeListener())

        rootRef.current?.removeEventListener('wheel', wheelListenerRef.current)
        if (isPreventAnyScroll) {
            const handleDefaultWheel = (event: WheelEvent) => {
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
            }
            wheelListenerRef.current = handleDefaultWheel
            rootRef.current?.addEventListener('wheel', handleDefaultWheel, { passive: false })
        }

        rootRef.current &&
            setVerticalScrollbarLength(
                (rootRef.current.clientHeight / (contentRef.current?.clientHeight ?? 0)) * 100
            )

        rootRef.current &&
            setHorizontalScrollbarLength(
                (rootRef.current.clientWidth / (contentRef.current?.clientWidth ?? 0)) * 100
            )

        return () => {
            window.removeEventListener('resize', windowResizeListener)
        }
    }, [
        horizontalScrollbarLength,
        isPreventAnyScroll,
        isPreventHorizontalScroll,
        isPreventScroll,
        isPreventVerticalScroll
    ])

    return (
        <>
            <div
                className={'hide-scrollbar-mask'}
                ref={maskRef}
                onMouseMove={
                    !isPreventScroll ? handleScrollbarMouseEvent('move', 'all') : undefined
                }
                onTouchMove={
                    !isPreventScroll ? handleScrollbarTouchEvent('move', 'all') : undefined
                }
                onMouseUp={!isPreventScroll ? handleScrollbarMouseEvent('up', 'all') : undefined}
                onTouchEnd={!isPreventScroll ? handleScrollbarTouchEvent('end', 'all') : undefined}
                onMouseLeave={
                    !isPreventScroll ? handleScrollbarMouseEvent('leave', 'all') : undefined
                }
                onTouchCancel={
                    !isPreventScroll ? handleScrollbarTouchEvent('cancel', 'all') : undefined
                }
            >
                <div
                    ref={rootRef}
                    className={'hide-scrollbar-selection'}
                    tabIndex={0}
                    style={{
                        width: `calc(100vw + ${verticalScrollbarWidth}px)`,
                        height: `calc(100vh + ${horizontalScrollbarWidth}px)`,
                        touchAction: isPreventAnyScroll ? 'none' : '',
                        msTouchAction: isPreventAnyScroll ? 'none' : ''
                    }}
                    {..._props}
                    onMouseDown={isPreventAnyScroll ? handleDefaultMouseDown : undefined}
                    onKeyDown={isPreventAnyScroll ? handleDefaultKeyDown : undefined}
                    onTouchStart={isPreventAnyScroll ? handleDefaultTouchStart : undefined}
                    onTouchMove={isPreventAnyScroll ? handleDefaultTouchmove : undefined}
                    onScroll={handleDefaultScroll}
                >
                    <div className={'hide-scrollbar-content'} ref={contentRef} style={{ minWidth }}>
                        {props.children}
                    </div>
                </div>
                <div
                    hidden={
                        !isShowVerticalScrollbar ||
                        ((isHiddenVerticalScrollbarWhenFull ?? true) &&
                            verticalScrollbarLength === 100)
                    }
                    className={'scrollbar vertical-scrollbar'}
                >
                    <div className={'box'}>
                        <div
                            className={'block'}
                            style={{
                                height: `${verticalScrollbarLength}%`,
                                top: `clamp(0px, ${verticalScrollbarPosition}%, ${
                                    100 - verticalScrollbarLength
                                }%)`
                            }}
                            onMouseDown={
                                !isPreventScroll && !isPreventVerticalScroll
                                    ? handleScrollbarMouseEvent('down', 'vertical')
                                    : undefined
                            }
                            onTouchStart={
                                !isPreventScroll && !isPreventVerticalScroll
                                    ? handleScrollbarTouchEvent('start', 'vertical')
                                    : undefined
                            }
                        />
                    </div>
                </div>
                <div
                    hidden={
                        !isShowHorizontalScrollbar ||
                        ((isHiddenHorizontalScrollbarWhenFull ?? true) &&
                            horizontalScrollbarLength === 100)
                    }
                    className={'scrollbar horizontal-scrollbar'}
                >
                    <div className={'box'}>
                        <div
                            className={'block'}
                            style={{
                                width: `${horizontalScrollbarLength}%`,
                                left: `clamp(0px, ${horizontalScrollbarPosition}%, ${
                                    100 - horizontalScrollbarLength
                                }%)`
                            }}
                            onMouseDown={
                                !isPreventScroll && !isPreventHorizontalScroll
                                    ? handleScrollbarMouseEvent('down', 'horizontal')
                                    : undefined
                            }
                            onTouchStart={
                                !isPreventScroll && !isPreventHorizontalScroll
                                    ? handleScrollbarTouchEvent('start', 'horizontal')
                                    : undefined
                            }
                        />
                    </div>
                </div>
            </div>
        </>
    )
})

export default HideScrollbar
