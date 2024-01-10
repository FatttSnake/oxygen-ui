import { strFromU8, strToU8, unzlibSync, zlibSync } from 'fflate'
import importMap from '@/components/Playground/template/import-map.json?raw'
import AppCss from '@/components/Playground/template/src/App.css?raw'
import App from '@/components/Playground/template/src/App.tsx?raw'
import main from '@/components/Playground/template/src/main.tsx?raw'
import { IFile, IFiles } from '@/components/Playground/shared'

export const MAIN_FILE_NAME = 'App.tsx'
export const IMPORT_MAP_FILE_NAME = 'import-map.json'
export const ENTRY_FILE_NAME = 'main.tsx'

export const fileNameToLanguage = (name: string) => {
    const suffix = name.split('.').pop() || ''
    if (['js', 'jsx'].includes(suffix)) return 'javascript'
    if (['ts', 'tsx'].includes(suffix)) return 'typescript'
    if (['json'].includes(suffix)) return 'json'
    if (['css'].includes(suffix)) return 'css'
    return 'javascript'
}

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

export const getFilesFromUrl = () => {
    let files: IFiles | undefined
    try {
        if (typeof window !== 'undefined') {
            const hash = window.location.hash
            if (hash) files = JSON.parse(base64ToStr(hash?.split('#')[1])) as IFiles
        }
    } catch (error) {
        console.error(error)
    }
    return files
}

export const getModuleFile = (files: IFiles, moduleName: string) => {
    let _moduleName = moduleName.split('./').pop() || ''
    if (!_moduleName.includes('.')) {
        const realModuleName = Object.keys(files).find((key) =>
            key.split('.').includes(_moduleName)
        )
        if (realModuleName) _moduleName = realModuleName
    }
    return files[_moduleName]
}

export const jsonToJs = (file: IFile) => {
    const js = `export default ${file.value}`
    return URL.createObjectURL(new Blob([js], { type: 'application/javascript' }))
}

export const cssToJs = (file: IFile) => {
    const randomId = new Date().getTime()
    const js = `
                  (() => {
                    let stylesheet = document.getElementById('style_${randomId}_${file.name}');
                    if (!stylesheet) {
                      stylesheet = document.createElement('style')
                      stylesheet.setAttribute('id', 'style_${randomId}_${file.name}')
                      document.head.appendChild(stylesheet)
                    }
                    const styles = document.createTextNode(\`${file.value}\`)
                    stylesheet.innerHTML = ''
                    stylesheet.appendChild(styles)
                  })()
                  `
    return URL.createObjectURL(new Blob([js], { type: 'application/javascript' }))
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
