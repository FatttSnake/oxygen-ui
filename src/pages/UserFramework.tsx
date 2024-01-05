import React from 'react'
import '@/assets/css/pages/user-framework.scss'
import user from '@/router/user'
import { hasPathPermission } from '@/util/auth'
import FitFullscreen from '@/components/common/FitFullscreen'
import Sidebar from 'src/components/common/sidebar_'
import SidebarItemList from '@/components/common/sidebar_/SidebarItemList'
import SidebarItem from '@/components/common/sidebar_/SidebarItem'
import FullscreenLoadingMask from '@/components/common/FullscreenLoadingMask'

const ToolsFramework: React.FC = () => {
    return (
        <>
            <FitFullscreen data-component={'user-framework'} className={'flex-horizontal'}>
                <div className={'left-panel'}>
                    <Sidebar
                        title={'个人中心'}
                        bottomFixed={
                            <SidebarItemList>
                                {hasPathPermission('/system') ? (
                                    <SidebarItem
                                        path={'/system'}
                                        icon={IconOxygenSetting}
                                        text={'系统配置'}
                                    />
                                ) : undefined}
                                <SidebarItem path={'/'} icon={IconOxygenBack} text={'回到氧工具'} />
                            </SidebarItemList>
                        }
                    >
                        <SidebarItemList>
                            {user.map((value) => {
                                return value.menu ? (
                                    <SidebarItem
                                        end={value.id === 'user' ? true : undefined}
                                        path={value.absolutePath}
                                        icon={value.icon}
                                        text={value.name}
                                        key={value.id}
                                    />
                                ) : undefined
                            })}
                        </SidebarItemList>
                    </Sidebar>
                </div>
                <div className={'right-panel'}>
                    <Suspense
                        fallback={
                            <>
                                <FullscreenLoadingMask />
                            </>
                        }
                    >
                        <Outlet />
                    </Suspense>
                </div>
            </FitFullscreen>
        </>
    )
}

export default ToolsFramework
