import React from 'react'
import Icon from '@ant-design/icons'
import '@/assets/css/components/common/sidebar.scss'
import { getLocalStorage, setLocalStorage } from '@/utils/common'
import SidebarSeparate from '@/components/common/sidebar/SidebarSeparate'
import SidebarFooter from '@/components/common/sidebar/SidebarFooter'

interface SidebarProps extends React.PropsWithChildren {
    title: string
    width?: string
    onSidebarSwitch?: (hidden: boolean) => void
    bottomFixed?: React.ReactNode
}

const Sidebar: React.FC<SidebarProps> = (props) => {
    const [hideSidebar, setHideSidebar] = useState(getLocalStorage('hideSidebar') === 'false')

    const switchSidebar = () => {
        setHideSidebar(!hideSidebar)
        setLocalStorage('hideSidebar', hideSidebar ? 'true' : 'false')
        props.onSidebarSwitch && props.onSidebarSwitch(hideSidebar)
    }

    return (
        <>
            <div
                className={`sidebar${hideSidebar ? ' hide' : ''}`}
                style={{ width: props.width ?? 'clamp(180px, 20vw, 240px)' }}
            >
                <div className={'title'}>
                    <span className={'icon-box'} onClick={switchSidebar}>
                        <Icon component={IconFatwebExpand} />
                    </span>
                    <span className={'text'}>{props.title}</span>
                </div>
                <SidebarSeparate style={{ marginTop: 0 }} />
                <div className={'content'}>{props.children}</div>
                <div className={'bottom-fixed'} style={{ flex: 'none' }}>
                    {props.bottomFixed}
                </div>
                <SidebarSeparate style={{ marginTop: 0, marginBottom: 0 }} />
                <SidebarFooter />
            </div>
        </>
    )
}

export default Sidebar
