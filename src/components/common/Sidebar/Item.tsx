import React from 'react'
import Icon from '@ant-design/icons'
import Submenu from '@/components/common/Sidebar/Submenu'

type ItemProps = {
    icon?: IconComponent
    text?: string
    path: string
    children?: React.ReactNode
    end?: boolean
}

const Item: React.FC<ItemProps> = (props) => {
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
                    end={props.end}
                    to={props.path}
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
                <Submenu submenuTop={submenuTop} submenuLeft={submenuLeft}>
                    {props.children}
                </Submenu>
            ) : undefined}
        </li>
    )
}

export default Item
