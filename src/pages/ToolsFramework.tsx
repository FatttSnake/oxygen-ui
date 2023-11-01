import React from 'react'
import { tools } from '@/router/tools'
import '@/assets/css/pages/tools-framework.scss'
import FitFullScreen from '@/components/common/FitFullScreen'
import SidebarScroll, { SidebarScrollElement } from '@/components/common/sidebar/SidebarScroll'
import Sidebar from '@/components/common/sidebar'
import SidebarItemList from '@/components/common/sidebar/SidebarItemList'
import SidebarItem from '@/components/common/sidebar/SidebarItem'
import SidebarSeparate from '@/components/common/sidebar/SidebarSeparate'

const ToolsFramework: React.FC = () => {
    const sidebarScrollRef = useRef<SidebarScrollElement>(null)

    const handleOnSidebarSwitch = () => {
        setTimeout(() => {
            sidebarScrollRef.current?.refreshLayout()
        }, 300)
    }

    return (
        <>
            <FitFullScreen className={'flex-horizontal'}>
                <div className={'left-panel'}>
                    <Sidebar title={'氮工具'} onSidebarSwitch={handleOnSidebarSwitch}>
                        <SidebarItemList>
                            <SidebarItem
                                end
                                path={''}
                                icon={tools[0].icon}
                                text={tools[0].name}
                            ></SidebarItem>
                            <SidebarItem
                                end
                                path={'all'}
                                icon={tools[1].icon}
                                text={tools[1].name}
                            ></SidebarItem>
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
                    <Outlet />
                </div>
            </FitFullScreen>
        </>
    )
}

export default ToolsFramework
