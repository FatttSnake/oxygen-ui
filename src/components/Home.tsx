import React from 'react'
import '@/assets/css/home.scss'
import { MainFrameworkContext } from '@/pages/MainFramework'

const Home: React.FC = () => {
    const {
        navbarHiddenState: { navbarHidden, setNavbarHidden }
    } = useContext(MainFrameworkContext)
    const handleButtonClick = () => {
        setNavbarHidden(!navbarHidden)
    }
    return (
        <>
            <h1>Home</h1>
            <div style={{ marginTop: '100px' }}>
                <AntdButton onClick={handleButtonClick}>
                    {navbarHidden ? '显示' : '隐藏'}
                </AntdButton>
            </div>
        </>
    )
}

export default Home
