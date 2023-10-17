import React from 'react'

const SidebarItemList: React.FC<React.PropsWithChildren> = (props) => {
    return <ul>{props.children}</ul>
}

export default SidebarItemList
