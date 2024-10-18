import { createStyles } from 'antd-style'

export default createStyles(({ token }) => ({
    separate: {
        height: '0',
        margin: '10px 5px',
        border: `1px solid ${token.colorBorder}`,
        opacity: 0.4
    }
}))
