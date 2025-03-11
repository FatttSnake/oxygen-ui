import _ from 'lodash'
import {
    STORAGE_ACCESS_TOKEN_KEY,
    STORAGE_USER_INFO_KEY,
    DATABASE_SELECT_SUCCESS
} from '@/constants/common.constants'
import { floorNumber } from '@/util/common'
import { getLocalStorage, removeLocalStorage, setLocalStorage } from '@/util/browser'
import { getFullTitle } from '@/util/route'
import { r_sys_user_info_get } from '@/services/system'

export const setAccessToken = (accessToken: string) => {
    setLocalStorage(STORAGE_ACCESS_TOKEN_KEY, accessToken)
}

export const removeAccessToken = () => {
    removeLocalStorage(STORAGE_USER_INFO_KEY)
    removeLocalStorage(STORAGE_ACCESS_TOKEN_KEY)
}

export const getAccessToken = () => {
    return getLocalStorage(STORAGE_ACCESS_TOKEN_KEY)
}

export const getLoginStatus = () => {
    return getLocalStorage(STORAGE_ACCESS_TOKEN_KEY) !== null
}

export const getVerifyStatus_async = () => {
    if (getLocalStorage(STORAGE_USER_INFO_KEY) === null) {
        return undefined
    }
    return (JSON.parse(getLocalStorage(STORAGE_USER_INFO_KEY) as string) as UserWithPowerInfoVo)
        .verified
}

export const getUserInfo = async (force = false): Promise<UserWithPowerInfoVo> => {
    if (getLocalStorage(STORAGE_USER_INFO_KEY) !== null && !force) {
        return new Promise((resolve) => {
            resolve(
                JSON.parse(getLocalStorage(STORAGE_USER_INFO_KEY) as string) as UserWithPowerInfoVo
            )
        })
    }
    return requestUserInfo()
}

export const requestUserInfo = async () => {
    let user: UserWithPowerInfoVo | null

    await r_sys_user_info_get().then((value) => {
        const response = value.data
        if (response.code === DATABASE_SELECT_SUCCESS) {
            user = response.data
            setLocalStorage(STORAGE_USER_INFO_KEY, JSON.stringify(user))
        }
    })

    return new Promise<UserWithPowerInfoVo>((resolve, reject) => {
        if (user) {
            resolve(user)
        }
        reject(user)
    })
}

export const getNickname = async () => {
    const user = await getUserInfo()

    return user.userInfo.nickname
}

export const getAvatar = async () => {
    const user = await getUserInfo()

    return user.userInfo.avatar
}

export const getUsername = async () => {
    const user = await getUserInfo()

    return user.username
}

export const getUserId = async () => {
    const user = await getUserInfo()

    return user.id
}

export const powerListToPowerTree = (
    modules: ModuleVo[],
    menus: MenuVo[],
    funcs: FuncVo[],
    operations: OperationVo[]
): _DataNode[] => {
    const moduleChildrenMap = new Map<string, _DataNode[]>()
    const menuChildrenMap = new Map<string, _DataNode[]>()
    const funcChildrenMap = new Map<string, _DataNode[]>()

    operations.forEach((operation) => {
        if (funcChildrenMap.get(String(operation.funcId))) {
            funcChildrenMap.get(String(operation.funcId))?.push({
                title: operation.name,
                key: operation.id,
                value: operation.id
            })
        } else {
            funcChildrenMap.set(String(operation.funcId), [
                {
                    title: operation.name,
                    key: operation.id,
                    value: operation.id
                }
            ])
        }
    })

    const funcTrees = parentToTree(
        funcs.map((func) => ({
            title: func.name,
            key: func.id,
            value: func.id,
            parentId: func.parentId,
            children: funcChildrenMap.get(String(func.id))
        }))
    )

    funcTrees.forEach((func) => {
        if (menuChildrenMap.get(String(floorNumber(func.key as number, 5)))) {
            menuChildrenMap.get(String(floorNumber(func.key as number, 5)))?.push(func)
        } else {
            menuChildrenMap.set(String(floorNumber(func.key as number, 5)), [func])
        }
    })

    const menuTrees = parentToTree(
        menus.map((menu) => ({
            title: menu.name,
            key: menu.id,
            value: menu.id,
            parentId: menu.parentId,
            children: menuChildrenMap.get(String(menu.id))
        }))
    )

    menuTrees.forEach((menu) => {
        if (moduleChildrenMap.get(String(floorNumber(menu.key as number, 7)))) {
            moduleChildrenMap.get(String(floorNumber(menu.key as number, 7)))?.push(menu)
        } else {
            moduleChildrenMap.set(String(floorNumber(menu.key as number, 7)), [menu])
        }
    })

    return modules.map((module) =>
        getFullTitle({
            title: module.name,
            key: module.id,
            value: module.id,
            children: moduleChildrenMap.get(String(module.id))
        })
    )
}

const parentToTree = (data: _DataNode[]): _DataNode[] => {
    const parents = data.filter((value) => !value.parentId)
    const children = data.filter((value) => value.parentId)

    const translator = (parents: _DataNode[], children: _DataNode[]) => {
        parents.forEach((parent) => {
            children.forEach((current, index) => {
                if (current.parentId === parent.key) {
                    const temp = _.cloneDeep(children)
                    temp.splice(index, 1)
                    translator([current], temp)
                    typeof parent.children !== 'undefined'
                        ? parent.children.push({ ...current })
                        : (parent.children = [current])
                }
            })
        })
    }

    translator(parents, children)

    return parents
}

export const getPermissionPath = (): string[] => {
    const s = getLocalStorage(STORAGE_USER_INFO_KEY)
    if (s === null) {
        return []
    }

    const user = JSON.parse(s) as UserWithPowerInfoVo
    const paths: string[] = []
    user.menus.forEach((menu) => {
        paths.push(menu.url)
    })

    return paths
}

export const hasPathPermission = (path: string) => {
    let flag = false
    getPermissionPath().forEach((value) => {
        if (RegExp(value).test(path)) {
            flag = true
            return
        }
    })
    return flag
}

export const getPermission = (): string[] => {
    const s = getLocalStorage(STORAGE_USER_INFO_KEY)
    if (s === null) {
        return []
    }

    const user = JSON.parse(s) as UserWithPowerInfoVo
    const operationCodes: string[] = []
    user.operations.forEach((operation) => {
        operationCodes.push(operation.code)
    })

    return operationCodes
}

export const hasPermission = (operationCode: string) => {
    return getPermission().indexOf(operationCode) !== -1
}
