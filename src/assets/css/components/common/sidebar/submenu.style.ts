import { createStyles, keyframes } from 'antd-style'

const slideIn = keyframes`
    0% {
        transform: translateX(-10px);
        opacity: 0;
    }
    100% {
        transform: translateX(0);
        opacity: 1;
    }
`

const slideOut = keyframes`
              0% {
                transform: translateX(0);
                opacity: 1;
              }
              100% {
                transform: translateX(-10px);
                opacity: 0;
              }
`

export default createStyles(({ token }) => ({
    submenu: {
        visibility: 'hidden',
        position: 'fixed',
        paddingLeft: '10px',
        zIndex: 10000,
        animation: `${slideOut} 0.1s ease forwards`
    },

    hoveredSubmenu: {
        visibility: 'visible',
        animation: `${slideIn} 0.3s ease`
    },

    content: {
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
        padding: '10px 10px',
        backgroundColor: token.colorBgContainer,
        borderRadius: '8px',
        boxShadow: '2px 2px 10px 0 rgba(0, 0, 0, 0.1)'
    }
}))
