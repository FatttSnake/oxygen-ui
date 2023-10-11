import React from 'react'
import FitFullScreen from '@/components/common/FitFullScreen'
import '@/assets/css/pages/tools-framework.scss'
import router from '@/router'
import { NavLink } from 'react-router-dom'
import Icon from '@ant-design/icons'

const ToolsFramework: React.FC = () => {
    const frameworkRoute = useMatches()[1]
    const routeId = frameworkRoute.id
    const routeChildren = router.routes[0].children?.find((value) => value.id === routeId)?.children

    return (
        <>
            <FitFullScreen className={'flex-horizontal'}>
                <div className={'left-panel'}>
                    <div className={'title'}>氦工具</div>
                    <div className={'content'}>
                        <ul>
                            <li className={'item'}>
                                <NavLink
                                    to={''}
                                    className={({ isActive, isPending }) =>
                                        isPending ? ' pending' : isActive ? ' active' : ''
                                    }
                                >
                                    {routeChildren ? (
                                        <>
                                            <Icon
                                                className={'icon'}
                                                component={
                                                    (routeChildren[0].handle as RouteHandle).icon
                                                }
                                            />
                                            <span className={'text'}>
                                                {(routeChildren[0].handle as RouteHandle).name}
                                            </span>
                                        </>
                                    ) : (
                                        '全部工具'
                                    )}
                                </NavLink>
                                <div className={'home'}></div>
                            </li>
                            <li>
                                <div className={'separate'} />
                            </li>
                            {routeChildren?.map((route) => {
                                return (route.handle as RouteHandle).menu &&
                                    route.id !== 'tools' ? (
                                    <li className={'item'} key={route.id}>
                                        <NavLink
                                            to={route.path ?? ''}
                                            className={({ isActive, isPending }) =>
                                                isPending ? 'pending' : isActive ? 'active' : ''
                                            }
                                        >
                                            <Icon
                                                className={'icon'}
                                                component={(route.handle as RouteHandle).icon}
                                            />
                                            <span className={'text'}>
                                                {(route.handle as RouteHandle).name}
                                            </span>
                                        </NavLink>
                                        {route.children ? (
                                            <ul className={'submenu'}>
                                                {route.children.map((subRoute) => {
                                                    return (subRoute.handle as RouteHandle).menu ? (
                                                        <li className={'item'} key={subRoute.id}>
                                                            <NavLink
                                                                to={
                                                                    (route.path ?? '') +
                                                                    '/' +
                                                                    (subRoute.path ?? '')
                                                                }
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
                                                                <Icon
                                                                    className={'icon'}
                                                                    component={
                                                                        (
                                                                            subRoute.handle as RouteHandle
                                                                        ).icon
                                                                    }
                                                                />
                                                                <span className={'text'}>
                                                                    {
                                                                        (
                                                                            subRoute.handle as RouteHandle
                                                                        ).name
                                                                    }
                                                                </span>
                                                            </NavLink>
                                                        </li>
                                                    ) : (
                                                        <></>
                                                    )
                                                })}
                                            </ul>
                                        ) : (
                                            <></>
                                        )}
                                    </li>
                                ) : (
                                    <></>
                                )
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
