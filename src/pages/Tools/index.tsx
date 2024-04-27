import { DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react'
import Icon from '@ant-design/icons'
import VanillaTilt, { TiltOptions } from 'vanilla-tilt'
import '@/assets/css/pages/tools/index.scss'
import {
    DATABASE_DELETE_SUCCESS,
    DATABASE_SELECT_SUCCESS,
    DATABASE_UPDATE_SUCCESS,
    TOOL_CANCEL_SUCCESS,
    TOOL_HAS_BEEN_PUBLISHED,
    TOOL_HAS_UNPUBLISHED_VERSION,
    TOOL_ILLEGAL_VERSION,
    TOOL_NOT_UNDER_REVIEW,
    TOOL_SUBMIT_SUCCESS,
    TOOL_UNDER_REVIEW
} from '@/constants/common.constants'
import { checkDesktop } from '@/util/common'
import { getLoginStatus } from '@/util/auth'
import { navigateToEdit, navigateToSource, navigateToView } from '@/util/navigation'
import {
    r_tool_cancel,
    r_tool_delete,
    r_tool_get,
    r_tool_submit,
    r_tool_upgrade
} from '@/services/tool'
import FitFullscreen from '@/components/common/FitFullscreen'
import HideScrollbar from '@/components/common/HideScrollbar'
import FlexBox from '@/components/common/FlexBox'
import Card from '@/components/common/Card'

interface CommonCardProps
    extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    icon: ReactNode
    toolName?: string
    toolId?: string
    options?: TiltOptions
    url?: string
    onOpen?: () => void
    onEdit?: () => void
    onSource?: () => void
    onPublish?: () => void
    onCancelReview?: () => void
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
    onSource,
    onPublish,
    onCancelReview,
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
                    {onEdit && onPublish && (
                        <div className={'edit'}>
                            <AntdButton.Group size={'small'}>
                                <AntdButton onClick={onEdit}>编辑</AntdButton>
                                <AntdButton onClick={onPublish}>发布</AntdButton>
                            </AntdButton.Group>
                        </div>
                    )}
                    {onSource && (
                        <AntdButton size={'small'} onClick={onSource}>
                            源码
                        </AntdButton>
                    )}
                    {onCancelReview && (
                        <AntdButton size={'small'} onClick={onCancelReview}>
                            取消审核
                        </AntdButton>
                    )}
                    {onDelete && (
                        <AntdButton size={'small'} danger onClick={onDelete}>
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
    onDelete?: (tool: ToolVo) => void
    onUpgrade?: (tool: ToolVo) => void
    onSubmit?: (tool: ToolVo) => void
    onCancel?: (tool: ToolVo) => void
}

const ToolCard = ({ tools, onDelete, onUpgrade, onSubmit, onCancel }: ToolCardProps) => {
    const navigate = useNavigate()
    const [selectedTool, setSelectedTool] = useState(tools[0])

    const handleOnVersionChange = (value: (string | number)[]) => {
        setSelectedTool(tools.find((item) => item.id === value[1])!)
    }

    const handleOnOpenTool = () => {
        if (checkDesktop() || selectedTool.platform !== 'DESKTOP') {
            navigateToView(
                navigate,
                '!',
                selectedTool.toolId,
                selectedTool.platform,
                selectedTool.ver
            )
        } else {
            void message.warning('此应用需要桌面端环境，请在桌面端打开')
        }
    }

    const handleOnEditTool = () => {
        if (['NONE', 'REJECT'].includes(selectedTool.review)) {
            return () => {
                if (checkDesktop() || selectedTool.platform !== 'DESKTOP') {
                    navigateToEdit(navigate, selectedTool.toolId, selectedTool.platform)
                } else {
                    void message.warning('此应用需要桌面端环境，请在桌面端编辑')
                }
            }
        }
        return undefined
    }

    const handleOnSourceTool = () => {
        if (selectedTool.review === 'PASS') {
            return () => {
                navigateToSource(
                    navigate,
                    '!',
                    selectedTool.toolId,
                    selectedTool.platform,
                    selectedTool.ver
                )
            }
        }
        return undefined
    }

    const handleOnPublishTool = () => {
        if (['NONE', 'REJECT'].includes(selectedTool.review)) {
            return () => {
                onSubmit?.(selectedTool)
            }
        }
        return undefined
    }

    const handleOnCancelReview = () => {
        if (selectedTool.review === 'PROCESSING') {
            return () => {
                onCancel?.(selectedTool)
            }
        }
        return undefined
    }

    const handleOnDeleteTool = () => {
        onDelete?.(selectedTool)
    }

    const handleOnUpgradeTool = () => {
        onUpgrade?.(selectedTool)
    }

    const toolsGroupByPlatform = (tools: ToolVo[]) => {
        interface Node {
            label: string
            value: string
            children?: Node[]
        }
        const temp: Node[] = []
        tools.forEach((value) => {
            if (!temp.length) {
                temp.push({
                    label: `${value.platform.slice(0, 1)}${value.platform.slice(1).toLowerCase()}`,
                    value: value.platform,
                    children: [
                        {
                            label: `${value.ver}${value.review !== 'PASS' ? '*' : ''}`,
                            value: value.id
                        }
                    ]
                })
            } else {
                if (
                    !temp.some((platform, platformIndex) => {
                        if (platform.value === value.platform) {
                            temp[platformIndex].children!.push({
                                label: `${value.ver}${value.review !== 'PASS' ? '*' : ''}`,
                                value: value.id
                            })
                            return true
                        }
                        return false
                    })
                ) {
                    temp.push({
                        label: `${value.platform.slice(0, 1)}${value.platform.slice(1).toLowerCase()}`,
                        value: value.platform,
                        children: [
                            {
                                label: `${value.ver}${value.review !== 'PASS' ? '*' : ''}`,
                                value: value.id
                            }
                        ]
                    })
                }
            }
        })

        return temp
    }

    return (
        <CommonCard
            icon={<img src={`data:image/svg+xml;base64,${selectedTool.icon}`} alt={'Icon'} />}
            toolName={selectedTool.name}
            toolId={selectedTool.toolId}
            onOpen={handleOnOpenTool}
            onEdit={handleOnEditTool()}
            onSource={handleOnSourceTool()}
            onPublish={handleOnPublishTool()}
            onCancelReview={handleOnCancelReview()}
            onDelete={handleOnDeleteTool}
        >
            <AntdCascader
                className={'version-select'}
                size={'small'}
                allowClear={false}
                value={[
                    tools.find((value) => value.id === selectedTool.id)!.platform,
                    selectedTool.id
                ]}
                displayRender={(label: string[]) => `${label[0].slice(0, 1)}-${label[1]}`}
                onChange={handleOnVersionChange}
                options={toolsGroupByPlatform(tools)}
            />
            {tools
                .filter((value) => value.platform === selectedTool.platform)
                .every((value) => value.review === 'PASS') && (
                <AntdTooltip title={'更新'}>
                    <Icon
                        component={IconOxygenUpgrade}
                        className={'upgrade-bt'}
                        onClick={handleOnUpgradeTool}
                    />
                </AntdTooltip>
            )}
        </CommonCard>
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

const Tools = () => {
    const navigate = useNavigate()
    const [modal, contextHolder] = AntdModal.useModal()
    const [loading, setLoading] = useState(false)
    const [currentPage, setCurrentPage] = useState(0)
    const [hasNextPage, setHasNextPage] = useState(false)
    const [toolData, setToolData] = useState<ToolVo[]>([])
    const [upgradeForm] = AntdForm.useForm<ToolUpgradeParam>()

    const handleOnDeleteTool = (tool: ToolVo) => {
        modal
            .confirm({
                title: '删除',
                maskClosable: true,
                content: `确定删除工具 ${tool.toolId}:${tool.platform.slice(0, 1)}${tool.platform.slice(1).toLowerCase()}:${tool.ver} 吗？`
            })
            .then(
                (confirmed) => {
                    if (confirmed) {
                        setLoading(true)

                        void r_tool_delete(tool.id)
                            .then((res) => {
                                const response = res.data
                                if (response.code === DATABASE_DELETE_SUCCESS) {
                                    void message.success('删除成功')
                                    getTool(1)
                                } else {
                                    void message.error('删除失败，请稍后重试')
                                }
                            })
                            .finally(() => {
                                setLoading(false)
                            })
                    }
                },
                () => {}
            )
    }

    const handleOnUpgradeTool = (tool: ToolVo) => {
        void modal.confirm({
            title: '更新工具',
            centered: true,
            maskClosable: true,
            footer: (_, { OkBtn, CancelBtn }) => (
                <>
                    <OkBtn />
                    <CancelBtn />
                </>
            ),
            content: (
                <>
                    <AntdForm
                        form={upgradeForm}
                        ref={(ref) => {
                            setTimeout(() => {
                                // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
                                ref?.getFieldInstance('toolId').focus()
                            }, 50)
                        }}
                        labelCol={{ span: 4 }}
                    >
                        <AntdForm.Item
                            initialValue={tool.toolId}
                            name={'toolId'}
                            label={'工具 ID'}
                            style={{ marginTop: 10 }}
                        >
                            <AntdInput disabled />
                        </AntdForm.Item>
                        <AntdForm.Item
                            initialValue={tool.platform}
                            label={'平台'}
                            name={'platform'}
                        >
                            <AntdSelect disabled>
                                <AntdSelect.Option key={'WEB'}>Web</AntdSelect.Option>
                                <AntdSelect.Option key={'DESKTOP'}>Desktop</AntdSelect.Option>
                                <AntdSelect.Option key={'ANDROID'}>Android</AntdSelect.Option>
                            </AntdSelect>
                        </AntdForm.Item>
                        <AntdForm.Item
                            name={'ver'}
                            label={'版本'}
                            rules={[
                                { required: true, whitespace: true },
                                {
                                    pattern: /^\d+\.\d+\.\d+$/,
                                    message: `格式必须为 '<数字>.<数字>.<数字>', eg. 1.0.3`
                                }
                            ]}
                        >
                            <AntdInput maxLength={10} showCount placeholder={'请输入版本'} />
                        </AntdForm.Item>
                    </AntdForm>
                </>
            ),
            onOk: () =>
                upgradeForm.validateFields().then(
                    () => {
                        return new Promise<void>((resolve, reject) => {
                            void r_tool_upgrade({
                                toolId: tool.toolId,
                                ver: upgradeForm.getFieldValue('ver') as string,
                                platform: tool.platform
                            }).then((res) => {
                                const response = res.data
                                switch (response.code) {
                                    case DATABASE_UPDATE_SUCCESS:
                                        void message.success('创建新版本成功')
                                        if (
                                            checkDesktop() ||
                                            response.data!.platform !== 'DESKTOP'
                                        ) {
                                            navigateToEdit(
                                                navigate,
                                                response.data!.toolId,
                                                response.data!.platform
                                            )
                                        }
                                        resolve()
                                        break
                                    case TOOL_ILLEGAL_VERSION:
                                        void message.error('版本有误，请重新输入')
                                        reject()
                                        break
                                    case TOOL_UNDER_REVIEW:
                                        void message.error('更新失败：工具审核中')
                                        resolve()
                                        break
                                    case TOOL_HAS_UNPUBLISHED_VERSION:
                                        void message.error('更新失败：存在未发布版本')
                                        resolve()
                                        break
                                    default:
                                        void message.error('更新失败，请稍后重试')
                                        reject()
                                }
                            })
                        })
                    },
                    () => {
                        return new Promise((_, reject) => {
                            reject('未输入版本')
                        })
                    }
                )
        })
    }

    const handleOnSubmitTool = (tool: ToolVo) => {
        modal
            .confirm({
                title: '提交审核',
                maskClosable: true,
                content: `确定提交审核工具 ${tool.name}:${tool.ver} 吗？`
            })
            .then(
                (confirmed) => {
                    if (confirmed) {
                        setLoading(true)

                        void r_tool_submit(tool.id)
                            .then((res) => {
                                const response = res.data
                                switch (response.code) {
                                    case TOOL_SUBMIT_SUCCESS:
                                        void message.success('提交审核成功')
                                        getTool(1)
                                        break
                                    case TOOL_UNDER_REVIEW:
                                        void message.warning('工具审核中，请勿重复提交')
                                        break
                                    case TOOL_HAS_BEEN_PUBLISHED:
                                        void message.warning('工具已发布，请创建新版本')
                                        break
                                    default:
                                        void message.error('提交审核失败，请稍后重试')
                                }
                            })
                            .finally(() => {
                                setLoading(false)
                            })
                    }
                },
                () => {}
            )
    }

    const handleOnCancelTool = (tool: ToolVo) => {
        modal
            .confirm({
                title: '取消审核',
                maskClosable: true,
                content: `确定取消审核工具 ${tool.name}:${tool.ver} 吗？`
            })
            .then(
                (confirmed) => {
                    if (confirmed) {
                        setLoading(true)

                        void r_tool_cancel(tool.id)
                            .then((res) => {
                                const response = res.data
                                switch (response.code) {
                                    case TOOL_CANCEL_SUCCESS:
                                        void message.success('取消审核成功')
                                        break
                                    case TOOL_NOT_UNDER_REVIEW:
                                        void message.warning('工具非审核状态')
                                        break
                                    case TOOL_HAS_BEEN_PUBLISHED:
                                        void message.warning('工具已发布，请创建新版本')
                                        break
                                    default:
                                        void message.error('取消审核失败，请稍后重试')
                                }
                            })
                            .finally(() => {
                                setLoading(false)
                                getTool(1)
                            })
                    }
                },
                () => {}
            )
    }

    const handleOnLoadMore = () => {
        if (loading) {
            return
        }
        getTool(currentPage + 1)
    }

    const getTool = (page: number) => {
        if (loading) {
            return
        }
        setLoading(true)
        void message.loading({ content: '加载工具列表中', key: 'LOADING', duration: 0 })

        void r_tool_get({ currentPage: page })
            .then((res) => {
                const response = res.data

                switch (response.code) {
                    case DATABASE_SELECT_SUCCESS:
                        setCurrentPage(response.data!.current)
                        if (
                            response.data!.current === response.data!.pages ||
                            response.data!.total === 0
                        ) {
                            setHasNextPage(false)
                        } else {
                            setHasNextPage(true)
                        }
                        if (response.data!.current === 1) {
                            setToolData(response.data!.records)
                        } else {
                            setToolData([...toolData, ...response.data!.records])
                        }
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
        getTool(1)
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
                            ).map((value) => (
                                <ToolCard
                                    key={JSON.stringify(value)}
                                    tools={value}
                                    onDelete={handleOnDeleteTool}
                                    onUpgrade={handleOnUpgradeTool}
                                    onSubmit={handleOnSubmitTool}
                                    onCancel={handleOnCancelTool}
                                />
                            ))}
                        {hasNextPage && <LoadMoreCard onClick={handleOnLoadMore} />}
                    </FlexBox>
                </HideScrollbar>
            </FitFullscreen>
            {contextHolder}
        </>
    )
}

export default Tools
