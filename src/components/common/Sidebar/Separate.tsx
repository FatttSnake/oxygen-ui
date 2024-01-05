import React from 'react'

const Separate: React.FC<
    React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
> = ({ className, ...props }) => {
    return <div className={`separate ${className ? ` ${className}` : ''}`} {...props} />
}

export default Separate
