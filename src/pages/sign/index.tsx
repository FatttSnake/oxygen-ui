import React from 'react'
import '@/assets/css/pages/sign.scss'
import { useUpdatedEffect } from '@/util/hooks'
import FitFullscreen from '@/components/common/FitFullscreen'
import FitCenter from '@/components/common/FitCenter'
import FlexBox from '@/components/common/FlexBox'
import SignUp from '@/pages/sign/SignUp'
import Verify from '@/pages/sign/Verify'
import Forget from '@/pages/sign/Forget'
import SignIn from '@/pages/sign/SignIn'

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
