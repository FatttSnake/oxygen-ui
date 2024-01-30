import { DetailedHTMLProps, HTMLAttributes, ReactNode, useState } from 'react'
import Icon from '@ant-design/icons'
import VanillaTilt, { TiltOptions } from 'vanilla-tilt'
import '@/assets/css/pages/tools/index.scss'
import FitFullscreen from '@/components/common/FitFullscreen'
import HideScrollbar from '@/components/common/HideScrollbar'
import FlexBox from '@/components/common/FlexBox'
import Card from '@/components/common/Card'
import { r_tool_get } from '@/services/tool.tsx'
import { DATABASE_SELECT_SUCCESS } from '@/constants/common.constants.ts'
import { getLoginStatus } from '@/util/auth.tsx'
import { useNavigate } from 'react-router'

interface CommonCardProps
    extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    icon: ReactNode
    toolName?: string
    toolId?: string
    options?: TiltOptions
    url?: string
    onOpen?: () => void
    onEdit?: () => void
    onPublish?: () => void
    onDelete?: () => void
}

const CommonCard = ({
    style,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ref,
    icon,
    toolName,
    toolId,
    options = {
        reverse: true,
        max: 8,
        glare: true,
        ['max-glare']: 0.3,
        scale: 1.03
    },
    url,
    onOpen,
    onEdit,
    onPublish,
    onDelete,
    children,
    ...props
}: CommonCardProps) => {
    const navigate = useNavigate()
    const cardRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        cardRef.current && VanillaTilt.init(cardRef.current, options)
    }, [options])

    const handleCardOnClick = () => {
        url && navigate(url)
    }

    return (
        <Card
            style={{ overflow: 'visible', ...style }}
            ref={cardRef}
            {...props}
            onClick={handleCardOnClick}
        >
            <FlexBox className={'common-card'}>
                <div className={'icon'}>{icon}</div>
                <div className={'info'}>
                    {toolName && <div className={'tool-name'}>{toolName}</div>}
                    {toolId && <div className={'tool-id'}>{`ID: ${toolId}`}</div>}
                </div>
                <div className={'operation'}>
                    {onOpen && (
                        <AntdButton onClick={onOpen} size={'small'} type={'primary'}>
                            打开
                        </AntdButton>
                    )}
                    {onEdit && (
                        <div className={'edit'}>
                            <AntdButton.Group size={'small'}>
                                <AntdButton>编辑</AntdButton>
                                {onPublish && <AntdButton>发布</AntdButton>}
                            </AntdButton.Group>
                        </div>
                    )}
                    {onDelete && (
                        <AntdButton size={'small'} danger>
                            删除
                        </AntdButton>
                    )}
                </div>
                {children}
            </FlexBox>
        </Card>
    )
}

interface ToolCardProps {
    tools: ToolVo[]
}

const ToolCard = ({ tools }: ToolCardProps) => {
    const navigate = useNavigate()
    const [selectedTool, setSelectedTool] = useState(tools[0])

    const handleOnVersionChange = (value: string) => {
        setSelectedTool(tools.find((item) => item.id === value)!)
    }

    const handleOnOpenTool = () => {
        navigate(`/view/!/${selectedTool.toolId}/${selectedTool.ver}`)
    }

    const handleOnEditTool = () => {}

    const handleOnPublishTool = () => {}

    const handleOnDeleteTool = () => {}

    return (
        <CommonCard
            icon={<img src={`data:image/svg+xml;base64,${selectedTool.icon}`} alt={'Icon'} />}
            toolName={selectedTool.name}
            toolId={selectedTool.toolId}
            onOpen={handleOnOpenTool}
            onEdit={handleOnEditTool}
            onPublish={handleOnPublishTool}
            onDelete={handleOnDeleteTool}
        >
            <AntdSelect
                className={'version-select'}
                size={'small'}
                value={selectedTool.id}
                onChange={handleOnVersionChange}
                options={tools.map((value) => ({
                    value: value.id,
                    label: `${value.ver}${value.publish === '0' ? '*' : ''}`
                }))}
            />
        </CommonCard>
    )
}

const Tools = () => {
    const [loading, setLoading] = useState(false)
    const [toolData, setToolData] = useState<ToolVo[]>()

    const getTool = () => {
        if (loading) {
            return
        }
        setLoading(true)
        void message.loading({ content: '加载工具列表中', key: 'LOADING', duration: 0 })

        void r_tool_get()
            .then((res) => {
                const response = res.data

                switch (response.code) {
                    case DATABASE_SELECT_SUCCESS:
                        setToolData(response.data!)
                        break
                    default:
                        void message.error('获取工具失败，请稍后重试')
                }
            })
            .finally(() => {
                setLoading(false)
                message.destroy('LOADING')
            })
    }

    useEffect(() => {
        if (!getLoginStatus()) {
            return
        }
        getTool()
    }, [])

    return (
        <>
            <FitFullscreen data-component={'tools'}>
                <HideScrollbar isShowVerticalScrollbar autoHideWaitingTime={1000}>
                    <FlexBox direction={'horizontal'} className={'root-content'}>
                        <CommonCard
                            icon={<Icon component={IconOxygenNewProject} />}
                            toolName={'创建工具'}
                            url={'/create'}
                        />
                        {toolData &&
                            Object.values(
                                toolData.reduce((result: Record<string, ToolVo[]>, item) => {
                                    result[item.toolId] = result[item.toolId] || []
                                    result[item.toolId].push(item)
                                    return result
                                }, {})
                            ).map((value, index) => <ToolCard key={index} tools={value} />)}
                    </FlexBox>
                </HideScrollbar>
            </FitFullscreen>
        </>
    )
}

export default Tools
