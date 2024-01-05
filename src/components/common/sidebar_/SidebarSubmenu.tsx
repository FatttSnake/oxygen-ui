import React from 'react'

interface SidebarSubmenuProps extends React.PropsWithChildren {
    submenuTop: number
    submenuLeft: number
}

const SidebarSubmenu: React.FC<SidebarSubmenuProps> = (props) => {
    return (
        <ul
            className={'submenu'}
            style={{
                top: props.submenuTop,
                left: props.submenuLeft
            }}
        >
            <div className={'content'}>{props.children}</div>
        </ul>
    )
}

export default SidebarSubmenu
