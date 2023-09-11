import React from 'react'
import '@/assets/css/fit-center.scss'

const FitCenter: React.FC<React.PropsWithChildren> = (props) => {
    return (
        <>
            <div className={'fit-center'}>{props.children}</div>
        </>
    )
}

export default FitCenter
