import React, { CSSProperties, useState } from 'react'
import echarts, { EChartsCoreOption, EChartsType } from 'echarts/core'
import { RendererType } from 'echarts/types/src/util/types'
import { LocaleOption } from 'echarts/types/src/core/locale'
import { bind, clear } from 'size-sensor'
import isEqual from 'fast-deep-equal'
import { usePrevious } from '@/util/hooks'

interface EChartsInitOpts {
    locale?: string | LocaleOption
    renderer?: RendererType
    devicePixelRatio?: number
    useDirtyRect?: boolean
    useCoarsePointer?: boolean
    pointerSize?: number
    ssr?: boolean
    width?: number | string
    height?: number | string
}

interface EChartsReactProps {
    echarts: typeof echarts
    className?: string
    style?: CSSProperties
    option: EChartsCoreOption
    theme?: string | object | null
    notMerge?: boolean
    lazyUpdate?: boolean
    showLoading?: boolean
    loadingOption?: object
    opts?: EChartsInitOpts
    onChartReady?: (instance: EChartsType) => void
    onEvents?: Record<string, () => void>
    shouldSetOption?: (prevProps: EChartsReactProps, props: EChartsReactProps) => boolean
}

const EChartReact: React.FC<EChartsReactProps> = (props) => {
    const elementRef = useRef<HTMLDivElement>(null)
    const prevProps = usePrevious(props)
    const [echarts] = useState(props.echarts)
    const [isInitialResize, setIsInitialResize] = useState(true)

    const { style, className = '', theme, opts } = props

    const renderNewECharts = () => {
        const { onEvents, onChartReady } = props

        const eChartsInstance = updateEChartsOption()

        bindEvents(eChartsInstance, onEvents || {})

        if (typeof onChartReady === 'function') {
            onChartReady(eChartsInstance)
        }

        if (elementRef.current) {
            bind(elementRef.current, () => {
                resize()
            })
        }

        return () => {
            dispose()
        }
    }

    const updateEChartsOption = () => {
        const { option, notMerge = false, lazyUpdate = false, showLoading, loadingOption } = props

        const eChartsInstance = getEChartsInstance()
        eChartsInstance.setOption(option, notMerge, lazyUpdate)
        if (showLoading) {
            eChartsInstance.showLoading(loadingOption)
        } else {
            eChartsInstance.hideLoading()
        }

        return eChartsInstance
    }

    const getEChartsInstance = () =>
        (elementRef.current && echarts.getInstanceByDom(elementRef.current)) ||
        echarts.init(elementRef.current, theme, opts)

    const bindEvents = (instance: EChartsType, events: EChartsReactProps['onEvents']) => {
        const _bindEvents = (
            eventName: string,
            func: (param: unknown, instance: EChartsType) => void
        ) => {
            if (typeof func === 'function') {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call
                instance.on(eventName, (param: unknown) => {
                    func(param, instance)
                })
            }
        }

        for (const eventName in events) {
            if (Object.prototype.hasOwnProperty.call(events, eventName)) {
                _bindEvents(eventName, events[eventName])
            }
        }
    }

    const resize = () => {
        const eChartsInstance = getEChartsInstance()

        if (!isInitialResize) {
            try {
                eChartsInstance.resize()
            } catch (e) {
                console.warn(e)
            }
        }

        setIsInitialResize(false)
    }

    const dispose = () => {
        if (elementRef.current) {
            try {
                clear(elementRef.current)
            } catch (e) {
                console.warn(e)
            }
            echarts.dispose(elementRef.current)
        }
    }

    const pick = (obj: EChartsReactProps | undefined, keys: string[]): Record<string, unknown> => {
        const r = {}
        keys.forEach((key) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            r[key] = obj[key]
        })
        return r
    }

    useEffect(() => {
        renderNewECharts()
    })

    useEffect(() => {
        const { shouldSetOption } = props
        if (
            typeof shouldSetOption === 'function' &&
            prevProps &&
            !shouldSetOption(prevProps, props)
        ) {
            return
        }

        if (
            !isEqual(prevProps?.theme, props.theme) ||
            !isEqual(prevProps?.opts, props.opts) ||
            !isEqual(prevProps?.onEvents, props.onEvents)
        ) {
            dispose()
            renderNewECharts()
            return
        }

        const pickKeys = ['option', 'notMerge', 'lazyUpdate', 'showLoading', 'loadingOption']
        if (!isEqual(pick(props, pickKeys), pick(prevProps, pickKeys))) {
            updateEChartsOption()
        }

        if (
            !isEqual(prevProps?.style, props.style) ||
            !isEqual(prevProps?.className, props.className)
        ) {
            resize()
        }
    }, [props])

    return <div ref={elementRef} style={style} className={`echarts-react ${className}`}></div>
}

export default EChartReact
