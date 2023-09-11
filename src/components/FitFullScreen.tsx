import React from 'react'
import '@/assets/css/fit-fullscreen.scss'

interface FitFullscreenProps
    extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    zIndex?: number
    backgroundColor?: string
}

const FitFullScreen = forwardRef<HTMLDivElement, FitFullscreenProps>((props, ref) => {
    const { zIndex, backgroundColor, className, style, ..._props } = props
    return (
        <>
            <div
                className={`fit-fullscreen${className ? ' ' + className : ''}`}
                style={{
                    zIndex,
                    backgroundColor,
                    ...style
                }}
                ref={ref}
                {..._props}
            >
                {props.children}
            </div>
        </>
    )
})

export default FitFullScreen
