import React from 'react'
import user from '@/router/user'
import '@/assets/css/pages/tools-framework.scss'
import FitFullScreen from '@/components/common/FitFullScreen'
import Sidebar from '@/components/common/sidebar'
import SidebarItemList from '@/components/common/sidebar/SidebarItemList'
import SidebarItem from '@/components/common/sidebar/SidebarItem'
import { hasPathPermission } from '@/utils/auth.ts'

const ToolsFramework: React.FC = () => {
    return (
        <>
            <FitFullScreen className={'flex-horizontal'}>
                <div className={'left-panel'}>
                    <Sidebar
                        title={'个人中心'}
                        bottomFixed={
                            hasPathPermission('/system') ? (
                                <SidebarItemList>
                                    <SidebarItem
                                        path={'/system'}
                                        icon={IconFatwebSetting}
                                        text={'系统设置'}
                                    />
                                </SidebarItemList>
                            ) : undefined
                        }
                    >
                        <SidebarItemList>
                            {user.map((value) => {
                                return value.menu ? (
                                    <SidebarItem
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
                    <Outlet />
                </div>
            </FitFullScreen>
        </>
    )
}

export default ToolsFramework
