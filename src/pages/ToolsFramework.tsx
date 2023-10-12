import React from 'react'
import FitFullScreen from '@/components/common/FitFullScreen'
import '@/assets/css/pages/tools-framework.scss'
import Icon from '@ant-design/icons'
import { toolsJsonObjects } from '@/router/tools.tsx'
import _ from 'lodash'

const ToolsFramework: React.FC = () => {
    const location = useLocation()

    const [multipleMenuShown, setMultipleMenuShown] = useState(
        toolsJsonObjects.map((value) => ({
            id: value.id,
            path: value.path,
            shown: `${location.pathname}/`.startsWith(`/tools/${value.path}/`)
        }))
    )

    useEffect(() => {
        const temp = _.clone(multipleMenuShown)
        temp.forEach((value) => {
            value.shown = `${location.pathname}/`.startsWith(`/tools/${value.path}/`)
        })
        setMultipleMenuShown(temp)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location])

    const switchSubmenu = (menuId: string) => {
        return () => {
            const temp = _.clone(multipleMenuShown)
            const menu = temp.find(({ id }) => id === menuId)
            menu && (menu.shown = !menu.shown)
            setMultipleMenuShown(temp)
        }
    }

    return (
        <>
            <FitFullScreen className={'flex-horizontal'}>
                <div className={'left-panel'}>
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
                                        <Icon
                                            className={'icon'}
                                            component={toolsJsonObjects[0].icon}
                                        />
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
                                        <Icon
                                            className={'icon'}
                                            component={toolsJsonObjects[1].icon}
                                        />
                                        <span className={'text'}>{toolsJsonObjects[1].name}</span>
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
                                    <li
                                        className={
                                            tool.children
                                                ? `multiple-item${
                                                      multipleMenuShown.find(
                                                          ({ id }) => id === tool.id
                                                      )?.shown ?? false
                                                          ? ' show'
                                                          : ''
                                                  }`
                                                : 'item'
                                        }
                                        key={tool.id}
                                    >
                                        <div className={'menu-bt'}>
                                            {tool.children ? (
                                                <div
                                                    className={'icon-box'}
                                                    onClick={switchSubmenu(tool.id)}
                                                >
                                                    <Icon
                                                        className={'icon'}
                                                        component={IconFatwebDown}
                                                    />
                                                </div>
                                            ) : undefined}
                                            <NavLink
                                                to={tool.path}
                                                className={({ isActive, isPending }) =>
                                                    isPending ? 'pending' : isActive ? 'active' : ''
                                                }
                                            >
                                                {tool.children ? undefined : tool.icon ? (
                                                    <Icon
                                                        className={'icon'}
                                                        component={tool.icon}
                                                    />
                                                ) : undefined}
                                                <span className={'text'}>{tool.name}</span>
                                            </NavLink>
                                        </div>
                                        {tool.children ? (
                                            <ul className={'submenu'}>
                                                {tool.children.map((subTool) => {
                                                    return subTool.menu ? (
                                                        <li className={'item'} key={subTool.id}>
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
                                                                {subTool.icon ? (
                                                                    <Icon
                                                                        className={'icon'}
                                                                        component={subTool.icon}
                                                                    />
                                                                ) : undefined}
                                                                <span className={'text'}>
                                                                    {subTool.name}
                                                                </span>
                                                            </NavLink>
                                                        </li>
                                                    ) : undefined
                                                })}
                                            </ul>
                                        ) : undefined}
                                    </li>
                                ) : undefined
                            })}
                        </ul>
                    </div>
                </div>
                <div className={'right-panel'}></div>
            </FitFullScreen>
        </>
    )
}

export default ToolsFramework
