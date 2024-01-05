import React from 'react'
import '@/assets/css/pages/tools-framework.scss'
import { tools } from '@/router/tools'
import FitFullscreen from '@/components/common/FitFullscreen'
import SidebarScroll, { SidebarScrollElement } from '@/components/common/sidebar_/SidebarScroll'
import Sidebar from 'src/components/common/sidebar_'
import SidebarItemList from '@/components/common/sidebar_/SidebarItemList'
import SidebarItem from '@/components/common/sidebar_/SidebarItem'
import SidebarSeparate from '@/components/common/sidebar_/SidebarSeparate'
import FullscreenLoadingMask from '@/components/common/FullscreenLoadingMask'

const ToolsFramework: React.FC = () => {
    const sidebarScrollRef = useRef<SidebarScrollElement>(null)

    const handleOnSidebarSwitch = () => {
        setTimeout(() => {
            sidebarScrollRef.current?.refreshLayout()
        }, 300)
    }

    return (
        <>
            <FitFullscreen data-component={'tools-framework'} className={'flex-horizontal'}>
                <div className={'left-panel'}>
                    <Sidebar title={'氧工具'} onSidebarSwitch={handleOnSidebarSwitch}>
                        <SidebarItemList>
                            <SidebarItem end path={''} icon={tools[0].icon} text={tools[0].name} />
                            <SidebarItem
                                end
                                path={'all'}
                                icon={tools[1].icon}
                                text={tools[1].name}
                            />
                        </SidebarItemList>
                        <SidebarSeparate style={{ marginBottom: 0 }} />
                        <SidebarScroll ref={sidebarScrollRef}>
                            <SidebarItemList>
                                {tools.map((tool) => {
                                    return tool.menu &&
                                        tool.id !== 'tools' &&
                                        tool.id !== 'tools-all' ? (
                                        <SidebarItem
                                            path={tool.absolutePath}
                                            icon={tool.icon}
                                            text={tool.name}
                                            key={tool.id}
                                        >
                                            {tool.children
                                                ? tool.children.map((subTool) => {
                                                      return (
                                                          <SidebarItem
                                                              path={subTool.absolutePath}
                                                              text={subTool.name}
                                                              key={subTool.id}
                                                          />
                                                      )
                                                  })
                                                : undefined}
                                        </SidebarItem>
                                    ) : undefined
                                })}
                            </SidebarItemList>
                        </SidebarScroll>
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
