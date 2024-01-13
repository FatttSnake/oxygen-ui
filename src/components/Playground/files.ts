import { strFromU8, strToU8, unzlibSync, zlibSync } from 'fflate'
import { IFile, IFiles, IImportMap, ILanguage, ITsConfig } from '@/components/Playground/shared'
import AppCss from '@/components/Playground/template/src/App.css?raw'
import App from '@/components/Playground/template/src/App.tsx?raw'
import main from '@/components/Playground/template/src/main.tsx?raw'
import tsconfigSchema from '@/components/Playground/tsconfig-schema.json'
import importMapSchema from '@/components/Playground/import-map-schema.json'
import { languages } from 'monaco-editor'
import DiagnosticsOptions = languages.json.DiagnosticsOptions
import ScriptTarget = languages.typescript.ScriptTarget
import ModuleKind = languages.typescript.ModuleKind
import ModuleResolutionKind = languages.typescript.ModuleResolutionKind
import JsxEmit = languages.typescript.JsxEmit

export const TS_CONFIG_FILE_NAME = 'tsconfig.json'
export const MAIN_FILE_NAME = 'App.tsx'
export const IMPORT_MAP_FILE_NAME = 'import-map.json'
export const ENTRY_FILE_NAME = 'main.tsx'

export const getFileNameList = (files: IFiles) => Object.keys(files)

export const fileNameToLanguage = (name: string): ILanguage => {
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
        const realModuleName = getFileNameList(files).find((key) =>
            key.split('.').includes(_moduleName)
        )
        if (realModuleName) _moduleName = realModuleName
    }
    return files[_moduleName]
}

export const jsToBlob = (code: string) => {
    return URL.createObjectURL(new Blob([code], { type: 'application/javascript' }))
}

export const jsonToJs = (file: IFile) => {
    return `export default ${file.value}`
}

export const cssToJs = (file: IFile) => {
    const randomId = new Date().getTime()
    return `(() => {
  let stylesheet = document.getElementById('style_${randomId}_${file.name}');
  if (!stylesheet) {
    stylesheet = document.createElement('style')
    stylesheet.setAttribute('id', 'style_${randomId}_${file.name}')
    document.head.appendChild(stylesheet)
  }
  const styles = document.createTextNode(
\`${file.value}\`
    )
  stylesheet.innerHTML = ''
  stylesheet.appendChild(styles)
})()
`
}

export const addReactImport = (code: string) => {
    if (!/import\s+React/g.test(code)) {
        return `import React from 'react';\n${code}`
    }
    return code
}

export const tsconfigJsonDiagnosticsOptions: DiagnosticsOptions = {
    validate: true,
    schemas: [
        {
            uri: 'tsconfig.json',
            fileMatch: ['tsconfig.json'],
            schema: {
                type: 'object',
                properties: tsconfigSchema
            }
        },
        {
            uri: 'import-map.json',
            fileMatch: ['import-map.json'],
            schema: {
                type: 'object',
                properties: importMapSchema
            }
        }
    ]
}

export const initFiles: IFiles = getFilesFromUrl() || {
    [ENTRY_FILE_NAME]: {
        name: ENTRY_FILE_NAME,
        language: fileNameToLanguage(ENTRY_FILE_NAME),
        value: main,
        hidden: true
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
    }
}

export const initImportMap: IImportMap = {
    imports: {
        react: 'https://esm.sh/react@18.2.0',
        'react-dom/client': 'https://esm.sh/react-dom@18.2.0'
    }
}

export const initTsConfig: ITsConfig = {
    compilerOptions: {
        target: ScriptTarget.ES2020,
        useDefineForClassFields: true,
        module: ModuleKind.ESNext,
        skipLibCheck: true,
        moduleResolution: ModuleResolutionKind.NodeJs,
        allowImportingTsExtensions: true,
        resolveJsonModule: true,
        isolatedModules: true,
        noEmit: true,
        jsx: JsxEmit.ReactJSX,
        strict: true,
        noUnusedLocals: true,
        noUnusedParameters: true,
        noFallthroughCasesInSwitch: true,
        composite: true,
        types: ['node'],
        allowSyntheticDefaultImports: true
    }
}
