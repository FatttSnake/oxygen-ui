import React from 'react'
import Icon from '@ant-design/icons'
import { COLOR_ERROR } from '@/constants/common.constants'
import { getRedirectUrl } from '@/utils/common'
import { getLoginStatus, getNickname, logout } from '@/utils/auth'

const SidebarFooter: React.FC = () => {
    const matches = useMatches()
    const lastMatch = matches.reduce((_, second) => second)
    const location = useLocation()
    const navigate = useNavigate()
    const [exiting, setExiting] = useState(false)
    const [nickname, setNickname] = useState('')

    const handleClickAvatar = () => {
        if (getLoginStatus()) {
            navigate('/user')
        } else {
            navigate(getRedirectUrl('/login', `${lastMatch.pathname}${location.search}`))
        }
    }

    const handleLogout = () => {
        if (exiting) {
            return
        }

        setExiting(true)
        void logout().finally(() => {
            notification.info({
                message: '已退出登录',
                icon: <Icon component={IconFatwebExit} style={{ color: COLOR_ERROR }} />
            })
            setTimeout(() => {
                window.location.reload()
            }, 1500)
        })
    }

    const loginStatus = getLoginStatus()

    useEffect(() => {
        if (getLoginStatus()) {
            void getNickname().then((nickname) => {
                setNickname(nickname)
            })
        }
    }, [loginStatus])

    return (
        <div className={'footer'}>
            <span className={'icon-user'} onClick={handleClickAvatar}>
                <Icon component={IconFatwebUser} />
            </span>
            <span hidden={getLoginStatus()} className={'text'}>
                未
                <NavLink to={getRedirectUrl('/login', `${lastMatch.pathname}${location.search}`)}>
                    登录
                </NavLink>
            </span>
            <span hidden={!getLoginStatus()} className={'text'}>
                {nickname}
            </span>
            <div
                hidden={!getLoginStatus()}
                className={`submenu-exit${!getLoginStatus() ? ' hide' : ''}`}
            >
                <div className={'content'}>
                    <span hidden={!getLoginStatus()} className={'icon-exit'} onClick={handleLogout}>
                        <Icon
                            component={exiting ? IconFatwebLoading : IconFatwebExit}
                            spin={exiting}
                        />
                    </span>
                </div>
            </div>
        </div>
    )
}

export default SidebarFooter
