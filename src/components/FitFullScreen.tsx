import React from 'react'

interface FitFullscreenProps extends PropsWithChildren {
    zIndex?: number
    backgroundColor?: string
    ref?: RefObject<HTMLDivElement>
}

const FitFullScreen: React.FC<FitFullscreenProps> = (props) => {
    return (
        <>
            <div
                className={'fit-fullscreen'}
                style={{
                    zIndex: props.zIndex,
                    backgroundColor: props.backgroundColor
                }}
            >
                {props.children}
            </div>
        </>
    )
}

export default FitFullScreen
