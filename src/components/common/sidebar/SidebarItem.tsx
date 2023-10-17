import React from 'react'
import Icon from '@ant-design/icons'
import SidebarSubmenu from '@/components/common/sidebar/SidebarSubmenu'

type ItemProps = {
    icon?: IconComponent
    text?: string
    path: string
    children?: React.ReactNode
}

const SidebarItem: React.FC<ItemProps> = (props) => {
    const [submenuTop, setSubmenuTop] = useState(0)
    const [submenuLeft, setSubmenuLeft] = useState(0)

    const showSubmenu = (e: React.MouseEvent) => {
        const parentElement = e.currentTarget.parentElement
        if (parentElement && parentElement.childElementCount === 2) {
            const parentClientRect = parentElement.getBoundingClientRect()
            if (parentClientRect.top <= screen.height / 2) {
                setSubmenuTop(parentClientRect.top)
            } else {
                setSubmenuTop(
                    parentClientRect.top -
                        (parentElement.lastElementChild?.clientHeight ?? 0) +
                        e.currentTarget.clientHeight
                )
            }
            setSubmenuLeft(parentClientRect.right)
        }
    }

    return (
        <li className={'item'}>
            <div className={'menu-bt'} onMouseEnter={showSubmenu}>
                <NavLink
                    to={props.path}
                    end
                    className={({ isActive, isPending }) =>
                        isPending ? 'pending' : isActive ? 'active' : ''
                    }
                >
                    <div className={'icon-box'}>
                        {props.icon ? (
                            <Icon className={'icon'} component={props.icon} />
                        ) : undefined}
                    </div>
                    <span className={'text'}>{props.text}</span>
                </NavLink>
            </div>
            {props.children ? (
                <SidebarSubmenu submenuTop={submenuTop} submenuLeft={submenuLeft}>
                    {props.children}
                </SidebarSubmenu>
            ) : undefined}
        </li>
    )
}

export default SidebarItem
