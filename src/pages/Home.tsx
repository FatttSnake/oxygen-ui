import React from 'react'
import '@/assets/css/home.scss'

const Home: React.FC = () => {
    return (
        <>
            <header className={'nav'}>
                <a className={'logo'} href={'https://fatweb.top'}>
                    <span className={'title'}>FatWeb</span>
                </a>
            </header>
        </>
    )
}

export default Home
