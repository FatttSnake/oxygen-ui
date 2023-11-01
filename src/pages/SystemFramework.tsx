import React from 'react'
import system from '@/router/system'
import '@/assets/css/pages/tools-framework.scss'
import FitFullScreen from '@/components/common/FitFullScreen'
import Sidebar from '@/components/common/sidebar'
import SidebarItemList from '@/components/common/sidebar/SidebarItemList'
import SidebarItem from '@/components/common/sidebar/SidebarItem'

const SystemFramework: React.FC = () => {
    return (
        <>
            <FitFullScreen className={'flex-horizontal'}>
                <div className={'left-panel'}>
                    <Sidebar title={'系统设置'}>
                        <SidebarItemList>
                            {system.map((value) => {
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

export default SystemFramework
