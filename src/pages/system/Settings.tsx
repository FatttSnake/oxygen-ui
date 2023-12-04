import React from 'react'
import Icon from '@ant-design/icons'
import '@/assets/css/pages/system/settings.scss'
import FitFullScreen from '@/components/common/FitFullScreen'
import HideScrollbar from '@/components/common/HideScrollbar'
import Card from '@/components/common/Card'
import FlexBox from '@/components/common/FlexBox'
import { useUpdatedEffect } from '@/util/hooks.tsx'
import { r_sys_settings_get, r_sys_settings_mail_update } from '@/services/system.tsx'

interface SettingsCardProps extends React.PropsWithChildren {
    icon: IconComponent
    title: string
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
                    <AntdButton className={'bt bt-reset'} onClick={props.onReset}>
                        <Icon component={IconFatwebBack} />
                    </AntdButton>
                    <AntdButton className={'bt bt-save'} onClick={props.onSave}>
                        <Icon component={IconFatwebSave} />
                    </AntdButton>
                </FlexBox>
                {props.children}
            </FlexBox>
        </Card>
    )
}

const MailSettings: React.FC<{ mail?: MailSettingsVo; onSave?: () => void }> = (props) => {
    const [mailForm] = AntdForm.useForm<MailSettingsParam>()
    const mailFormValues = AntdForm.useWatch([], mailForm)

    const handleOnReset = () => {
        props.mail && mailForm.setFieldsValue(props.mail)
    }

    const handleOnSave = () => {
        void r_sys_settings_mail_update(mailFormValues).then((res) => {
            const response = res.data
            if (response.success) {
                void message.success('保存设置成功')
                props.onSave && props.onSave()
            } else {
                void message.error('保存设置失败，请稍后重试')
            }
        })
    }

    useUpdatedEffect(() => {
        props.mail && mailForm.setFieldsValue(props.mail)
    }, [props.mail])

    return (
        <SettingsCard
            icon={IconFatwebEmail}
            title={'邮件'}
            onReset={handleOnReset}
            onSave={handleOnSave}
        >
            <AntdForm form={mailForm} labelCol={{ flex: '8em' }}>
                <AntdForm.Item label={'SMTP 服务器'} name={'host'}>
                    <AntdInput />
                </AntdForm.Item>
                <AntdForm.Item label={'端口'} name={'port'}>
                    <AntdInputNumber min={0} max={65535} style={{ width: '100%' }} />
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
            </AntdForm>
        </SettingsCard>
    )
}

const Settings: React.FC = () => {
    const [systemSetting, setSystemSetting] = useState<SystemSettingVo>()

    const getSystemSetting = () => {
        void r_sys_settings_get().then((res) => {
            const response = res.data
            if (response.success) {
                const data = response.data
                data && setSystemSetting(data)
            }
        })
    }

    const handleOnSave = () => {
        getSystemSetting()
    }

    useUpdatedEffect(() => {
        getSystemSetting()
    }, [])

    return (
        <>
            <FitFullScreen>
                <HideScrollbar isShowVerticalScrollbar autoHideWaitingTime={500}>
                    <FlexBox className={'root-content'}>
                        <MailSettings mail={systemSetting?.mail} onSave={handleOnSave} />
                    </FlexBox>
                </HideScrollbar>
            </FitFullScreen>
        </>
    )
}

export default Settings
