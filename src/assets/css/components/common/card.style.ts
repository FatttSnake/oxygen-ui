import { createStyles } from 'antd-style'

export default createStyles(({ token }) => ({
    cardBox: {
        backgroundColor: token.colorBgContainer,
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '5px 5px 15px 0 rgba(0,0,0,0.1)'
    }
}))
