import React from 'react'
import '@/assets/css/fit-fullscreen.scss'

interface FitFullscreenProps extends React.PropsWithChildren {
    zIndex?: number
    backgroundColor?: string
}

const FitFullScreen = forwardRef<HTMLDivElement, FitFullscreenProps>((props, ref) => {
    return (
        <>
            <div
                className={'fit-fullscreen'}
                style={{
                    zIndex: props.zIndex,
                    backgroundColor: props.backgroundColor
                }}
                ref={ref}
            >
                {props.children}
            </div>
        </>
    )
})

export default FitFullScreen
