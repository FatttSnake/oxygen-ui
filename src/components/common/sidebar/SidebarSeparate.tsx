import React from 'react'

const SidebarSeparate: React.FC<
    React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
> = (props) => {
    const { className, ..._props } = props

    return <div className={`separate ${className ? ` ${className}` : ''}`} {..._props} />
}

export default SidebarSeparate
