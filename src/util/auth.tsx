import _ from 'lodash'
import {
    STORAGE_TOKEN_KEY,
    STORAGE_USER_INFO_KEY,
    DATABASE_SELECT_SUCCESS
} from '@/constants/common.constants'
import { floorNumber, randomColor, randomFloat, randomInt } from '@/util/common'
import { getLocalStorage, removeLocalStorage, setLocalStorage } from '@/util/browser'
import { getFullTitle } from '@/util/route'
import { r_sys_user_info } from '@/services/system'
import { r_auth_login, r_auth_logout } from '@/services/auth'

let captcha: Captcha

export const setToken = (token: string) => {
    setLocalStorage(STORAGE_TOKEN_KEY, token)
}

export const removeToken = () => {
    removeLocalStorage(STORAGE_USER_INFO_KEY)
    removeLocalStorage(STORAGE_TOKEN_KEY)
}

export const getToken = () => {
    return getLocalStorage(STORAGE_TOKEN_KEY)
}

export const getCaptcha = (width: number, high: number, num: number) => {
    const CHARTS = '23456789ABCDEFGHJKLMNPRSTUVWXYZabcdefghijklmnpqrstuvwxyz'.split('')

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D

    ctx.rect(0, 0, width, high)
    ctx.clip()

    ctx.fillStyle = randomColor(200, 250)
    ctx.fillRect(0, 0, width, high)

    for (let i = 0.05 * width * high; i > 0; i--) {
        ctx.fillStyle = randomColor(0, 256)
        ctx.fillRect(randomInt(0, width), randomInt(0, high), 1, 1)
    }

    ctx.font = `${high - 4}px Consolas`
    ctx.fillStyle = randomColor(160, 200)
    let value = ''
    for (let i = 0; i < num; i++) {
        const x = ((width - 10) / num) * i + 5
        const y = high - 12
        const r = Math.PI * randomFloat(-0.12, 0.12)
        const ch = CHARTS[randomInt(0, CHARTS.length)]
        value += ch
        ctx.translate(x, y)
        ctx.rotate(r)
        ctx.fillText(ch, 0, 0)
        ctx.rotate(-r)
        ctx.translate(-x, -y)
    }

    const base64Src = canvas.toDataURL('image/jpg')
    return {
        value,
        base64Src
    }
}

export const login = async (username: string, password: string) => {
    return await r_auth_login(username, password)
}

export const logout = async () => {
    return r_auth_logout().finally(() => {
        removeToken()
    })
}

export const getLoginStatus = () => {
    return getLocalStorage(STORAGE_TOKEN_KEY) !== null
}

export const getUserInfo = async (): Promise<UserWithPowerInfoVo> => {
    if (getLocalStorage(STORAGE_USER_INFO_KEY) !== null) {
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

    await r_sys_user_info().then((value) => {
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

export const getUsername = async () => {
    const user = await getUserInfo()

    return user.username
}

export const getCaptchaSrc = () => {
    captcha = getCaptcha(300, 150, 4)
    return captcha.base64Src
}

export const verifyCaptcha = (value: string) => {
    return captcha.value.toLowerCase() === value.replace(/\s*/g, '').toLowerCase()
}

export const powerListToPowerTree = (
    modules: ModuleVo[],
    menus: MenuVo[],
    elements: ElementVo[],
    operations: OperationVo[]
): _DataNode[] => {
    const moduleChildrenMap = new Map<string, _DataNode[]>()
    const menuChildrenMap = new Map<string, _DataNode[]>()
    const elementChildrenMap = new Map<string, _DataNode[]>()

    operations.forEach((operation) => {
        if (elementChildrenMap.get(String(operation.elementId))) {
            elementChildrenMap.get(String(operation.elementId))?.push({
                title: operation.name,
                key: operation.id,
                value: operation.id
            })
        } else {
            elementChildrenMap.set(String(operation.elementId), [
                {
                    title: operation.name,
                    key: operation.id,
                    value: operation.id
                }
            ])
        }
    })

    const elementTrees = parentToTree(
        elements.map((element) => ({
            title: element.name,
            key: element.id,
            value: element.id,
            parentId: element.parentId,
            children: elementChildrenMap.get(String(element.id))
        }))
    )

    elementTrees.forEach((element) => {
        if (menuChildrenMap.get(String(floorNumber(element.key as number, 5)))) {
            menuChildrenMap.get(String(floorNumber(element.key as number, 5)))?.push(element)
        } else {
            menuChildrenMap.set(String(floorNumber(element.key as number, 5)), [element])
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
