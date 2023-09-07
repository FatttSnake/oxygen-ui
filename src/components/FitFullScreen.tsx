import React from 'react'

const FitFullScreen: React.FC<FitFullscreenProps> = (props: FitFullscreenProps) => {
    return (
        <>
            <div
                id={'fit-fullscreen'}
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
