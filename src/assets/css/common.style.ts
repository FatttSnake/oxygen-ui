import { createGlobalStyle } from 'antd-style'

export default createGlobalStyle(() => ({
    '.center-box': {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    '.vertical-center-box': { display: 'flex', alignItems: 'center' },
    '.horizontal-center-box': { display: 'flex', justifyContent: 'center' },
    '.icon-size-xs': {
        width: '16px',
        height: '16px',
        '> use': { width: '16px', height: '16px' }
    },
    '.icon-size-sm': {
        width: '20px',
        height: '20px',
        '> use': { width: '20px', height: '20px' }
    },
    '.icon-size-md': {
        width: '24px',
        height: '24px',
        '> use': { width: '24px', height: '24px' }
    },
    '.icon-size-lg': {
        width: '32px',
        height: '32px',
        '> use': { width: '32px', height: '32px' }
    },
    '.icon-size-xl': {
        width: '64px',
        height: '64px',
        '> use': { width: '64px', height: '64px' }
    },
    '.icon-size-menu': {
        width: '23px',
        height: '23px',
        '> use': { width: '23px', height: '23px' }
    },
    '.flex-horizontal': { display: 'flex', flexDirection: 'row' },
    '.flex-vertical': { display: 'flex', flexDirection: 'column' }
}))
