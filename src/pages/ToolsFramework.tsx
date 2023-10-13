import React from 'react'
import FitFullScreen from '@/components/common/FitFullScreen'
import '@/assets/css/pages/tools-framework.scss'
import Icon from '@ant-design/icons'
import { toolsJsonObjects } from '@/router/tools.tsx'
import HideScrollbar, { HideScrollbarElement } from '@/components/common/HideScrollbar.tsx'
import { getLocalStorage, setLocalStorage } from '@/utils/common.ts'

const ToolsFramework: React.FC = () => {
    const hideScrollbarRef = useRef<HideScrollbarElement>(null)
    const [submenuTop, setSubmenuTop] = useState(0)
    const [submenuLeft, setSubmenuLeft] = useState(0)
    const [hideSidebar, setHideSidebar] = useState(getLocalStorage('hideSidebar') === 'false')

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
                                            {toolsJsonObjects[0].icon ? (
                                                <Icon
                                                    className={'icon'}
                                                    component={toolsJsonObjects[0].icon}
                                                />
                                            ) : undefined}
                                        </div>
                                        <span className={'text'}>{toolsJsonObjects[0].name}</span>
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
                                            {toolsJsonObjects[1].icon ? (
                                                <Icon
                                                    className={'icon'}
                                                    component={toolsJsonObjects[1].icon}
                                                />
                                            ) : undefined}
                                        </div>
                                        <span className={'text'}>{toolsJsonObjects[1].name}</span>
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
                                ref={hideScrollbarRef}
                            >
                                <ul>
                                    {toolsJsonObjects.map((tool) => {
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
                        <span className={'icon-box'} onClick={switchSidebar}>
                            <Icon component={IconFatwebExpand} />
                        </span>
                        <span className={'text'}>氮工具</span>
                    </div>
                </div>
                <div className={'right-panel'}></div>
            </FitFullScreen>
        </>
    )
}

export default ToolsFramework
