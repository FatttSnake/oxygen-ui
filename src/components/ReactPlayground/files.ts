import importMap from '@/components/ReactPlayground/template/import-map.json?raw'
import AppCss from '@/components/ReactPlayground/template/src/App.css?raw'
import App from '@/components/ReactPlayground/template/src/App.tsx?raw'
import main from '@/components/ReactPlayground/template/src/main.tsx?raw'
import { IFiles } from '@/components/ReactPlayground/shared'
import { base64ToStr } from '@/components/ReactPlayground/utils.ts'

export const MAIN_FILE_NAME = 'App.tsx'
export const IMPORT_MAP_FILE_NAME = 'import-map.json'
export const ENTRY_FILE_NAME = 'main.tsx'

const fileNameToLanguage = (name: string) => {
    const suffix = name.split('.').pop() || ''
    if (['js', 'jsx'].includes(suffix)) return 'javascript'
    if (['ts', 'tsx'].includes(suffix)) return 'typescript'
    if (['json'].includes(suffix)) return 'json'
    if (['css'].includes(suffix)) return 'css'
    return 'javascript'
}

const getFilesFromUrl = () => {
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

export const initFiles: IFiles = getFilesFromUrl() || {
    [ENTRY_FILE_NAME]: {
        name: ENTRY_FILE_NAME,
        language: fileNameToLanguage(ENTRY_FILE_NAME),
        value: main
    },
    [MAIN_FILE_NAME]: {
        name: MAIN_FILE_NAME,
        language: fileNameToLanguage(MAIN_FILE_NAME),
        value: App
    },
    'App.css': {
        name: 'App.css',
        language: 'css',
        value: AppCss
    },
    [IMPORT_MAP_FILE_NAME]: {
        name: IMPORT_MAP_FILE_NAME,
        language: fileNameToLanguage(IMPORT_MAP_FILE_NAME),
        value: importMap
    }
}

export const reactTemplateFiles = {
    [ENTRY_FILE_NAME]: {
        name: ENTRY_FILE_NAME,
        language: fileNameToLanguage(ENTRY_FILE_NAME),
        value: main
    },
    [IMPORT_MAP_FILE_NAME]: {
        name: IMPORT_MAP_FILE_NAME,
        language: fileNameToLanguage(IMPORT_MAP_FILE_NAME),
        value: importMap
    }
}
