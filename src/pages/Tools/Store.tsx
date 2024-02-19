import { DetailedHTMLProps, HTMLAttributes, MouseEvent, ReactNode } from 'react'
import VanillaTilt, { TiltOptions } from 'vanilla-tilt'
import Icon from '@ant-design/icons'
import '@/assets/css/pages/tools/store.scss'
import { COLOR_BACKGROUND, DATABASE_SELECT_SUCCESS } from '@/constants/common.constants'
import { r_tool_store_get } from '@/services/tool'
import Card from '@/components/common/Card'
import FlexBox from '@/components/common/FlexBox'
import FitFullscreen from '@/components/common/FitFullscreen'
import HideScrollbar from '@/components/common/HideScrollbar'

interface CommonCardProps
    extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    icon: ReactNode
    toolName: string
    toolId: string
    toolDesc: string
    options?: TiltOptions
    url: string
    authorName: string
    authorAvatar: string
    authorUsername: string
    ver: string
}

const CommonCard = ({
    style,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ref,
    icon,
    toolName,
    toolId,
    toolDesc,
    options = {
        reverse: true,
        max: 8,
        glare: true,
        ['max-glare']: 0.3,
        scale: 1.03
    },
    url,
    authorName,
    authorAvatar,
    authorUsername,
    ver,
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

    const handleOnSourceBtnClick = (e: MouseEvent<HTMLDivElement>) => {
        e.stopPropagation()
        navigate(`/source/${authorUsername}/${toolId}`)
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
                <div className={'version'}>
                    <AntdTag>V{ver}</AntdTag>
                </div>
                <div className={'info'}>
                    <div className={'tool-name'}>{toolName}</div>
                    <div className={'tool-id'}>{`ID: ${toolId}`}</div>
                    {toolDesc && <div className={'tool-desc'}>{`简介：${toolDesc}`}</div>}
                </div>
                <div className={'author'}>
                    <div className={'avatar'}>
                        <AntdAvatar
                            src={
                                <AntdImage
                                    preview={{ mask: <Icon component={IconOxygenEye}></Icon> }}
                                    src={`data:image/png;base64,${authorAvatar}`}
                                    alt={'Avatar'}
                                />
                            }
                            style={{ background: COLOR_BACKGROUND }}
                        />
                    </div>
                    <AntdTooltip title={authorUsername}>
                        <div className={'author-name'}>{authorName}</div>
                    </AntdTooltip>
                </div>
                <div className={'operation'}>
                    <AntdTooltip title={'源码'}>
                        <Icon component={IconOxygenCode} onClick={handleOnSourceBtnClick} />
                    </AntdTooltip>
                </div>
            </FlexBox>
        </Card>
    )
}

interface LoadMoreCardProps {
    onClick: () => void
}

const LoadMoreCard = ({ onClick }: LoadMoreCardProps) => {
    const cardRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        cardRef.current &&
            VanillaTilt.init(cardRef.current, {
                reverse: true,
                max: 8,
                glare: true,
                ['max-glare']: 0.3,
                scale: 1.03
            })
    }, [])

    return (
        <Card style={{ overflow: 'visible' }} ref={cardRef} onClick={onClick}>
            <FlexBox className={'load-more-card'}>
                <div className={'icon'}>
                    <Icon component={IconOxygenMore} />{' '}
                </div>
                <div className={'text'}>加载更多</div>
            </FlexBox>
        </Card>
    )
}

const Store = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [currentPage, setCurrentPage] = useState(0)
    const [hasNextPage, setHasNextPage] = useState(true)
    const [toolData, setToolData] = useState<ToolVo[]>([])

    const handleOnSearch = (value: string) => {
        getTool(1, value)
    }

    const handleOnLoadMore = () => {
        if (isLoading) {
            return
        }
        getTool(currentPage + 1, '')
    }

    const getTool = (page: number, searchValue: string) => {
        if (isLoading) {
            return
        }
        setIsLoading(true)
        void message.loading({ content: '加载工具列表中', key: 'LOADING', duration: 0 })

        void r_tool_store_get({ currentPage: page, searchValue })
            .then((res) => {
                const response = res.data

                switch (response.code) {
                    case DATABASE_SELECT_SUCCESS:
                        setCurrentPage(response.data!.current)
                        if (response.data!.current === response.data!.pages) {
                            setHasNextPage(false)
                        }
                        if (response.data!.current === 1) {
                            setToolData(response.data!.records)
                        } else {
                            setToolData([...toolData, ...response.data!.records])
                        }
                        break
                    default:
                        void message.error('加载失败，请稍后重试')
                }
            })
            .finally(() => {
                setIsLoading(false)
                message.destroy('LOADING')
            })
    }

    useEffect(() => {
        getTool(1, '')
    }, [])

    return (
        <>
            <FitFullscreen data-component={'tools-store'}>
                <HideScrollbar isShowVerticalScrollbar autoHideWaitingTime={1000}>
                    <div className={'search'}>
                        <AntdInput.Search
                            placeholder={'请输入工具名或关键字'}
                            enterButton
                            loading={isLoading}
                            onSearch={handleOnSearch}
                        />
                    </div>
                    <FlexBox direction={'horizontal'} className={'root-content'}>
                        {toolData?.map((value) => (
                            <CommonCard
                                icon={
                                    <img
                                        src={`data:image/svg+xml;base64,${value.icon}`}
                                        alt={'Icon'}
                                    />
                                }
                                toolName={value.name}
                                toolId={value.toolId}
                                toolDesc={value.description}
                                url={`/view/${value.author.username}/${value.toolId}`}
                                authorName={value.author.userInfo.nickname}
                                authorAvatar={value.author.userInfo.avatar}
                                authorUsername={value.author.username}
                                ver={value.ver}
                            />
                        ))}
                        {hasNextPage && <LoadMoreCard onClick={handleOnLoadMore} />}
                    </FlexBox>
                </HideScrollbar>
            </FitFullscreen>
        </>
    )
}

export default Store
