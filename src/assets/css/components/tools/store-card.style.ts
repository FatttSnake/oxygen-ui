import { createStyles } from 'antd-style'

export default createStyles(({ cx, css, token }) => {
    const version = cx(css`
        width: 0;
        transition: all 0.2s;
    `)

    const operation = cx(css`
        display: flex;
        font-size: 1.6em;
        gap: 4px;
        opacity: 0;
        transition: all 0.2s;
        z-index: 100;

        > *:hover {
            color: ${token.colorIconHover};
        }
    `)

    return {
        root: css`
            width: 180px;
            height: 290px;
            text-align: center;
            gap: 14px;
            cursor: pointer;

            > * {
                flex: 0 0 auto;
            }

            &:hover {
                .${version} {
                    opacity: 0;
                }

                .${operation} {
                    opacity: 1;
                }
            }
        `,

        header: {
            display: 'flex',
            width: '100%',
            padding: 10,
            justifyContent: 'space-between'
        },

        version,

        operation,

        icon: {
            img: {
                width: token.sizeXL * 2
            }
        },

        info: {
            padding: '0 10px'
        },

        toolName: {
            fontSize: token.fontSizeXL,
            fontWeight: 'bolder',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
        },

        toolDesc: {
            marginTop: 10,
            color: token.colorTextDescription
        },

        author: {
            display: 'flex',
            marginTop: 'auto',
            paddingBottom: 10,
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 10,

            '&:hover': {
                color: token.colorPrimary
            }
        },

        avatar: {
            '> *': {
                width: token.sizeLG,
                height: token.sizeLG
            }
        },

        authorName: {
            display: 'flex',
            alignItems: 'center'
        },

        androidQrcode: {
            alignItems: 'center',
            transform: 'translateX(-16px)',
            gap: 20
        }
    }
})
