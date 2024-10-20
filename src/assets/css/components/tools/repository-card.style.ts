import { createStyles } from 'antd-style'

export default createStyles(({ cx, css, token }) => {
    const info = cx(css`
        padding: 0 10px;
        transform: translateY(30px);
        transition: all 0.1s ease;
    `)

    const edit = cx(css`
        > * {
            > :first-child {
                flex: 1;
            }
        }
    `)

    const toolDesc = cx(css`
        position: relative;
        margin-top: 10px;
        color: ${token.colorTextDescription};
        transition: all 0.1s ease;
    `)

    const operation = cx(css`
        display: flex;
        position: absolute;
        flex: 1;
        gap: 4px;
        bottom: 10%;
        padding: 0 15%;
        width: 100%;
        flex-direction: column;
        opacity: 0;

        > *,
        .${edit} > * {
            width: 100%;
        }
    `)

    return {
        root: css`
            width: 180px;
            height: 290px;
            text-align: center;
            gap: 14px;

            > * {
                flex: 0 0 auto;
            }

            &:hover {
                .${info} {
                    transform: translateY(-10px);
                    transition: all 0.2s ease;
                }

                .${toolDesc} {
                    opacity: 0;
                }

                .${operation} {
                    opacity: 1;
                    transition: all 0.4s ease;
                }
            }
        `,

        header: {
            display: 'flex',
            width: '100%',
            padding: 10,
            gap: 8,

            '> :first-child': {
                width: 0,
                flex: 1
            },

            '> :not(:first-child)': {
                fontSize: token.size
            }
        },

        icon: {
            img: {
                width: token.sizeXL * 2
            }
        },

        info,

        toolName: {
            fontSize: token.fontSizeXL,
            fontWeight: 'bolder',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
        },

        toolDesc,

        operation,

        edit
    }
})
