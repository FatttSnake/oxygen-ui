import { createStyles } from 'antd-style'

export default createStyles(({ token }) => ({
    root: {
        width: 200,
        height: 320,
        textAlign: 'center',
        gap: '42px',
        cursor: 'pointer',
        '> *': {
            flex: '0 0 auto',
            display: 'block'
        }
    },
    icon: {
        marginTop: '80px',
        color: token.colorPrimary,
        fontSize: token.sizeXXL
    },
    text: {
        fontWeight: 'bolder',
        fontSize: '2em'
    }
}))
