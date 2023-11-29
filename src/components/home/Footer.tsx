import React from 'react'
import Icon from '@ant-design/icons'
import '@/assets/css/components/home/footer.scss'
import FitCenter from '@/components/common/FitCenter'
import FitFullScreen from '@/components/common/FitFullScreen'

const Footer: React.FC = () => {
    return (
        <>
            <FitFullScreen backgroundColor={'#333'}>
                <FitCenter vertical={true} style={{ gap: 20 }}>
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
