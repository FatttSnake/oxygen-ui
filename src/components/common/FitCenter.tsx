import React from 'react'
import '@/assets/css/components/common/fit-center.scss'

interface FitCenterProps
    extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    vertical?: boolean
}

const FitCenter: React.FC<FitCenterProps> = ({ className, vertical, ...props }) => {
    return (
        <div
            className={`fit-center${className ? ` ${className}` : ''}${
                vertical ? ' flex-vertical' : ' flex-horizontal'
            }`}
            {...props}
        />
    )
}

export default FitCenter
