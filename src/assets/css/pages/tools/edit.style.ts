import { createStyles } from 'antd-style'

export default createStyles(({ token }) => ({
    root: {
        padding: 20
    },

    layout: {
        gap: token.sizeSM,
        width: '100%',
        height: '100%'
    },

    rootBox: {
        width: '100%',
        height: '100%'
    },

    content: {
        position: 'relative',
        width: '100%',
        height: '100%'
    }
}))
