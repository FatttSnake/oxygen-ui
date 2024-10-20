import { createStyles } from 'antd-style'

export default createStyles(({ cx, css, token }) => {
    const title = cx(css`
        display: flex;
        align-items: center;
        font-weight: bold;
        padding: 10px 14px;
        color: ${token.colorPrimary};
        overflow: hidden;
    `)

    const titleIcon = cx(css`
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 10px;
        width: 40px;
        height: 40px;
        font-size: ${token.sizeMD}px;
        border-radius: 8px;
        cursor: pointer;

        span {
            transform: rotateZ(180deg);
            transition: all 0.3s;
        }

        &:hover {
            background-color: ${token.colorBgLayout};
        }
    `)

    const titleText = cx(css`
        flex: 1;
        font-size: 2em;
        text-align: center;
        letter-spacing: 0.2em;
        transform: translateX(0.1em);
    `)

    return {
        sidebar: {
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            userSelect: 'none',
            transition: 'all .3s',
            whiteSpace: 'nowrap'
        },

        title,

        titleIcon,

        titleText,

        content: {
            display: 'flex',
            minHeight: '0',
            flexDirection: 'column',
            flex: 1,

            'ul > li, ul > div > li': {
                padding: '2px 14px'
            }
        },

        collapse: cx(css`
            width: 68px !important;

            .${title} {
                .${titleIcon} {
                    span {
                        transform: rotateZ(360deg);
                        transition: all 0.3s;
                    }
                }

                .${titleText} {
                    display: none;
                }
            }
        `)
    }
})
