import React from 'react'
import Icon from '@ant-design/icons'
import '@/assets/css/components/home/slogan.scss'
import FitCenter from '@/components/common/FitCenter'

interface SloganProps {
    onClickScrollDown: (event: React.MouseEvent) => void
}

const Slogan: React.FC<SloganProps> = (props) => {
    const [slogan, setSlogan] = useState('')
    const [sloganType, setSloganType] = useState(true)

    const typeText = '因为热爱 所以折腾'
    if (sloganType) {
        setTimeout(() => {
            if (slogan.length < typeText.length) {
                setSlogan(typeText.substring(0, slogan.length + 1))
            } else {
                setSloganType(false)
            }
        }, 250)
    } else {
        setTimeout(() => {
            if (slogan.length > 0) {
                setSlogan(typeText.substring(0, slogan.length - 1))
            } else {
                setSloganType(true)
            }
        }, 100)
    }

    return (
        <>
            <FitCenter>
                <div className={'center-box'}>
                    <div className={'big-logo'}>FatWeb</div>
                    <span id={'slogan'} className={'slogan'}>
                        /* {slogan || <>&nbsp;</>} <span className={'cursor'}>|</span> */
                    </span>
                </div>
                <div className={'scroll-down'} onClick={props.onClickScrollDown}>
                    <Icon component={IconFatwebDown} style={{ fontSize: '1.8em', color: '#666' }} />
                </div>
            </FitCenter>
        </>
    )
}

export default Slogan
