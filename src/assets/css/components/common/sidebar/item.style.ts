import { createStyles } from 'antd-style'

export default createStyles(({ cx, css, token }) => {
    const menuBt = cx(css`
        border-radius: 8px;
        overflow: hidden;
        height: 40px;

        a {
            display: flex;
            align-items: center;
            height: 100%;
            width: 100%;
            transition: all 0.2s;
            background-color: ${token.colorBgContainer};
        }
    `)

    const active = cx(css`
        color: ${token.colorTextLightSolid};
        background-color: ${token.colorPrimary} !important;
    `)

    return {
        item: css`
            position: relative;
            font-size: 1rem;

            &:hover > div > a:not(.${active}),
            &:hover > a:not(.${active}) {
                background-color: ${token.colorBgLayout};
            }
        `,

        submenuItem: css`
            border-radius: 8px;
            white-space: nowrap;
            overflow: hidden;
            padding: 0 !important;

            a {
                display: block;
                padding: 8px 16px;
                transition: all 0.2s;
            }
        `,

        menuBt,

        active,

        icon: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '0 10px',
            width: '40px',
            height: '40px',
            fontSize: token.sizeMD,
            cursor: 'pointer',

            img: {
                width: '100%'
            }
        },

        text: {
            flex: 1,
            paddingLeft: '8px',
            width: '0',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
        },

        collapsedText: {
            display: 'none'
        },

        collapsedExtend: {
            display: 'none'
        }
    }
})
