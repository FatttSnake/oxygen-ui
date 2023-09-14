import React from 'react'
import '@/assets/css/components/common/fit-center.scss'

interface FitCenterProps
    extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    vertical?: boolean
}

const FitCenter: React.FC<FitCenterProps> = (props) => {
    const { className, vertical, ..._props } = props
    return (
        <>
            <div
                className={`fit-center${className ? ' ' + className : ''}${
                    vertical ? ' direction-vertical' : ' direction-horizontal'
                }`}
                {..._props}
            ></div>
        </>
    )
}

export default FitCenter
