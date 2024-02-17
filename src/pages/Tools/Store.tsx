import { DetailedHTMLProps, HTMLAttributes, ReactNode, useEffect, useState } from 'react'
import VanillaTilt, { TiltOptions } from 'vanilla-tilt'
import Card from '@/components/common/Card.tsx'
import FlexBox from '@/components/common/FlexBox.tsx'
import Icon from '@ant-design/icons'
import { COLOR_BACKGROUND, DATABASE_SELECT_SUCCESS } from '@/constants/common.constants.ts'
import FitFullscreen from '@/components/common/FitFullscreen.tsx'
import HideScrollbar from '@/components/common/HideScrollbar.tsx'
import { r_tool_store_get } from '@/services/tool.tsx'

interface CommonCardProps
    extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    icon: ReactNode
    toolName: string
    toolId: string
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

    return (
        <Card
            style={{ overflow: 'visible', ...style }}
            ref={cardRef}
            {...props}
            onClick={handleCardOnClick}
        >
            <FlexBox className={'common-card'}>
                <div className={'icon'}>{icon}</div>
                <div className={'version'}>{ver}</div>
                <div className={'info'}>
                    <div className={'tool-name'}>{toolName}</div>
                    <div className={'tool-id'}>{`ID: ${toolId}`}</div>
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
            </FlexBox>
        </Card>
    )
}

const Store = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [hasNextPage, setHasNextPage] = useState(true)
    const [toolData, setToolData] = useState<ToolVo[]>()

    const getTool = () => {
        if (isLoading) {
            return
        }
        setIsLoading(true)
        void message.loading({ content: '加载工具列表中', key: 'LOADING', duration: 0 })

        void r_tool_store_get({ currentPage })
            .then((res) => {
                const response = res.data

                switch (response.code) {
                    case DATABASE_SELECT_SUCCESS:
                        setToolData(response.data?.records)
                }
            })
            .finally(() => {
                setIsLoading(false)
                message.destroy('LOADING')
            })
    }

    useEffect(() => {
        getTool()
    }, [])

    return (
        <>
            <FitFullscreen data-component={'store'}>
                <HideScrollbar isShowVerticalScrollbar autoHideWaitingTime={1000}>
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
                                url={''}
                                authorName={value.author.userInfo.nickname}
                                authorAvatar={value.author.userInfo.avatar}
                                authorUsername={value.author.username}
                                ver={value.ver}
                            />
                        ))}
                    </FlexBox>
                </HideScrollbar>
            </FitFullscreen>
        </>
    )
}

export default Store
