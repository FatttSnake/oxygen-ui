import React from 'react'
import '@/components/ReactPlayground/CodeEditor/FileSelector/file-selector.scss'
import { IFiles } from '@/components/ReactPlayground/shared.ts'
import {
    ENTRY_FILE_NAME,
    IMPORT_MAP_FILE_NAME,
    MAIN_FILE_NAME
} from '@/components/ReactPlayground/files.ts'
import Item from '@/components/ReactPlayground/CodeEditor/FileSelector/Item.tsx'

interface FileSelectorProps {
    files?: IFiles
    onChange?: (fileName: string) => void
    onError?: (msg: string) => void
    readonly?: boolean
    readonlyFiles?: string[]
    onRemoveFile?: (fileName: string) => void
    onAddFile?: (fileName: string) => void
    onUpdateFileName?: (newFileName: string, oldFileName: string) => void
    selectedFileName?: string
}

const FileSelector: React.FC<FileSelectorProps> = ({
    files = {},
    onChange,
    onError,
    readonly = false,
    readonlyFiles = [],
    onRemoveFile,
    onAddFile,
    onUpdateFileName,
    selectedFileName = ''
}) => {
    const [tabs, setTabs] = useState<string[]>([])
    const [creating, setCreating] = useState(false)

    const getMaxSequenceTabName = (filesName: string[]) => {
        const result = filesName.reduce((max, filesName) => {
            const match = filesName.match(/Component(\d+)\.tsx/)
            if (match) {
                const sequenceNumber = parseInt(match[1], 10)
                return Math.max(Number(max), sequenceNumber)
            }
            return max
        }, 0)

        return `Component${result + 1}.tsx`
    }

    const addTab = () => {
        setTabs([...tabs, getMaxSequenceTabName(tabs)])
        setCreating(true)
    }

    const handleOnCancel = () => {
        if (!creating) {
            return
        }

        tabs.pop()
        setTabs([...tabs])
        setCreating(false)
    }

    const handleOnClickTab = (fileName: string) => {
        if (creating) {
            return
        }

        onChange?.(fileName)
    }

    const editImportMap = () => {
        onChange?.(IMPORT_MAP_FILE_NAME)
    }

    const handleOnSaveTab = (value: string, item: string) => {
        if (creating) {
            onAddFile?.(value)
            setCreating(false)
        } else {
            onUpdateFileName?.(item, value)
        }

        setTimeout(() => {
            handleOnClickTab(value)
        })
    }

    const handleOnValidateTab = (newFileName: string, oldFileName: string) => {
        if (!/\.(jsx|tsx|js|ts|css|json|svg)$/.test(newFileName)) {
            onError?.(
                'Playground only supports *.jsx, *.tsx, *.js, *.ts, *.css, *.json, *.svg files.'
            )

            return false
        }

        if (tabs.includes(newFileName) && newFileName !== oldFileName) {
            onError?.(`File "${newFileName}" already exists.`)
            return false
        }

        return true
    }

    const handleOnRemove = (fileName: string) => {
        onRemoveFile?.(fileName)
        handleOnClickTab(Object.keys(files)[Object.keys(files).length - 1])
    }

    useEffect(() => {
        Object.keys(files).length &&
            setTabs(
                Object.keys(files).filter(
                    (item) =>
                        ![IMPORT_MAP_FILE_NAME, ENTRY_FILE_NAME].includes(item) &&
                        !files[item].hidden
                )
            )
    }, [files])

    return (
        <>
            <div
                data-component={'playground-file-selector'}
                className={'tab'}
                style={{ flex: '0 0 auto' }}
            >
                {tabs.map((item, index) => (
                    <Item
                        key={index + item}
                        value={item}
                        active={selectedFileName == item}
                        creating={creating}
                        readonly={
                            readonly || readonlyFiles.includes(item) || MAIN_FILE_NAME == item
                        }
                        onValidate={handleOnValidateTab}
                        onOk={(name) => handleOnSaveTab(name, item)}
                        onCancel={handleOnCancel}
                        onRemove={handleOnRemove}
                        onClick={() => handleOnClickTab(item)}
                    />
                ))}
            </div>
        </>
    )
}

export default FileSelector
