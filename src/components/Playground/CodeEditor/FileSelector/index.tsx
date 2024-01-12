import React from 'react'
import '@/components/Playground/CodeEditor/FileSelector/file-selector.scss'
import { IFiles } from '@/components/Playground/shared'
import {
    ENTRY_FILE_NAME,
    getFileNameList,
    IMPORT_MAP_FILE_NAME
} from '@/components/Playground/files'
import Item from '@/components/Playground/CodeEditor/FileSelector/Item'
import HideScrollbar, { HideScrollbarElement } from '@/components/common/HideScrollbar'
import FlexBox from '@/components/common/FlexBox'

interface FileSelectorProps {
    files?: IFiles
    onChange?: (fileName: string) => void
    onError?: (msg: string) => void
    readonly?: boolean
    notRemovableFiles?: string[]
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
    notRemovableFiles = [],
    onRemoveFile,
    onAddFile,
    onUpdateFileName,
    selectedFileName = ''
}) => {
    const hideScrollbarRef = useRef<HideScrollbarElement>(null)
    const [tabs, setTabs] = useState<string[]>([])
    const [creating, setCreating] = useState(false)
    const [hasEditing, setHasEditing] = useState(false)

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
        if (hasEditing) {
            return
        }

        setTabs([...tabs, getMaxSequenceTabName(tabs)])
        setCreating(true)
        setTimeout(() => {
            hideScrollbarRef.current?.scrollRight(1000)
        })
    }

    const handleOnCancel = () => {
        onError?.('')
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
        if (hasEditing) {
            return
        }

        onChange?.(IMPORT_MAP_FILE_NAME)
    }

    const handleOnSaveTab = (value: string, item: string) => {
        if (creating) {
            onAddFile?.(value)
            setCreating(false)
        } else {
            onUpdateFileName?.(value, item)
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

        if (
            tabs.map((item) => item.toLowerCase()).includes(newFileName.toLowerCase()) &&
            newFileName.toLowerCase() !== oldFileName.toLowerCase()
        ) {
            onError?.(`File "${newFileName}" already exists.`)
            return false
        }

        onError?.('')

        return true
    }

    const handleOnRemove = (fileName: string) => {
        onRemoveFile?.(fileName)
        if (fileName === selectedFileName) {
            const keys = getFileNameList(files).filter(
                (item) =>
                    ![IMPORT_MAP_FILE_NAME, ENTRY_FILE_NAME].includes(item) && !files[item].hidden
            )
            const index = keys.indexOf(fileName) - 1
            if (index >= 0) {
                handleOnClickTab(keys[index])
            } else {
                handleOnClickTab(keys[1])
            }
        }
    }

    useEffect(() => {
        getFileNameList(files).length
            ? setTabs(
                  getFileNameList(files).filter(
                      (item) =>
                          ![IMPORT_MAP_FILE_NAME, ENTRY_FILE_NAME].includes(item) &&
                          !files[item].hidden
                  )
              )
            : setTabs([])
    }, [files])

    return (
        <>
            <div data-component={'playground-file-selector'} className={'tab'}>
                <div className={'multiple'}>
                    <HideScrollbar ref={hideScrollbarRef}>
                        <FlexBox direction={'horizontal'} className={'tab-content'}>
                            {tabs.map((item, index) => (
                                <Item
                                    key={index + item}
                                    value={item}
                                    active={selectedFileName === item}
                                    creating={creating}
                                    readonly={readonly || notRemovableFiles.includes(item)}
                                    hasEditing={hasEditing}
                                    setHasEditing={setHasEditing}
                                    onValidate={handleOnValidateTab}
                                    onOk={(name) => handleOnSaveTab(name, item)}
                                    onCancel={handleOnCancel}
                                    onRemove={handleOnRemove}
                                    onClick={() => handleOnClickTab(item)}
                                />
                            ))}
                            {!readonly && (
                                <Item
                                    className={'tab-item-add'}
                                    value={'+'}
                                    onClick={addTab}
                                    readonly
                                />
                            )}
                            <div className={'tabs-margin-right'}>
                                <div />
                            </div>
                        </FlexBox>
                    </HideScrollbar>
                </div>
                {files[IMPORT_MAP_FILE_NAME] && (
                    <div className={'sticky'}>
                        <Item
                            value={'Import Map'}
                            active={selectedFileName === IMPORT_MAP_FILE_NAME}
                            onClick={editImportMap}
                            readonly
                        />
                    </div>
                )}
            </div>
        </>
    )
}

export default FileSelector
