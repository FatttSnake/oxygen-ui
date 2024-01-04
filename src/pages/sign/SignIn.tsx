import React, { useCallback } from 'react'
import Icon from '@ant-design/icons'
import { Turnstile, TurnstileInstance } from '@marsidev/react-turnstile'
import {
    H_CAPTCHA_SITE_KEY,
    PERMISSION_LOGIN_SUCCESS,
    PERMISSION_LOGIN_USERNAME_PASSWORD_ERROR,
    PERMISSION_USER_DISABLE,
    PERMISSION_USERNAME_NOT_FOUND,
    SYSTEM_INVALID_CAPTCHA_CODE
} from '@/constants/common.constants'
import { useUpdatedEffect } from '@/util/hooks'
import { getUserInfo, setToken } from '@/util/auth'
import { utcToLocalTime } from '@/util/datetime'
import { r_auth_login } from '@/services/auth'
import { AppContext } from '@/App'
import FitCenter from '@/components/common/FitCenter'
import FlexBox from '@/components/common/FlexBox'

const SignIn: React.FC = () => {
    const { refreshRouter } = useContext(AppContext)
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const turnstileRef = useRef<TurnstileInstance>()
    const turnstileRefCallback = useCallback(
        (node: TurnstileInstance) => {
            turnstileRef.current = node
            if (location.pathname === '/login') {
                turnstileRef.current?.execute()
            }
        },
        [location.pathname]
    )
    const [isSigningIn, setIsSigningIn] = useState(false)
    const [captchaCode, setCaptchaCode] = useState('')

    useUpdatedEffect(() => {
        if (!isSigningIn) {
            setCaptchaCode('')
            turnstileRef.current?.reset()
            turnstileRef.current?.execute()
        }
    }, [isSigningIn])

    const handleOnFinish = (loginParam: LoginParam) => {
        if (isSigningIn) {
            return
        }
        setIsSigningIn(true)

        if (!captchaCode) {
            void message.warning('请先通过验证')
            setIsSigningIn(false)
            return
        }

        void r_auth_login({
            account: loginParam.account,
            password: loginParam.password,
            captchaCode
        })
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
                    case SYSTEM_INVALID_CAPTCHA_CODE:
                        void message.error('验证码有误，请重试')
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
                                prefix={<Icon component={IconOxygenUser} />}
                                placeholder={'邮箱/用户名'}
                                disabled={isSigningIn}
                            />
                        </AntdForm.Item>
                        <AntdForm.Item
                            name={'password'}
                            rules={[{ required: true, message: '请输入密码' }]}
                        >
                            <AntdInput.Password
                                prefix={<Icon component={IconOxygenPassword} />}
                                placeholder={'密码'}
                                disabled={isSigningIn}
                            />
                        </AntdForm.Item>
                        <AntdForm.Item>
                            <Turnstile
                                id={'sign-in-turnstile'}
                                ref={turnstileRefCallback}
                                siteKey={H_CAPTCHA_SITE_KEY}
                                options={{ theme: 'light', execution: 'execute' }}
                                onSuccess={setCaptchaCode}
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

export default SignIn
