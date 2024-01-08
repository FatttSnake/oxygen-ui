import React from 'react'
import '@/assets/css/pages/system-framework.scss'
import { getSystemRouteJson } from '@/router/system'
import FitFullscreen from '@/components/common/FitFullscreen'
import Sidebar from '@/components/common/Sidebar'
import FullscreenLoadingMask from '@/components/common/FullscreenLoadingMask'

const SystemFramework: React.FC = () => {
    return (
        <>
            <FitFullscreen data-component={'system-framework'} className={'flex-horizontal'}>
                <div className={'left-panel'}>
                    <Sidebar title={'系统配置'}>
                        <Sidebar.ItemList>
                            {getSystemRouteJson().map((value) => {
                                return (
                                    value.menu && (
                                        <Sidebar.Item
                                            end={value.id === 'system' ? true : undefined}
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

export default SystemFramework
