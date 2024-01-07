import { strFromU8, strToU8, unzlibSync, zlibSync } from 'fflate'
import { ICustomFiles, IFiles, IImportMap, ITheme } from '@/components/ReactPlayground/shared'
import { IMPORT_MAP_FILE_NAME, reactTemplateFiles } from '@/components/ReactPlayground/files'

export const strToBase64 = (str: string) => {
    const buffer = strToU8(str)
    const zipped = zlibSync(buffer, { level: 9 })
    const binary = strFromU8(zipped, true)
    return btoa(binary)
}

export const base64ToStr = (base64: string) => {
    const binary = atob(base64)

    // zlib header (x78), level 9 (xDA)
    if (binary.startsWith('\x78\xDA')) {
        const buffer = strToU8(binary, true)
        const unzipped = unzlibSync(buffer)
        return strFromU8(unzipped)
    }

    return ''
}

const STORAGE_DARK_THEME = 'react-playground-prefer-dark'

export const setPlaygroundTheme = (theme: ITheme) => {
    localStorage.setItem(STORAGE_DARK_THEME, String(theme === 'vs-dark'))
    document
        .querySelectorAll('div[data-id="react-playground"]')
        ?.forEach((item) => item.setAttribute('class', theme))
}

export const getPlaygroundTheme = () => {
    const isDarkTheme = JSON.parse(localStorage.getItem(STORAGE_DARK_THEME) || 'false')
    return isDarkTheme ? 'vs-dark' : 'light'
}

const transformCustomFiles = (files: ICustomFiles) => {
    const newFiles: IFiles = {}
    Object.keys(files).forEach((key) => {
        const tempFile = files[key]
        if (typeof tempFile === 'string') {
            newFiles[key] = {
                name: key,
                language: fileNameToLanguage(key),
                value: tempFile
            }
        } else {
            newFiles[key] = {
                name: key,
                language: fileNameToLanguage(key),
                value: tempFile.code,
                hidden: tempFile.hidden,
                active: tempFile.active
            }
        }
    })

    return newFiles
}

export const getCustomActiveFile = (files?: ICustomFiles) => {
    if (!files) return null
    return Object.keys(files).find((key) => {
        const tempFile = files[key]
        if (typeof tempFile !== 'string' && tempFile.active) {
            return key
        }
        return null
    })
}

export const getMergedCustomFiles = (files?: ICustomFiles, importMap?: IImportMap) => {
    if (!files) return null
    if (importMap) {
        return {
            ...reactTemplateFiles,
            ...transformCustomFiles(files),
            [IMPORT_MAP_FILE_NAME]: {
                name: IMPORT_MAP_FILE_NAME,
                language: 'json',
                value: JSON.stringify(importMap, null, 2)
            }
        }
    } else {
        return {
            ...reactTemplateFiles,
            ...transformCustomFiles(files)
        }
    }
}

export const getFilesFromUrl = () => {
    let files: IFiles | undefined
    try {
        if (typeof window !== 'undefined') {
            const hash = window.location.hash
            if (hash) files = JSON.parse(base64ToStr(hash?.split('#')[1]))
        }
    } catch (error) {
        console.error(error)
    }
    return files
}

export const fileNameToLanguage = (name: string) => {
    const suffix = name.split('.').pop() || ''
    if (['js', 'jsx'].includes(suffix)) return 'javascript'
    if (['ts', 'tsx'].includes(suffix)) return 'typescript'
    if (['json'].includes(suffix)) return 'json'
    if (['css'].includes(suffix)) return 'css'
    return 'javascript'
}
