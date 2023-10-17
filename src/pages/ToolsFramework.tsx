import React from 'react'
import FitFullScreen from '@/components/common/FitFullScreen'
import '@/assets/css/pages/tools-framework.scss'
import Icon from '@ant-design/icons'
import { tools } from '@/router/tools'
import HideScrollbar, { HideScrollbarElement } from '@/components/common/HideScrollbar'
import { getLocalStorage, getRedirectUrl, setLocalStorage } from '@/utils/common'
import { getLoginStatus, logout } from '@/utils/auth'
import { NavLink, Outlet } from 'react-router-dom'

const ToolsFramework: React.FC = () => {
    const matches = useMatches()
    const lastMatch = matches.reduce((_, second) => second)
    const location = useLocation()
    const navigate = useNavigate()
    const hideScrollbarRef = useRef<HideScrollbarElement>(null)
    const [submenuTop, setSubmenuTop] = useState(0)
    const [submenuLeft, setSubmenuLeft] = useState(0)
    const [hideSidebar, setHideSidebar] = useState(getLocalStorage('hideSidebar') === 'false')
    const [exiting, setExiting] = useState(false)

    const switchSidebar = () => {
        setHideSidebar(!hideSidebar)
        setLocalStorage('hideSidebar', hideSidebar ? 'true' : 'false')
        setTimeout(() => {
            hideScrollbarRef.current?.refreshLayout()
        }, 300)
    }

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

    const handleClickAvatar = () => {
        if (getLoginStatus()) {
            navigate(`${lastMatch.pathname}${location.search}`)
        } else {
            navigate(getRedirectUrl('/login', `${lastMatch.pathname}${location.search}`))
        }
    }

    const handleLogout = () => {
        if (exiting) {
            return
        }

        setExiting(true)
        void logout().finally(() => {
            setTimeout(() => {
                window.location.reload()
            }, 1500)
        })
    }

    return (
        <>
            <FitFullScreen className={'flex-horizontal'}>
                <div className={`left-panel${hideSidebar ? ' hide' : ''}`}>
                    <div className={'title'}>
                        <span className={'icon-box'} onClick={switchSidebar}>
                            <Icon component={IconFatwebExpand} />
                        </span>
                        <span className={'text'}>氮工具</span>
                    </div>
                    <div style={{ marginTop: '0' }} className={'separate'} />
                    <div className={'content'}>
                        <ul>
                            <li className={'item'}>
                                <div className={'menu-bt'}>
                                    <NavLink
                                        to={''}
                                        end
                                        className={({ isActive, isPending }) =>
                                            isPending ? 'pending' : isActive ? 'active' : ''
                                        }
                                    >
                                        <div className={'icon-box'}>
                                            {tools[0].icon ? (
                                                <Icon
                                                    className={'icon'}
                                                    component={tools[0].icon}
                                                />
                                            ) : undefined}
                                        </div>
                                        <span className={'text'}>{tools[0].name}</span>
                                    </NavLink>
                                </div>
                            </li>
                            <li className={'item'}>
                                <div className={'menu-bt'}>
                                    <NavLink
                                        to={'all'}
                                        className={({ isActive, isPending }) =>
                                            isPending ? ' pending' : isActive ? ' active' : ''
                                        }
                                    >
                                        <div className={'icon-box'}>
                                            {tools[1].icon ? (
                                                <Icon
                                                    className={'icon'}
                                                    component={tools[1].icon}
                                                />
                                            ) : undefined}
                                        </div>
                                        <span className={'text'}>{tools[1].name}</span>
                                    </NavLink>
                                </div>
                            </li>
                            <li>
                                <div className={'separate'} style={{ marginBottom: 0 }} />
                            </li>
                        </ul>
                        <div className={'toolsMenu'}>
                            <HideScrollbar
                                isShowVerticalScrollbar={true}
                                scrollbarWidth={2}
                                animationTransitionTime={300}
                                autoHideWaitingTime={800}
                                ref={hideScrollbarRef}
                            >
                                <ul>
                                    {tools.map((tool) => {
                                        return tool.menu &&
                                            tool.id !== 'tools' &&
                                            tool.id !== 'tools-all' ? (
                                            <li className={'item'} key={tool.id}>
                                                <div
                                                    className={'menu-bt'}
                                                    onMouseEnter={showSubmenu}
                                                >
                                                    <NavLink
                                                        to={tool.path}
                                                        className={({ isActive, isPending }) =>
                                                            isPending
                                                                ? 'pending'
                                                                : isActive
                                                                ? 'active'
                                                                : ''
                                                        }
                                                    >
                                                        <div className={'icon-box'}>
                                                            {tool.icon ? (
                                                                <Icon
                                                                    className={'icon'}
                                                                    component={tool.icon}
                                                                />
                                                            ) : undefined}
                                                        </div>
                                                        <span className={'text'}>{tool.name}</span>
                                                    </NavLink>
                                                </div>
                                                {tool.children ? (
                                                    <ul
                                                        className={'submenu'}
                                                        style={{
                                                            top: submenuTop,
                                                            left: submenuLeft
                                                        }}
                                                    >
                                                        <div className={'content'}>
                                                            {tool.children.map((subTool) => {
                                                                return subTool.menu ? (
                                                                    <li
                                                                        className={'item'}
                                                                        key={subTool.id}
                                                                    >
                                                                        <NavLink
                                                                            to={`${tool.path}/${subTool.path}`}
                                                                            className={({
                                                                                isActive,
                                                                                isPending
                                                                            }) =>
                                                                                isPending
                                                                                    ? 'pending'
                                                                                    : isActive
                                                                                    ? 'active'
                                                                                    : ''
                                                                            }
                                                                        >
                                                                            <span
                                                                                className={'text'}
                                                                            >
                                                                                {subTool.name}
                                                                            </span>
                                                                        </NavLink>
                                                                    </li>
                                                                ) : undefined
                                                            })}
                                                        </div>
                                                    </ul>
                                                ) : undefined}
                                            </li>
                                        ) : undefined
                                    })}
                                </ul>
                            </HideScrollbar>
                        </div>
                    </div>
                    <div className={'separate'} style={{ marginTop: 0, marginBottom: 0 }} />
                    <div className={'footer'}>
                        <span className={'icon-user'} onClick={handleClickAvatar}>
                            <Icon component={IconFatwebUser} />
                        </span>
                        <span hidden={getLoginStatus()} className={'text'}>
                            未
                            <NavLink
                                to={getRedirectUrl(
                                    '/login',
                                    `${lastMatch.pathname}${location.search}`
                                )}
                            >
                                登录
                            </NavLink>
                        </span>
                        <span hidden={!getLoginStatus()} className={'text'}>
                            已登录
                        </span>
                        <div
                            hidden={!getLoginStatus()}
                            className={`submenu-exit${!getLoginStatus() ? ' hide' : ''}`}
                        >
                            <div className={'content'}>
                                <span
                                    hidden={!getLoginStatus()}
                                    className={'icon-exit'}
                                    onClick={handleLogout}
                                >
                                    <Icon
                                        component={exiting ? IconFatwebLoading : IconFatwebExit}
                                        spin={exiting}
                                    />
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={'right-panel'}>
                    <Outlet />
                </div>
            </FitFullScreen>
        </>
    )
}

export default ToolsFramework
