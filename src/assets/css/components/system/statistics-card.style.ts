import { createStyles } from 'antd-style'

export default createStyles(({ token }) => ({
    root: {
        padding: 20,
        gap: 20
    },

    head: {
        alignItems: 'center',
        gap: 5,
        color: token.colorPrimary,

        '>:nth-child(n+3)': {
            flex: '0 0 auto'
        }
    },

    icon: {
        fontSize: token.sizeLG,
        flex: '0 0 auto'
    },

    title: {
        display: 'flex',
        fontSize: token.fontSize
    }
}))
