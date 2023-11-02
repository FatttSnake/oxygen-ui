import React from 'react'
import '@/assets/css/components/common/card.scss'

interface CardProps
    extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {}

const Card: React.FC<CardProps> = (props) => {
    const { className, ..._props } = props
    return <div className={`card-box${className ? ` ${className}` : ''}`} {..._props} />
}

export default Card
