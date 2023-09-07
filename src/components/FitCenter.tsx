import React from 'react'

const FitCenter: React.FC<PropsWithChildren> = (props: PropsWithChildren) => {
    return (
        <>
            <div id={'fit-center'}>{props.children}</div>
        </>
    )
}

export default FitCenter
