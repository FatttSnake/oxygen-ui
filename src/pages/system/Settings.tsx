import React from 'react'
import Icon from '@ant-design/icons'
import '@/assets/css/pages/system/settings.scss'
import { useUpdatedEffect } from '@/util/hooks'
import {
    r_sys_settings_mail_get,
    r_sys_settings_mail_send,
    r_sys_settings_mail_update
} from '@/services/system'
import FitFullScreen from '@/components/common/FitFullScreen'
import HideScrollbar from '@/components/common/HideScrollbar'
import Card from '@/components/common/Card'
import FlexBox from '@/components/common/FlexBox'
import LoadingMask from '@/components/common/LoadingMask'
import Permission from '@/components/common/Permission.tsx'
import { hasPermission } from '@/util/auth.tsx'

interface SettingsCardProps extends React.PropsWithChildren {
    icon: IconComponent
    title: string
    loading?: boolean
    modifyOperationCode?: string
    expand?: React.ReactNode
    onReset?: () => void
    onSave?: () => void
}
const SettingsCard: React.FC<SettingsCardProps> = (props) => {
    return (
        <Card>
            <FlexBox className={'settings-card'}>
                <FlexBox direction={'horizontal'} className={'head'}>
                    <Icon component={props.icon} className={'icon'} />
                    <div className={'title'}>{props.title}</div>
                    {!props.loading ? (
                        <Permission operationCode={props.modifyOperationCode}>
                            {props.expand}
                            <AntdButton onClick={props.onReset} title={'重置'}>
                                <Icon component={IconFatwebBack} />
                            </AntdButton>
                            <AntdButton className={'bt-save'} onClick={props.onSave} title={'保存'}>
                                <Icon component={IconFatwebSave} />
                            </AntdButton>
                        </Permission>
                    ) : undefined}
                </FlexBox>
                <LoadingMask hidden={!props.loading}>{props.children}</LoadingMask>
            </FlexBox>
        </Card>
    )
}

const MailSettings: React.FC = () => {
    const [modal, contextHolder] = AntdModal.useModal()
    const [mailForm] = AntdForm.useForm<MailSettingsParam>()
    const mailFormValues = AntdForm.useWatch([], mailForm)
    const [loading, setLoading] = useState(false)
    const [mailSendForm] = AntdForm.useForm<MailSendParam>()

    const handleOnTest = () => {
        void modal.confirm({
            title: '发送测试邮件',
            content: (
                <>
                    <AntdForm form={mailSendForm}>
                        <AntdForm.Item
                            name={'to'}
                            label={'接收人'}
                            style={{ marginTop: 10 }}
                            rules={[{ required: true, type: 'email' }]}
                        >
                            <AntdInput />
                        </AntdForm.Item>
                    </AntdForm>
                    <AntdTag style={{ whiteSpace: 'normal' }}>
                        将使用服务器已保存的邮件设置进行发送邮件，请保证编辑的内容已保存
                    </AntdTag>
                </>
            ),
            onOk: () =>
                mailSendForm.validateFields().then(
                    () => {
                        return new Promise((resolve) => {
                            void r_sys_settings_mail_send({
                                to: mailSendForm.getFieldValue('to') as string
                            }).then((res) => {
                                const response = res.data

                                if (response.success) {
                                    void message.success('发送成功')
                                    resolve(true)
                                } else {
                                    void message.error('发送失败，请检查配置后重试')
                                    resolve(true)
                                }
                            })
                        })
                    },
                    () => {
                        return new Promise((_, reject) => {
                            reject('未输入接收者')
                        })
                    }
                )
        })
    }

    const handleOnReset = () => {
        getMailSettings()
    }

    const handleOnSave = () => {
        void r_sys_settings_mail_update(mailFormValues).then((res) => {
            const response = res.data
            if (response.success) {
                void message.success('保存设置成功')
                getMailSettings()
            } else {
                void message.error('保存设置失败，请稍后重试')
            }
        })
    }

    const getMailSettings = () => {
        if (loading) {
            return
        }

        setLoading(true)
        void r_sys_settings_mail_get().then((res) => {
            const response = res.data
            if (response.success) {
                const data = response.data
                data && mailForm.setFieldsValue(data)
                setLoading(false)
            }
        })
    }

    useUpdatedEffect(() => {
        getMailSettings()
    }, [])

    return (
        <>
            <SettingsCard
                icon={IconFatwebEmail}
                title={'邮件'}
                loading={loading}
                onReset={handleOnReset}
                onSave={handleOnSave}
                modifyOperationCode={'system:settings:modify:mail'}
                expand={
                    <AntdButton onClick={handleOnTest} title={'测试'}>
                        <Icon component={IconFatwebTest} />
                    </AntdButton>
                }
            >
                <AntdForm
                    form={mailForm}
                    labelCol={{ flex: '8em' }}
                    disabled={!hasPermission('system:settings:modify:mail')}
                >
                    <AntdForm.Item label={'SMTP 服务器'} name={'host'}>
                        <AntdInput />
                    </AntdForm.Item>
                    <AntdForm.Item label={'端口'} name={'port'}>
                        <AntdInputNumber min={0} max={65535} style={{ width: '100%' }} />
                    </AntdForm.Item>
                    <AntdForm.Item label={'安全类型'} name={'securityType'}>
                        <AntdSelect>
                            <AntdSelect.Option key={'None'}>None</AntdSelect.Option>
                            <AntdSelect.Option key={'SSL/TLS'}>SSL/TLS</AntdSelect.Option>
                            <AntdSelect.Option key={'StartTls'}>StartTls</AntdSelect.Option>
                        </AntdSelect>
                    </AntdForm.Item>
                    <AntdForm.Item label={'用户名'} name={'username'}>
                        <AntdInput />
                    </AntdForm.Item>
                    <AntdForm.Item label={'密码'} name={'password'}>
                        <AntdInput.Password />
                    </AntdForm.Item>
                    <AntdForm.Item label={'发送者'} name={'from'}>
                        <AntdInput />
                    </AntdForm.Item>
                    <AntdForm.Item label={'发送者名称'} name={'fromName'}>
                        <AntdInput />
                    </AntdForm.Item>
                </AntdForm>
            </SettingsCard>
            {contextHolder}
        </>
    )
}

const Settings: React.FC = () => {
    return (
        <>
            <FitFullScreen>
                <HideScrollbar isShowVerticalScrollbar autoHideWaitingTime={500}>
                    <FlexBox className={'root-content'}>
                        <Permission operationCode={'system:settings:query:mail'}>
                            <MailSettings />
                        </Permission>
                    </FlexBox>
                </HideScrollbar>
            </FitFullScreen>
        </>
    )
}

export default Settings
