import React from 'react'
import Icon from '@ant-design/icons'
import { getLoginStatus, logout } from '@/utils/auth'
import { getRedirectUrl } from '@/utils/common'

const SidebarFooter: React.FC = () => {
    const matches = useMatches()
    const lastMatch = matches.reduce((_, second) => second)
    const location = useLocation()
    const navigate = useNavigate()
    const [exiting, setExiting] = useState(false)
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
            setTimeout(() => {
                window.location.reload()
            }, 1500)
        })
    }

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
                已登录
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
