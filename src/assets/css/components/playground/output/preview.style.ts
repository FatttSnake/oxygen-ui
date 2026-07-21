import { createStyles } from 'antd-style'

export default createStyles(({ token }) => ({
    root: {
        display: 'flex',
        position: 'relative',
        height: 0
    },

    processMessage: {
        position: 'absolute',
        top: 0,
        width: '100%',
        color: token.colorInfoText,
        backgroundColor: token.colorBgBlur,
        padding: '5px 10px',
        fontSize: token.fontSize,
        overflow: 'hidden'
    },

    errorMessage: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        color: token.colorErrorText,
        backgroundColor: token.colorErrorBg,
        padding: '5px 10px',
        fontSize: token.fontSize,
        overflow: 'hidden'
    }
}))
