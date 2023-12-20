import React from 'react'
import { hasPathPermission, hasPermission } from '@/util/auth'

interface PermissionProps extends React.PropsWithChildren {
    operationCode?: string
    path?: string
}

const Permission: React.FC<PermissionProps> = (props) => {
    if (
        (!props.operationCode || hasPermission(props.operationCode)) &&
        (!props.path || hasPathPermission(props.path))
    ) {
        return props.children
    }

    return <></>
}

export default Permission
