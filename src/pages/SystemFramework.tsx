import React from 'react'
import '@/assets/css/pages/system-framework.scss'
import system from '@/router/system'
import FitFullScreen from '@/components/common/FitFullScreen'
import Sidebar from '@/components/common/sidebar'
import SidebarItemList from '@/components/common/sidebar/SidebarItemList'
import SidebarItem from '@/components/common/sidebar/SidebarItem'
import LoadingMask from '@/components/common/LoadingMask'

const SystemFramework: React.FC = () => {
    return (
        <>
            <FitFullScreen className={'flex-horizontal'}>
                <div className={'left-panel'}>
                    <Sidebar
                        title={'系统设置'}
                        bottomFixed={
                            <SidebarItemList>
                                <SidebarItem
                                    path={'/user'}
                                    icon={IconFatwebUser}
                                    text={'个人中心'}
                                />
                            </SidebarItemList>
                        }
                    >
                        <SidebarItemList>
                            {system.map((value) => {
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
                                <LoadingMask />
                            </>
                        }
                    >
                        <Outlet />
                    </Suspense>
                </div>
            </FitFullScreen>
        </>
    )
}

export default SystemFramework
