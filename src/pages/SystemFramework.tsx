import React from 'react'
import '@/assets/css/pages/system-framework.scss'
import { getSystemRouteJson } from '@/router/system'
import FitFullscreen from '@/components/common/FitFullscreen'
import Sidebar from '@/components/common/sidebar'
import SidebarItemList from '@/components/common/sidebar/SidebarItemList'
import SidebarItem from '@/components/common/sidebar/SidebarItem'
import FullscreenLoadingMask from '@/components/common/FullscreenLoadingMask'

const SystemFramework: React.FC = () => {
    return (
        <>
            <FitFullscreen className={'flex-horizontal'}>
                <div className={'left-panel'}>
                    <Sidebar title={'系统配置'}>
                        <SidebarItemList>
                            {getSystemRouteJson().map((value) => {
                                return value.menu ? (
                                    <SidebarItem
                                        end={value.id === 'system' ? true : undefined}
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

export default SystemFramework
