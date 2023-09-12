import React from 'react'
import '@/assets/css/components/common/fit-center.scss'

const FitCenter: React.FC<
    React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
> = (props) => {
    const { className, ..._props } = props
    return (
        <>
            <div className={`fit-center${className ? ' ' + className : ''}`} {..._props}></div>
        </>
    )
}

export default FitCenter
