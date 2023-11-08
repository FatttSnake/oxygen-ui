import React from 'react'
import '@/assets/css/components/common/flex-box.scss'

interface FlexBoxProps
    extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    direction?: 'horizontal' | 'vertical'
    gap?: number
}

const FlexBox = forwardRef<HTMLDivElement, FlexBoxProps>((props, ref) => {
    const { className, direction, gap, style, ..._props } = props
    return (
        <div
            className={`flex-box ${
                direction === 'horizontal' ? 'flex-horizontal' : 'flex-vertical'
            }${className ? ` ${className}` : ''}`}
            style={{ gap, ...style }}
            {..._props}
            ref={ref}
        />
    )
})

export default FlexBox
