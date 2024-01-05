import React from 'react'

interface SidebarSubmenuProps extends React.PropsWithChildren {
    submenuTop: number
    submenuLeft: number
}

const Submenu: React.FC<SidebarSubmenuProps> = (props) => {
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

export default Submenu
