import React from 'react'
import { notification } from 'antd'
import '@/assets/css/pages/login.scss'
import { getLocalTime, setToken } from '@/utils/common'
import { getUserInfo, login } from '@/utils/auth'
import {
    PERMISSION_LOGIN_SUCCESS,
    PERMISSION_LOGIN_USERNAME_PASSWORD_ERROR,
    PERMISSION_USER_DISABLE,
    PERMISSION_USERNAME_NOT_FOUND
} from '@/constants/common.constants'

const Login: React.FC = () => {
    const [messageApi, contextHolder] = message.useMessage()
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const [isLoggingIn, setIsLoggingIn] = useState(false)

    const onFinish = (values: LoginForm) => {
        setIsLoggingIn(true)
        void login(values.username, values.password)
            .then((value) => {
                const res = value.data
                const { code, data } = res
                switch (code) {
                    case PERMISSION_LOGIN_SUCCESS:
                        setToken(data?.token ?? '')
                        void messageApi.success('登录成功')
                        setTimeout(() => {
                            if (searchParams.has('redirect')) {
                                navigate(searchParams.get('redirect') ?? '/')
                            } else {
                                navigate('/')
                            }
                            void getUserInfo().then((user) => {
                                notification.success({
                                    message: '欢迎回来',
                                    description: (
                                        <>
                                            <span>
                                                你好 <strong>{user.userInfo.nickname}</strong>
                                            </span>
                                            <br />
                                            <span>
                                                上次登录：
                                                {getLocalTime(user.lastLoginTime)}【
                                                {user.lastLoginIp}】
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
                        void messageApi.error(
                            <>
                                <strong>用户名</strong>或<strong>密码</strong>错误，请重试
                            </>
                        )
                        setIsLoggingIn(false)
                        break
                    case PERMISSION_USER_DISABLE:
                        void messageApi.error(
                            <>
                                该用户已被<strong>禁用</strong>
                            </>
                        )
                        setIsLoggingIn(false)
                        break
                    default:
                        void messageApi.error(
                            <>
                                <strong>服务器出错了</strong>
                            </>
                        )
                        setIsLoggingIn(false)
                }
            })
            .catch(() => {
                setIsLoggingIn(false)
            })
    }

    return (
        <>
            {contextHolder}
            <div className={'login-background'}>
                <div className={'login-box'}>
                    <div className={'login-box-left'}>
                        <div className={'login-box-left-text'}>
                            <div>欢迎回来</div>
                            <div>Welcome back</div>
                        </div>
                    </div>
                    <div className={'login-box-right'}>
                        <div className={'login-from-text'}>
                            <span>登&ensp;录</span>
                        </div>
                        <AntdForm
                            name="login-form"
                            autoComplete="on"
                            onFinish={onFinish}
                            className={'login-from'}
                        >
                            <AntdForm.Item
                                className={'login-from-item'}
                                name={'username'}
                                rules={[{ required: true, message: '用户名为空' }]}
                            >
                                <AntdInput
                                    prefix={<UserOutlined />}
                                    placeholder={'用户名'}
                                    disabled={isLoggingIn}
                                />
                            </AntdForm.Item>
                            <AntdForm.Item
                                className={'login-from-item'}
                                name={'password'}
                                rules={[{ required: true, message: '密码为空' }]}
                            >
                                <AntdInput.Password
                                    prefix={<LockOutlined />}
                                    placeholder={'密码'}
                                    disabled={isLoggingIn}
                                />
                            </AntdForm.Item>
                            <AntdForm.Item className={'login-from-item'}>
                                <AntdButton
                                    style={{ width: '100%' }}
                                    type={'primary'}
                                    htmlType={'submit'}
                                    disabled={isLoggingIn}
                                    loading={isLoggingIn}
                                >
                                    登&ensp;&ensp;&ensp;&ensp;录
                                </AntdButton>
                            </AntdForm.Item>
                        </AntdForm>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login
