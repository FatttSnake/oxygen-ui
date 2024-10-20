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

export default createStyles(({ cx, css, token }) => {
    const collapsedExit = cx(css`
        display: none;
        position: absolute;
        padding-left: 6px;
        left: 100%;
        z-index: 1000;
        box-shadow: 5px 5px 15px 0 rgba(0, 0, 0, 0.1);
    `)

    return {
        footer: css`
            display: flex;
            position: relative;
            align-items: center;
            font-weight: bold;
            padding: 8px 14px;
            color: ${token.colorPrimary};

            &:hover .${collapsedExit} {
                display: block;
                animation: ${slideIn} 0.3s ease;
            }
        `,

        icon: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flex: '0 0 auto',
            marginLeft: '4px',
            width: '36px',
            height: '36px',
            fontSize: token.sizeMS,
            border: `2px ${token.colorBorder} solid`,
            color: token.colorBorder,
            borderRadius: '50%',
            overflow: 'hidden',
            cursor: 'pointer',

            img: {
                width: '100%',
                height: '100%'
            }
        },

        text: {
            flex: 1,
            paddingLeft: '10px',
            fontSize: '1.4em',
            color: token.colorTextLabel,
            userSelect: 'text',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            a: {
                color: token.colorPrimary,
                textDecoration: 'underline'
            }
        },

        collapsedText: {
            display: 'none'
        },

        collapsedExit,

        hide: {
            display: 'none !important'
        },

        exitContent: {
            display: 'flex',
            backgroundColor: token.colorBgContainer
        },

        collapsedExitContent: {
            padding: '8px',
            borderRadius: '8px'
        },

        exitIcon: {
            fontSize: token.sizeMS,
            color: token.colorError,
            padding: '6px 10px',
            cursor: 'pointer',

            '&:hover': {
                borderRadius: '8px',
                backgroundColor: token.colorBgLayout
            }
        },

        collapsedExitIcon: {
            padding: '4px 8px'
        }
    }
})
