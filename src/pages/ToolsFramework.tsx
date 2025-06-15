import {
    DndContext,
    DragOverEvent,
    DragStartEvent,
    MouseSensor,
    TouchSensor,
    useSensor,
    useSensors
} from '@dnd-kit/core'
import { arrayMove, SortableContext } from '@dnd-kit/sortable'
import type { DragEndEvent } from '@dnd-kit/core/dist/types'
import useStyles from '@/assets/css/pages/tools-framework.style'
import { tools } from '@/router/tools'
import { getToolMenuItem, saveToolMenuItem } from '@/util/common'
import { checkIsSamePathname, getViewPath } from '@/util/navigation'
import FitFullscreen from '@/components/common/FitFullscreen'
import Sidebar from '@/components/common/Sidebar'
import FullscreenLoadingMask from '@/components/common/FullscreenLoadingMask'
import Sortable from '@/components/dnd/Sortable'
import DragHandle from '@/components/dnd/DragHandle'
import DraggableOverlay from '@/components/dnd/DraggableOverlay'
import DropMask from '@/components/dnd/DropMask'
import Droppable from '@/components/dnd/Droppable'

const ToolsFramework = () => {
    const { styles, cx } = useStyles()
    const location = useLocation()
    const navigate = useNavigate()
    const [deleteItem, setDeleteItem] = useState<string>()
    const [toolMenuItem, setToolMenuItem] = useState<ToolMenuItem[]>(getToolMenuItem)
    const [activeItem, setActiveItem] = useState<ToolMenuItem>()
    const [isShowDropMask, setIsShowDropMask] = useState(false)
    const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor))

    const handleOnDragStart = ({ active }: DragStartEvent) => {
        setActiveItem(active.data.current as ToolMenuItem)
        if (!active.data.current?.sortable) {
            setIsShowDropMask(true)
        }
    }

    const handleOnDragOver = ({ active, over }: DragOverEvent) => {
        setDeleteItem(over === null ? (active.id as string) : undefined)
    }

    const handleOnDragEnd = ({ active, over }: DragEndEvent) => {
        if (over && active.id !== over?.id) {
            const activeIndex = toolMenuItem.findIndex(
                ({ authorUsername, toolId, ver, platform }) =>
                    `${authorUsername}:${toolId}:${ver}:${platform}` === active.id
            )
            const overIndex = toolMenuItem.findIndex(
                ({ authorUsername, toolId, ver, platform }) =>
                    `${authorUsername}:${toolId}:${ver}:${platform}` === over.id
            )
            setToolMenuItem(arrayMove(toolMenuItem, activeIndex, overIndex))
        }

        if (!over) {
            setToolMenuItem(
                toolMenuItem.filter(
                    ({ authorUsername, toolId, ver, platform }) =>
                        `${authorUsername}:${toolId}:${ver}:${platform}` !== active?.id
                )
            )
        }

        if (!active.data.current?.sortable && over) {
            const newItem = active.data.current as ToolMenuItem
            if (
                toolMenuItem.findIndex(
                    ({ authorUsername, toolId, ver }) =>
                        authorUsername === newItem.authorUsername &&
                        toolId === newItem.toolId &&
                        ver === newItem.ver
                ) === -1
            ) {
                setToolMenuItem([...toolMenuItem, newItem])
            }
        }

        setActiveItem(undefined)
        setDeleteItem(undefined)
        setIsShowDropMask(false)
    }

    const handleOnDragCancel = () => {
        setActiveItem(undefined)
        setDeleteItem(undefined)
    }

    useEffect(() => {
        saveToolMenuItem(toolMenuItem)
    }, [toolMenuItem])

    return (
        <FitFullscreen className={cx(styles.root, 'flex-horizontal')}>
            <DndContext
                sensors={sensors}
                onDragStart={handleOnDragStart}
                onDragOver={handleOnDragOver}
                onDragEnd={handleOnDragEnd}
                onDragCancel={handleOnDragCancel}
            >
                <div className={styles.leftPanel}>
                    <Sidebar title={'氧工具'}>
                        <Sidebar.ItemList>
                            <Sidebar.Item
                                icon={tools[0].icon}
                                text={tools[0].name}
                                active={location.pathname === '/store'}
                                onClick={() => navigate('/store')}
                            />
                            <Sidebar.Item
                                icon={tools[1].icon}
                                text={tools[1].name}
                                active={location.pathname === '/repository'}
                                onClick={() => navigate('/repository')}
                            />
                        </Sidebar.ItemList>
                        <Sidebar.Separate />
                        <Droppable id={'menu'} className={styles.menuDroppable}>
                            <Sidebar.Scroll>
                                <Sidebar.ItemList>
                                    <SortableContext
                                        items={toolMenuItem.map(
                                            ({ authorUsername, toolId, ver, platform }) =>
                                                `${authorUsername}:${toolId}:${ver}:${platform}`
                                        )}
                                    >
                                        {toolMenuItem.map(
                                            ({
                                                icon,
                                                toolName,
                                                toolId,
                                                authorUsername,
                                                ver,
                                                platform
                                            }) => (
                                                <Sortable
                                                    key={`${authorUsername}:${toolId}:${ver}:${platform}`}
                                                    id={`${authorUsername}:${toolId}:${ver}:${platform}`}
                                                    data={{
                                                        icon,
                                                        toolName,
                                                        toolId,
                                                        authorUsername,
                                                        ver,
                                                        platform
                                                    }}
                                                    isOver={
                                                        deleteItem ===
                                                        `${authorUsername}:${toolId}:${ver}:${platform}`
                                                    }
                                                    hasDragHandle
                                                >
                                                    <Sidebar.Item
                                                        icon={icon}
                                                        text={toolName}
                                                        extend={<DragHandle padding={10} />}
                                                        active={checkIsSamePathname(
                                                            location.pathname,
                                                            getViewPath(
                                                                authorUsername,
                                                                toolId,
                                                                platform,
                                                                ver === 'local' ? '' : ver
                                                            )
                                                        )}
                                                        onClick={() =>
                                                            navigate(
                                                                getViewPath(
                                                                    authorUsername,
                                                                    toolId,
                                                                    platform,
                                                                    ver === 'local' ? '' : ver
                                                                )
                                                            )
                                                        }
                                                    />
                                                </Sortable>
                                            )
                                        )}
                                    </SortableContext>
                                    <DraggableOverlay>
                                        {activeItem && (
                                            <Sidebar.Item
                                                icon={activeItem.icon}
                                                text={activeItem.toolName}
                                                extend={<DragHandle padding={10} />}
                                            />
                                        )}
                                    </DraggableOverlay>
                                </Sidebar.ItemList>
                            </Sidebar.Scroll>
                            {isShowDropMask && <DropMask />}
                        </Droppable>
                    </Sidebar>
                </div>
                <div className={styles.rightPanel}>
                    <Suspense fallback={<FullscreenLoadingMask />}>
                        <Outlet />
                    </Suspense>
                </div>
            </DndContext>
        </FitFullscreen>
    )
}

export default ToolsFramework
