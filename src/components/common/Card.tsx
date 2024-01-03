import React from 'react'
import '@/assets/css/components/common/card.scss'

interface CardProps
    extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {}

const Card = forwardRef<HTMLDivElement, CardProps>(({ className, ...props }, ref) => {
    return <div className={`card-box${className ? ` ${className}` : ''}`} {...props} ref={ref} />
})

export default Card
