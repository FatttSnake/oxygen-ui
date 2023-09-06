import React from 'react'

const FitFullScreen: React.FC<PropsWithChildren> = (props: PropsWithChildren) => {
    return (
        <>
            <div id={'fit-fullscreen'}>{props.children}</div>
        </>
    )
}

export default FitFullScreen
