import { createStyles } from 'antd-style'

export default createStyles(() => ({
    fullscreenLoadingMask: {
        position: 'absolute',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        zIndex: 100,
        backgroundColor: 'rgba(200, 200, 200, 0.2)'
    }
}))
