import { ReactNode, MouseEvent } from 'react'
import Icon from '@ant-design/icons'
import useStyles from '@/assets/css/components/common/sidebar/item.style'
import { SidebarContext } from '@/components/common/Sidebar/index'
import Submenu, { SubmenuContext } from '@/components/common/Sidebar/Submenu'

export const ItemContext = createContext({ isHover: false })

type ItemProps = {
    icon?: IconComponent | string
    text?: string
    path: string
    children?: ReactNode
    extend?: ReactNode
    end?: boolean
}

const Item = (props: ItemProps) => {
    const { styles, cx } = useStyles()
    const { isCollapse } = useContext(SidebarContext)
    const { isInSubmenu } = useContext(SubmenuContext)
    const [isHover, setIsHover] = useState(false)
    const [submenuTop, setSubmenuTop] = useState(Number.MAX_VALUE)
    const [submenuLeft, setSubmenuLeft] = useState(Number.MAX_VALUE)

    const showSubmenu = (e: MouseEvent) => {
        const parentElement = e.currentTarget.parentElement
        if (parentElement?.childElementCount === 2) {
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
        <ItemContext.Provider value={{ isHover }}>
            <li
                className={cx(styles.item, isInSubmenu ? styles.submenuItem : '')}
                onMouseOver={() => setIsHover(true)}
                onMouseLeave={() => setIsHover(false)}
            >
                <div className={cx(styles.menuBt, 'dnd-delete-mask')} onMouseEnter={showSubmenu}>
                    <NavLink
                        end={props.end}
                        to={props.path}
                        className={({ isActive, isPending }) =>
                            isPending ? 'pending' : isActive ? `${styles.active}` : ''
                        }
                    >
                        {props.icon && (
                            <div className={styles.icon}>
                                {typeof props.icon === 'string' ? (
                                    <img
                                        src={`data:image/svg+xml;base64,${props.icon}`}
                                        alt={'icon'}
                                    />
                                ) : (
                                    <Icon component={props.icon} />
                                )}
                            </div>
                        )}
                        <span
                            className={cx(
                                styles.text,
                                isCollapse && !isInSubmenu ? styles.collapsedText : ''
                            )}
                        >
                            {props.text}
                        </span>
                        <div className={isCollapse ? styles.collapsedExtend : ''}>
                            {props.extend}
                        </div>
                    </NavLink>
                </div>
                {props.children && (
                    <Submenu submenuTop={submenuTop} submenuLeft={submenuLeft}>
                        {props.children}
                    </Submenu>
                )}
            </li>
        </ItemContext.Provider>
    )
}

export default Item
