import React from 'react'
import FitCenter from '@/components/common/FitCenter'
import Icon from '@ant-design/icons'
import '@/assets/css/components/home/footer.scss'
import FitFullScreen from '@/components/common/FitFullScreen'
import { NavLink } from 'react-router-dom'

const Footer: React.FC = () => {
    return (
        <>
            <FitFullScreen backgroundColor={'#333'}>
                <FitCenter vertical={true} style={{ gap: '20px' }}>
                    <div className={'icons'}>
                        <NavLink to={'https://github.com/FatttSnake'}>
                            <Icon component={IconFatwebGithub} className={'icon'} />
                        </NavLink>
                        <NavLink to={'https://ci.fatweb.top'}>
                            <Icon component={IconFatwebJenkins} className={'icon'} />
                        </NavLink>
                    </div>
                    <div className={'links'}>
                        <NavLink to={'mailto:fatttsnake@fatweb.top'}>Mail</NavLink>
                    </div>
                </FitCenter>
            </FitFullScreen>
        </>
    )
}

export default Footer
