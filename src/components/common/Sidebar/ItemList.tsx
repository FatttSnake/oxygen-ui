import React from 'react'

const ItemList: React.FC<React.PropsWithChildren> = (props) => {
    return <ul>{props.children}</ul>
}

export default ItemList
