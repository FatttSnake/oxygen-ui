import React from 'react'
import HideScrollbar, { HideScrollbarElement } from '@/components/common/HideScrollbar'

export interface SidebarScrollElement {
    refreshLayout(): void
}

const SidebarScroll = forwardRef<SidebarScrollElement, React.PropsWithChildren>((props, ref) => {
    useImperativeHandle<SidebarScrollElement, SidebarScrollElement>(ref, () => {
        return {
            refreshLayout() {
                hideScrollbarRef.current?.refreshLayout()
            }
        }
    })

    const hideScrollbarRef = useRef<HideScrollbarElement>(null)

    return (
        <div className={'scroll'}>
            <HideScrollbar
                isShowVerticalScrollbar={true}
                scrollbarWidth={2}
                autoHideWaitingTime={800}
                ref={hideScrollbarRef}
            >
                {props.children}
            </HideScrollbar>
        </div>
    )
})

export default SidebarScroll
