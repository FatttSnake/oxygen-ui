import React from 'react'
import { hasPermission } from '@/util/auth'

interface PermissionProps extends React.PropsWithChildren {
    operationCode?: string
}

const Permission: React.FC<PermissionProps> = (props) => {
    if (!props.operationCode || hasPermission(props.operationCode)) {
        return props.children
    }

    return <></>
}

export default Permission
