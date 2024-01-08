import React from 'react'

interface ItemProps {
    readonly?: boolean
    creating?: boolean
    value: string
    active?: boolean
    hasEditing?: boolean
    setHasEditing?: React.Dispatch<React.SetStateAction<boolean>>
    onOk?: (fileName: string) => void
    onCancel?: () => void
    onRemove?: (fileName: string) => void
    onClick?: () => void
    onValidate?: (newFileName: string, oldFileName: string) => boolean
}

const Item: React.FC<ItemProps> = ({
    readonly = false,
    value,
    active = false,
    hasEditing,
    setHasEditing,
    onOk,
    onCancel,
    onRemove,
    onClick,
    onValidate,
    ...prop
}) => {
    const inputRef = useRef<HTMLInputElement>(null)
    const [fileName, setFileName] = useState(value)
    const [creating, setCreating] = useState(prop.creating)

    const handleOnClick = () => {
        if (hasEditing) {
            return
        }

        onClick?.()
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault()
            finishNameFile()
        } else if (event.key === 'Escape') {
            event.preventDefault()
            cancelNameFile()
        }
    }

    const finishNameFile = () => {
        if (!creating || onValidate ? !onValidate?.(fileName, value) : false) {
            inputRef.current?.focus()
            return
        }

        if (fileName === value && active) {
            setCreating(false)
            setHasEditing?.(false)
            return
        }

        onOk?.(fileName)
        setCreating(false)
        setHasEditing?.(false)
    }

    const cancelNameFile = () => {
        setFileName(value)
        setCreating(false)
        setHasEditing?.(false)
        onCancel?.()
    }

    const handleOnDoubleClick = () => {
        if (readonly || creating || hasEditing) {
            return
        }

        setCreating(true)
        setHasEditing?.(true)
        setFileName(value)
        setTimeout(() => {
            inputRef.current?.focus()
        })
    }

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFileName(e.target.value)
    }

    const handleOnDelete = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation()
        if (hasEditing) {
            return
        }
        if (confirm(`确定删除文件 ${value} ？`)) {
            onRemove?.(value)
        }
    }

    useEffect(() => {
        inputRef.current?.focus()
    }, [])

    return (
        <div className={`tab-item${active ? ' active' : ''}`} onClick={handleOnClick}>
            {creating ? (
                <div className={'tab-item-input'}>
                    <input
                        ref={inputRef}
                        value={fileName}
                        onChange={handleOnChange}
                        onBlur={finishNameFile}
                        onKeyDown={handleKeyDown}
                    />
                    <span className={'tab-item-input-mask'}>{fileName}</span>
                </div>
            ) : (
                <>
                    <div onDoubleClick={handleOnDoubleClick}>{value}</div>
                    {!readonly && (
                        <div className={'tab-item-close'} onClick={handleOnDelete}>
                            <IconOxygenClose />
                        </div>
                    )}
                </>
            )}
        </div>
    )
}

export default Item
