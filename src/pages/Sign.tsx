import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import Icon from '@ant-design/icons'
import '@/assets/css/pages/sign.scss'
import {
    COLOR_BACKGROUND,
    DATABASE_DUPLICATE_KEY,
    PERMISSION_ACCOUNT_NEED_INIT,
    PERMISSION_FORGET_SUCCESS,
    PERMISSION_LOGIN_SUCCESS,
    PERMISSION_LOGIN_USERNAME_PASSWORD_ERROR,
    PERMISSION_NO_VERIFICATION_REQUIRED,
    PERMISSION_REGISTER_SUCCESS,
    PERMISSION_RETRIEVE_CODE_ERROR_OR_EXPIRED,
    PERMISSION_RETRIEVE_SUCCESS,
    PERMISSION_USER_DISABLE,
    PERMISSION_USER_NOT_FOUND,
    PERMISSION_USERNAME_NOT_FOUND
} from '@/constants/common.constants.ts'
import { getLoginStatus, getUserInfo, requestUserInfo, setToken } from '@/util/auth'
import { AppContext } from '@/App'
import { utcToLocalTime } from '@/util/datetime'
import { useUpdatedEffect } from '@/util/hooks'
import {
    r_auth_forget,
    r_auth_login,
    r_auth_register,
    r_auth_resend,
    r_auth_retrieve,
    r_auth_verify
} from '@/services/auth'
import FitFullscreen from '@/components/common/FitFullscreen'
import FitCenter from '@/components/common/FitCenter'
import FlexBox from '@/components/common/FlexBox'
import { getRedirectUrl } from '@/util/route.tsx'
import { r_api_avatar_random_base64 } from '@/services/api/avatar.tsx'

const SignUp: React.FC = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const [isSigningUp, setIsSigningUp] = useState(false)
    const [isFinish, setIsFinish] = useState(false)
    const [isSending, setIsSending] = useState(false)

    useUpdatedEffect(() => {
        if (location.pathname !== '/register') {
            return
        }
        if (getLoginStatus()) {
            navigate(`/login${location.search}`, {
                replace: true
            })
        }
    }, [location.pathname])

    const handleOnFinish = (registerParam: RegisterParam) => {
        if (isSigningUp) {
            return
        }
        setIsSigningUp(true)
        void r_auth_register({
            username: registerParam.username,
            email: registerParam.email,
            password: registerParam.password
        })
            .then((res) => {
                const response = res.data
                switch (response.code) {
                    case PERMISSION_REGISTER_SUCCESS:
                        void r_auth_login({
                            account: registerParam.email,
                            password: registerParam.password
                        }).then((res_) => {
                            const response_ = res_.data
                            switch (response_.code) {
                                case PERMISSION_LOGIN_SUCCESS:
                                    setToken(response_.data?.token ?? '')
                                    void message.success('恭喜，您快要完成注册了')
                                    setIsFinish(true)
                                    break
                                default:
                                    void message.success('出错了，请稍后重试')
                                    setIsSigningUp(false)
                            }
                        })
                        break
                    case DATABASE_DUPLICATE_KEY:
                        void message.error('用户名或邮箱已被注册，请重试')
                        setIsSigningUp(false)
                        break
                    default:
                        void message.error('服务器出错了，请稍后重试')
                        setIsSigningUp(false)
                }
            })
            .catch(() => {
                setIsSigningUp(false)
            })
    }

    const handleOnResend = () => {
        if (isSending) {
            return
        }
        setIsSending(true)
        void message.loading({ content: '发送中', key: 'sending', duration: 0 })
        void r_auth_resend()
            .then((res) => {
                const response = res.data
                message.destroy('sending')
                if (response.success) {
                    void message.success('已发送验证邮件，请查收')
                } else {
                    void message.error('出错了，请稍后重试')
                }
            })
            .finally(() => {
                setIsSending(false)
            })
    }

    return (
        <div className={'sign-up'}>
            <FitCenter>
                <FlexBox>
                    <div className={'title'}>
                        <div className={'primary'}>创建账号</div>
                        <div className={'secondary'}>Create account</div>
                    </div>
                    <AntdForm autoComplete={'on'} onFinish={handleOnFinish} className={'form'}>
                        {!isFinish ? (
                            <>
                                <AntdForm.Item
                                    name={'username'}
                                    rules={[
                                        { required: true, message: '请输入用户名' },
                                        {
                                            pattern: /^[a-zA-Z-_][0-9a-zA-Z-_]{2,38}$/,
                                            message:
                                                '只能包含字母、数字、连字符和下划线，不能以数字开头'
                                        }
                                    ]}
                                >
                                    <AntdInput
                                        prefix={<Icon component={IconFatwebUser} />}
                                        placeholder={'用户名'}
                                        maxLength={39}
                                        showCount={true}
                                        disabled={isSigningUp}
                                    />
                                </AntdForm.Item>
                                <AntdForm.Item
                                    name={'email'}
                                    rules={[
                                        { required: true, message: '请输入邮箱' },
                                        { type: 'email', message: '不是有效的邮箱地址' }
                                    ]}
                                >
                                    <AntdInput
                                        type={'email'}
                                        prefix={<Icon component={IconFatwebEmail} />}
                                        placeholder={'邮箱'}
                                        disabled={isSigningUp}
                                    />
                                </AntdForm.Item>
                                <AntdForm.Item
                                    name={'password'}
                                    rules={[
                                        { required: true, message: '请输入密码' },
                                        { min: 10, message: '密码至少为10位' },
                                        { max: 30, message: '密码最多为30位' }
                                    ]}
                                >
                                    <AntdInput.Password
                                        prefix={<Icon component={IconFatwebPassword} />}
                                        placeholder={'密码'}
                                        disabled={isSigningUp}
                                    />
                                </AntdForm.Item>
                                <AntdForm.Item
                                    name={'passwordConfirm'}
                                    rules={[
                                        { required: true, message: '请确认密码' },
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                if (!value || getFieldValue('password') === value) {
                                                    return Promise.resolve()
                                                }
                                                return Promise.reject(
                                                    new Error('两次密码输入必须一致')
                                                )
                                            }
                                        })
                                    ]}
                                >
                                    <AntdInput.Password
                                        prefix={<Icon component={IconFatwebPassword} />}
                                        placeholder={'确认密码'}
                                        disabled={isSigningUp}
                                    />
                                </AntdForm.Item>
                                <AntdForm.Item>
                                    <AntdButton
                                        style={{ width: '100%' }}
                                        type={'primary'}
                                        htmlType={'submit'}
                                        disabled={isSigningUp}
                                        loading={isSigningUp}
                                    >
                                        注&ensp;&ensp;&ensp;&ensp;册
                                    </AntdButton>
                                </AntdForm.Item>
                            </>
                        ) : (
                            <div className={'retry'}>
                                我们发送了一封包含验证账号链接的邮件到您的邮箱里，如未收到，可能被归为垃圾邮件，请仔细检查。
                                <a onClick={handleOnResend}>重新发送</a>
                            </div>
                        )}

                        <div className={'footer'} hidden={isFinish}>
                            已有账号？
                            <a
                                onClick={() =>
                                    navigate(`/login${location.search}`, { replace: true })
                                }
                            >
                                登录
                            </a>
                        </div>
                    </AntdForm>
                </FlexBox>
            </FitCenter>
        </div>
    )
}

const Verify: React.FC = () => {
    const { refreshRouter } = useContext(AppContext)
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const [hasCode, setHasCode] = useState(true)
    const [needVerify, setNeedVerify] = useState(true)
    const [isValid, setIsValid] = useState(true)
    const [isSending, setIsSending] = useState(false)
    const [isGettingAvatar, setIsGettingAvatar] = useState(false)
    const [avatar, setAvatar] = useState('')
    const [isVerifying, setIsVerifying] = useState(false)

    useUpdatedEffect(() => {
        if (location.pathname !== '/verify') {
            return
        }

        if (!getLoginStatus()) {
            navigate(getRedirectUrl('/login', `${location.pathname}${location.search}`), {
                replace: true
            })
            return
        }

        const code = searchParams.get('code')

        if (!code) {
            setHasCode(false)
            return
        }
        void r_auth_verify({ code })
            .then((res) => {
                const response = res.data
                switch (response.code) {
                    case PERMISSION_ACCOUNT_NEED_INIT:
                        void getUserInfo().then((user) => {
                            setAvatar(user.userInfo.avatar)
                        })
                        break
                    case PERMISSION_NO_VERIFICATION_REQUIRED:
                        void message.success('无需验证')
                        setNeedVerify(false)
                        break
                    default:
                        setIsValid(false)
                }
            })
            .catch(() => {
                setIsValid(false)
            })
    }, [location.pathname])

    const handleOnResend = () => {
        if (isSending) {
            return
        }
        setIsSending(true)
        void message.loading({ content: '发送中', key: 'sending', duration: 0 })
        void r_auth_resend()
            .then((res) => {
                const response = res.data
                message.destroy('sending')
                if (response.success) {
                    void message.success('已发送验证邮件，请查收')
                } else {
                    void message.error('出错了，请稍后重试')
                }
            })
            .finally(() => {
                setIsSending(false)
            })
    }

    const handleOnChangeAvatar = () => {
        if (isGettingAvatar) {
            return
        }
        setIsGettingAvatar(true)
        void r_api_avatar_random_base64()
            .then((res) => {
                const response = res.data
                if (response.success) {
                    response.data?.base64 && setAvatar(response.data.base64)
                }
            })
            .finally(() => {
                setIsGettingAvatar(false)
            })
    }

    const handleOnFinish = (verifyParam: VerifyParam) => {
        if (isVerifying) {
            return
        }
        setIsVerifying(true)

        void r_auth_verify({
            code: searchParams.get('code') ?? '',
            avatar,
            nickname: verifyParam.nickname
        }).then((res) => {
            const response = res.data
            if (response.success) {
                void message.success('恭喜你，完成了')
                setTimeout(() => {
                    void requestUserInfo().then(() => {
                        refreshRouter()
                        if (searchParams.has('redirect')) {
                            navigate(searchParams.get('redirect') ?? '/')
                        } else {
                            navigate('/')
                        }
                    })
                }, 1500)
            } else {
                void message.error('出错了，请稍后重试')
                setIsVerifying(false)
            }
        })
    }

    return (
        <>
            <div className={'verify'}>
                <FitCenter>
                    <FlexBox>
                        <div className={'title'}>
                            <div className={'primary'}>验证账号</div>
                            <div className={'secondary'}>Verify account</div>
                        </div>
                        <AntdForm className={'form'} onFinish={handleOnFinish}>
                            <div className={'no-verify-need'} hidden={needVerify}>
                                账号已验证通过，无需验证，点击&nbsp;<a href={'/'}>回到首页</a>
                            </div>
                            <div
                                className={'verify-process'}
                                hidden={!needVerify || !hasCode || !isValid}
                            >
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        marginBottom: 20
                                    }}
                                >
                                    <AntdTooltip title={'点击获取新头像'}>
                                        <AntdAvatar
                                            src={
                                                <img
                                                    src={`data:image/png;base64,${avatar}`}
                                                    alt={'Avatar'}
                                                />
                                            }
                                            size={100}
                                            style={{
                                                background: COLOR_BACKGROUND,
                                                cursor: 'pointer'
                                            }}
                                            onClick={handleOnChangeAvatar}
                                        />
                                    </AntdTooltip>
                                </div>
                                <AntdForm.Item hidden name={'avatar'}>
                                    <AntdInput value={avatar} />
                                </AntdForm.Item>
                                <AntdForm.Item
                                    name={'nickname'}
                                    rules={[
                                        { required: true, message: '请输入昵称' },
                                        { min: 3, message: '昵称至少为3个字符' }
                                    ]}
                                >
                                    <AntdInput
                                        disabled={isVerifying}
                                        maxLength={20}
                                        showCount
                                        addonBefore={'昵称'}
                                    />
                                </AntdForm.Item>
                                <AntdForm.Item>
                                    <AntdButton
                                        style={{ width: '100%' }}
                                        type={'primary'}
                                        htmlType={'submit'}
                                        disabled={isVerifying}
                                        loading={isVerifying}
                                    >
                                        确&ensp;&ensp;&ensp;&ensp;定
                                    </AntdButton>
                                </AntdForm.Item>
                            </div>
                            <div className={'no-code'} hidden={hasCode}>
                                在继续使用之前，我们需要确定您的电子邮箱地址的有效性，请点击&nbsp;
                                <a onClick={handleOnResend}>发送验证邮件</a>
                            </div>
                            <div className={'not-valid'} hidden={!hasCode || isValid}>
                                此链接有误或已失效，请点击&nbsp;
                                <a onClick={handleOnResend}>重新发送验证邮件</a>
                            </div>
                        </AntdForm>
                    </FlexBox>
                </FitCenter>
            </div>
        </>
    )
}

const Forget: React.FC = () => {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const [isSending, setIsSending] = useState(false)
    const [isSent, setIsSent] = useState(false)
    const [isChanging, setIsChanging] = useState(false)
    const [isChanged, setIsChanged] = useState(false)

    const handleOnSend = (forgetParam: ForgetParam) => {
        if (isSending) {
            return
        }
        setIsSending(true)

        void r_auth_forget(forgetParam)
            .then((res) => {
                const response = res.data
                switch (response.code) {
                    case PERMISSION_FORGET_SUCCESS:
                        void message.success('已发送验证邮件，请查收')
                        setIsSent(true)
                        break
                    case PERMISSION_USER_NOT_FOUND:
                        void message.error('用户不存在')
                        break
                    default:
                        void message.error('出错了，请稍后重试')
                }
            })
            .finally(() => {
                setIsSending(false)
            })
    }

    const handleOnRetry = () => {
        setIsSent(false)
    }

    const handleOnChange = (retrieveParam: RetrieveParam) => {
        if (isChanging) {
            return
        }
        setIsChanging(true)

        void r_auth_retrieve({
            code: searchParams.get('code') ?? '',
            password: retrieveParam.password
        })
            .then((res) => {
                const response = res.data

                switch (response.code) {
                    case PERMISSION_RETRIEVE_SUCCESS:
                        void message.success('密码已更新')
                        setIsChanged(true)
                        break
                    case PERMISSION_RETRIEVE_CODE_ERROR_OR_EXPIRED:
                        void message.error('验证码有误，请重新获取')
                        break
                    default:
                        void message.error('出错了，请稍后重试')
                }
            })
            .finally(() => {
                setIsChanging(false)
            })
    }

    return (
        <div className={'forget'}>
            <FitCenter>
                <FlexBox>
                    <div className={'title'}>
                        <div className={'primary'}>找回密码</div>
                        <div className={'secondary'}>Retrieve password</div>
                    </div>
                    <div className={'form'}>
                        {!searchParams.get('code') ? (
                            !isSent ? (
                                <>
                                    <AntdForm autoComplete={'on'} onFinish={handleOnSend}>
                                        <AntdForm.Item
                                            name={'email'}
                                            rules={[
                                                { required: true, message: '请输入邮箱' },
                                                { type: 'email', message: '不是有效的邮箱地址' }
                                            ]}
                                        >
                                            <AntdInput
                                                prefix={<Icon component={IconFatwebEmail} />}
                                                placeholder={'邮箱'}
                                                disabled={isSending}
                                            />
                                        </AntdForm.Item>
                                        <AntdForm.Item>
                                            <AntdButton
                                                style={{ width: '100%' }}
                                                type={'primary'}
                                                htmlType={'submit'}
                                                disabled={isSending}
                                                loading={isSending}
                                            >
                                                确&ensp;&ensp;&ensp;&ensp;定
                                            </AntdButton>
                                        </AntdForm.Item>
                                    </AntdForm>
                                </>
                            ) : (
                                <div className={'retry'}>
                                    我们向您发送了一封包含找回密码链接的邮件，如未收到，可能被归为垃圾邮件，请仔细检查。
                                    <a onClick={handleOnRetry}>重新发送</a>
                                </div>
                            )
                        ) : !isChanged ? (
                            <>
                                <AntdForm autoComplete={'on'} onFinish={handleOnChange}>
                                    <AntdForm.Item
                                        name={'password'}
                                        rules={[
                                            { required: true, message: '请输入密码' },
                                            { min: 10, message: '密码至少为10位' },
                                            { max: 30, message: '密码最多为30位' }
                                        ]}
                                    >
                                        <AntdInput.Password
                                            addonBefore={
                                                <span>新&nbsp;&nbsp;密&nbsp;&nbsp;码</span>
                                            }
                                            placeholder={'密码'}
                                            disabled={isChanging}
                                        />
                                    </AntdForm.Item>
                                    <AntdForm.Item
                                        name={'passwordConfirm'}
                                        rules={[
                                            { required: true, message: '请确认密码' },
                                            ({ getFieldValue }) => ({
                                                validator(_, value) {
                                                    if (
                                                        !value ||
                                                        getFieldValue('password') === value
                                                    ) {
                                                        return Promise.resolve()
                                                    }
                                                    return Promise.reject(
                                                        new Error('两次密码输入必须一致')
                                                    )
                                                }
                                            })
                                        ]}
                                    >
                                        <AntdInput.Password
                                            addonBefore={'确认密码'}
                                            placeholder={'确认密码'}
                                            disabled={isChanging}
                                        />
                                    </AntdForm.Item>
                                    <AntdForm.Item>
                                        <AntdButton
                                            style={{ width: '100%' }}
                                            type={'primary'}
                                            htmlType={'submit'}
                                            disabled={isChanging}
                                            loading={isChanging}
                                        >
                                            更&ensp;&ensp;&ensp;&ensp;改
                                        </AntdButton>
                                    </AntdForm.Item>
                                </AntdForm>
                            </>
                        ) : (
                            <div className={'success'}>恭喜你，密码已更新，请重新登录。</div>
                        )}

                        <div className={'footer'}>
                            找到了？
                            <a onClick={() => navigate(`/login`, { replace: true })}>登录</a>
                        </div>
                    </div>
                </FlexBox>
            </FitCenter>
        </div>
    )
}

const SignIn: React.FC = () => {
    const { refreshRouter } = useContext(AppContext)
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const [isSigningIn, setIsSigningIn] = useState(false)

    const handleOnFinish = (loginParam: LoginParam) => {
        if (isSigningIn) {
            return
        }
        setIsSigningIn(true)

        void r_auth_login({ account: loginParam.account, password: loginParam.password })
            .then((res) => {
                const response = res.data
                const { code, data } = response
                switch (code) {
                    case PERMISSION_LOGIN_SUCCESS:
                        setToken(data?.token ?? '')
                        void message.success('登录成功')
                        setTimeout(() => {
                            void getUserInfo().then((user) => {
                                refreshRouter()
                                if (searchParams.has('redirect')) {
                                    navigate(searchParams.get('redirect') ?? '/')
                                } else {
                                    navigate('/')
                                }

                                notification.success({
                                    message: '欢迎回来',
                                    description: (
                                        <>
                                            <span>
                                                你好 <strong>{user.userInfo.nickname}</strong>
                                            </span>
                                            <br />
                                            <span>
                                                最近登录：
                                                {user.lastLoginTime
                                                    ? `${utcToLocalTime(user.lastLoginTime)}【${
                                                          user.lastLoginIp
                                                      }】`
                                                    : '无'}
                                            </span>
                                        </>
                                    ),
                                    placement: 'topRight'
                                })
                            })
                        }, 1500)
                        break
                    case PERMISSION_USERNAME_NOT_FOUND:
                    case PERMISSION_LOGIN_USERNAME_PASSWORD_ERROR:
                        void message.error(
                            <>
                                <strong>账号</strong>或<strong>密码</strong>错误，请重试
                            </>
                        )
                        setIsSigningIn(false)
                        break
                    case PERMISSION_USER_DISABLE:
                        void message.error(
                            <>
                                该用户已被<strong>禁用</strong>
                            </>
                        )
                        setIsSigningIn(false)
                        break
                    default:
                        void message.error(
                            <>
                                <strong>服务器出错了</strong>
                            </>
                        )
                        setIsSigningIn(false)
                }
            })
            .catch(() => {
                setIsSigningIn(false)
            })
    }

    return (
        <div className={'sign-in'}>
            <FitCenter>
                <FlexBox>
                    <div className={'title'}>
                        <div className={'primary'}>欢迎回来</div>
                        <div className={'secondary'}>Welcome back</div>
                    </div>
                    <AntdForm autoComplete={'on'} onFinish={handleOnFinish} className={'form'}>
                        <AntdForm.Item
                            name={'account'}
                            rules={[{ required: true, message: '请输入账号' }]}
                        >
                            <AntdInput
                                prefix={<Icon component={IconFatwebUser} />}
                                placeholder={'邮箱/用户名'}
                                disabled={isSigningIn}
                            />
                        </AntdForm.Item>
                        <AntdForm.Item
                            name={'password'}
                            rules={[{ required: true, message: '请输入密码' }]}
                        >
                            <AntdInput.Password
                                prefix={<Icon component={IconFatwebPassword} />}
                                placeholder={'密码'}
                                disabled={isSigningIn}
                            />
                        </AntdForm.Item>
                        <FlexBox direction={'horizontal'} className={'addition'}>
                            <AntdCheckbox disabled={isSigningIn}>记住密码</AntdCheckbox>
                            <a
                                onClick={() => {
                                    navigate(`/forget${location.search}`, { replace: true })
                                }}
                            >
                                忘记密码？
                            </a>
                        </FlexBox>
                        <AntdForm.Item>
                            <AntdButton
                                style={{ width: '100%' }}
                                type={'primary'}
                                htmlType={'submit'}
                                disabled={isSigningIn}
                                loading={isSigningIn}
                            >
                                登&ensp;&ensp;&ensp;&ensp;录
                            </AntdButton>
                        </AntdForm.Item>
                        <div className={'footer'}>
                            还没有账号？
                            <a
                                onClick={() =>
                                    navigate(`/register${location.search}`, { replace: true })
                                }
                            >
                                注册
                            </a>
                        </div>
                    </AntdForm>
                </FlexBox>
            </FitCenter>
        </div>
    )
}

const Sign: React.FC = () => {
    const lastPage = useRef('none')
    const currentPage = useRef('none')
    const match = useMatches().reduce((_, second) => second)
    const [isSwitch, setIsSwitch] = useState(false)

    const leftPage = ['register', 'verify', 'forget']

    useUpdatedEffect(() => {
        lastPage.current = currentPage.current
        currentPage.current = match.id

        setIsSwitch(leftPage.includes(currentPage.current))
    }, [match.id])

    const leftComponent = () => {
        switch (leftPage.includes(currentPage.current) ? currentPage.current : lastPage.current) {
            case 'forget':
                return <Forget />
            case 'verify':
                return <Verify />
            default:
                return <SignUp />
        }
    }

    const rightComponent = () => {
        switch (leftPage.includes(currentPage.current) ? lastPage.current : currentPage.current) {
            default:
                return <SignIn />
        }
    }

    return (
        <>
            <FitFullscreen data-component={'sign'}>
                <FitCenter>
                    <FlexBox
                        direction={'horizontal'}
                        className={`sign-box${isSwitch ? ' switch' : ''}`}
                    >
                        <div className={`left${!isSwitch ? ' hidden' : ''}`}>{leftComponent()}</div>
                        <div className={`right${isSwitch ? ' hidden' : ''}`}>
                            {rightComponent()}
                        </div>
                        <FlexBox className={'cover'}>
                            <div className={'ball-box'}>
                                <div className={'ball'} />
                            </div>
                            <div className={'ball-box'}>
                                <div className={'mask'}>
                                    <div className={'ball'} />
                                </div>
                            </div>
                        </FlexBox>
                    </FlexBox>
                </FitCenter>
            </FitFullscreen>
        </>
    )
}

export default Sign
