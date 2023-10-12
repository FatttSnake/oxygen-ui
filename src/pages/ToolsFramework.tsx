import React from 'react'
import FitFullScreen from '@/components/common/FitFullScreen'
import '@/assets/css/pages/tools-framework.scss'
import Icon from '@ant-design/icons'
import { toolsJsonObjects } from '@/router/tools.tsx'
import HideScrollbar from '@/components/common/HideScrollbar.tsx'

const ToolsFramework: React.FC = () => {
    return (
        <>
            <FitFullScreen className={'flex-horizontal'}>
                <div className={'left-panel'}>
                    <HideScrollbar>
                        <div className={'title'}>氮工具</div>
                        <div className={'content'}>
                            <ul>
                                <li>
                                    <div style={{ marginTop: '0' }} className={'separate'} />
                                </li>
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
                                                <Icon
                                                    className={'icon'}
                                                    component={toolsJsonObjects[0].icon}
                                                />
                                            </div>
                                            <span className={'text'}>
                                                {toolsJsonObjects[0].name}
                                            </span>
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
                                                <Icon
                                                    className={'icon'}
                                                    component={toolsJsonObjects[1].icon}
                                                />
                                            </div>
                                            <span className={'text'}>
                                                {toolsJsonObjects[1].name}
                                            </span>
                                        </NavLink>
                                    </div>
                                </li>
                                <li>
                                    <div className={'separate'} />
                                </li>
                                {toolsJsonObjects.map((tool) => {
                                    return tool.menu &&
                                        tool.id !== 'tools' &&
                                        tool.id !== 'tools-all' ? (
                                        <li className={'item'} key={tool.id}>
                                            <div className={'menu-bt'}>
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
                                                <ul className={'submenu'}>
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
                                                                        <span className={'text'}>
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
                        </div>
                    </HideScrollbar>
                </div>
                <div className={'right-panel'}></div>
            </FitFullScreen>
        </>
    )
}

export default ToolsFramework
