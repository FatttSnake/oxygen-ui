import React from 'react'

const SidebarSeparate: React.FC<
    React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
> = ({ className, ...props }) => {
    return <div className={`separate ${className ? ` ${className}` : ''}`} {...props} />
}

export default SidebarSeparate
