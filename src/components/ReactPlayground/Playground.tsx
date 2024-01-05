import React from 'react'
import { IPlayground } from '@/components/ReactPlayground/shared.ts'
import { PlaygroundContext } from '@/components/ReactPlayground/Provider.tsx'
import { ENTRY_FILE_NAME, initFiles, MAIN_FILE_NAME } from '@/components/files.ts'
import {
    getCustomActiveFile,
    getMergedCustomFiles,
    getPlaygroundTheme
} from '@/components/ReactPlayground/Utils.ts'

const defaultCodeSandboxOptions = {
    theme: 'dark',
    editorHeight: '100vh',
    showUrlHash: true
}

const Playground: React.FC<IPlayground> = (props) => {
    const {
        width = '100vw',
        height = '100vh',
        theme,
        files: propsFiles,
        importMap,
        showCompileOutput = true,
        showHeader = true,
        showFileSelector = true,
        fileSelectorReadOnly = false,
        border = false,
        defaultSizes,
        onFilesChange,
        autorun = true
    } = props
    const { filesHash, changeTheme, files, setFiles, setSelectedFileName } =
        useContext(PlaygroundContext)
    const options = Object.assign(defaultCodeSandboxOptions, props.options || {})

    useEffect(() => {
        if (propsFiles && !propsFiles?.[MAIN_FILE_NAME]) {
            throw new Error(
                `Missing required property : '${MAIN_FILE_NAME}' is a mandatory property for 'files'`
            )
        } else if (propsFiles) {
            const newFiles = getMergedCustomFiles(propsFiles, importMap)
            if (newFiles) {
                setFiles(newFiles)
            }
            const selectedFileName = getCustomActiveFile(propsFiles)
            if (selectedFileName) {
                setSelectedFileName(selectedFileName)
            }
        }
    }, [propsFiles])

    useEffect(() => {
        setTimeout(() => {
            if (!theme) {
                changeTheme(getPlaygroundTheme())
            } else {
                changeTheme(theme)
            }
        }, 15)
    }, [theme])

    useEffect(() => {
        if (!propsFiles) {
            setFiles(initFiles)
        }
    }, [])

    return files[ENTRY_FILE_NAME] ? <></> : undefined
}

export default Playground
