import React from 'react'
import '@/assets/css/pages/user-framework.scss'
import user from '@/router/user'
import { hasPathPermission } from '@/util/auth'
import FitFullscreen from '@/components/common/FitFullscreen'
import Sidebar from '@/components/common/Sidebar'
import FullscreenLoadingMask from '@/components/common/FullscreenLoadingMask'

const ToolsFramework: React.FC = () => {
    return (
        <>
            <FitFullscreen data-component={'user-framework'} className={'flex-horizontal'}>
                <div className={'left-panel'}>
                    <Sidebar
                        title={'个人中心'}
                        bottomFixed={
                            <Sidebar.ItemList>
                                {hasPathPermission('/system') && (
                                    <Sidebar.Item
                                        path={'/system'}
                                        icon={IconOxygenSetting}
                                        text={'系统配置'}
                                    />
                                )}
                                <Sidebar.Item
                                    path={'/'}
                                    icon={IconOxygenBack}
                                    text={'回到氧工具'}
                                />
                            </Sidebar.ItemList>
                        }
                    >
                        <Sidebar.ItemList>
                            {user.map((value) => {
                                return (
                                    value.menu && (
                                        <Sidebar.Item
                                            end={value.id === 'user' && true}
                                            path={value.absolutePath}
                                            icon={value.icon}
                                            text={value.name}
                                            key={value.id}
                                        />
                                    )
                                )
                            })}
                        </Sidebar.ItemList>
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
