import React from 'react'
import '@/assets/css/fit-center.scss'

const FitCenter: React.FC<PropsWithChildren> = (props: PropsWithChildren) => {
    return (
        <>
            <div className={'fit-center'}>{props.children}</div>
        </>
    )
}

export default FitCenter
