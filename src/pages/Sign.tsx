import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import Icon from '@ant-design/icons'
import '@/assets/css/pages/sign.scss'
import {
    DATABASE_DUPLICATE_KEY,
    PERMISSION_LOGIN_SUCCESS,
    PERMISSION_LOGIN_USERNAME_PASSWORD_ERROR,
    PERMISSION_REGISTER_SUCCESS,
    PERMISSION_USER_DISABLE,
    PERMISSION_USERNAME_NOT_FOUND
} from '@/constants/common.constants.ts'
import { getLoginStatus, getUserInfo, setToken } from '@/util/auth'
import { AppContext } from '@/App'
import { utcToLocalTime } from '@/util/datetime'
import { useUpdatedEffect } from '@/util/hooks'
import { r_auth_login, r_auth_register } from '@/services/auth'
import FitFullscreen from '@/components/common/FitFullscreen'
import FitCenter from '@/components/common/FitCenter'
import FlexBox from '@/components/common/FlexBox'

const SignUp: React.FC = () => {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const [isSigningUp, setIsSigningUp] = useState(false)
    const [isFinish, setIsFinish] = useState(false)

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
                        void message.success('恭喜，您快要完成注册了')
                        setIsFinish(true)
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

    const handleOnRetry = () => {}

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
                                我们发送了一封包含激活账号链接的邮件到您的邮箱里，如未收到，可能被归为垃圾邮件，请仔细检查。
                                <a onClick={handleOnRetry}>重新发送</a>
                            </div>
                        )}

                        <div className={'footer'}>
                            已有账号？
                            <a
                                onClick={() =>
                                    navigate(
                                        `/login${
                                            searchParams.toString()
                                                ? `?${searchParams.toString()}`
                                                : ''
                                        }`,
                                        { replace: true }
                                    )
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
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()

    useUpdatedEffect(() => {
        if (!getLoginStatus()) {
            navigate(`/login${searchParams.toString() ? `?${searchParams.toString()}` : ''}`, {
                replace: true
            })
        }
    }, [])

    return <></>
}

const Forget: React.FC = () => {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const [isLoading, setIsLoading] = useState(false)
    const [isFinish, setIsFinish] = useState(false)

    const handleOnFinish = () => {
        setIsFinish(true)
    }

    const handleOnRetry = () => {
        setIsFinish(false)
    }

    return (
        <div className={'forget'}>
            <FitCenter>
                <FlexBox>
                    <div className={'title'}>
                        <div className={'primary'}>找回密码</div>
                        <div className={'secondary'}>Retrieve password</div>
                    </div>
                    <AntdForm autoComplete={'on'} onFinish={handleOnFinish} className={'form'}>
                        {!isFinish ? (
                            <>
                                <AntdForm.Item
                                    name={'account'}
                                    rules={[
                                        { required: true, message: '请输入邮箱' },
                                        { type: 'email', message: '不是有效的邮箱地址' }
                                    ]}
                                >
                                    <AntdInput
                                        prefix={<Icon component={IconFatwebEmail} />}
                                        placeholder={'邮箱'}
                                        disabled={isLoading}
                                    />
                                </AntdForm.Item>
                                <AntdForm.Item>
                                    <AntdButton
                                        style={{ width: '100%' }}
                                        type={'primary'}
                                        htmlType={'submit'}
                                        disabled={isLoading}
                                        loading={isLoading}
                                    >
                                        确&ensp;&ensp;&ensp;&ensp;定
                                    </AntdButton>
                                </AntdForm.Item>
                            </>
                        ) : (
                            <div className={'retry'}>
                                我们发送了一封包含找回密码链接的邮件到您的邮箱里，如未收到，可能被归为垃圾邮件，请仔细检查。
                                <a onClick={handleOnRetry}>重新发送</a>
                            </div>
                        )}

                        <div className={'footer'}>
                            找到了？
                            <a
                                onClick={() =>
                                    navigate(
                                        `/login${
                                            searchParams.toString()
                                                ? `?${searchParams.toString()}`
                                                : ''
                                        }`,
                                        { replace: true }
                                    )
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
                                    navigate(
                                        `/forget${
                                            searchParams.toString()
                                                ? `?${searchParams.toString()}`
                                                : ''
                                        }`,
                                        { replace: true }
                                    )
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
                                    navigate(
                                        `/register${
                                            searchParams.toString()
                                                ? `?${searchParams.toString()}`
                                                : ''
                                        }`,
                                        { replace: true }
                                    )
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
