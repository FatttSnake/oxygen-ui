import { createStyles } from 'antd-style'

export default createStyles(({ token }) => ({
    root: {
        cursor: 'pointer'
    },
    urlCard: {
        width: '100%',
        height: '100%',
        marginTop: '80px',
        textAlign: 'center',
        gap: '42px',
        '> *': {
            flex: '0 0 auto',
            display: 'block'
        }
    },
    icon: {
        color: token.colorPrimary,
        fontSize: token.sizeXXL
    },
    text: {
        fontWeight: 'bolder',
        fontSize: '2em'
    }
}))
