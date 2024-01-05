import React from 'react'
import { IFiles, IPlaygroundContext, ITheme } from '@/components/ReactPlayground/shared.ts'
import { MAIN_FILE_NAME } from '@/components/files.ts'
import {
    fileNameToLanguage,
    setPlaygroundTheme,
    strToBase64
} from '@/components/ReactPlayground/Utils.ts'

const initialContext: Partial<IPlaygroundContext> = {
    selectedFileName: MAIN_FILE_NAME
}

export const PlaygroundContext = createContext<IPlaygroundContext>(
    initialContext as IPlaygroundContext
)

interface ProviderProps extends React.PropsWithChildren {
    saveOnUrl?: boolean
}

const Provider: React.FC<ProviderProps> = ({ children, saveOnUrl }) => {
    const [files, setFiles] = useState<IFiles>({})
    const [theme, setTheme] = useState(initialContext.theme!)
    const [selectedFileName, setSelectedFileName] = useState(initialContext.selectedFileName!)
    const [filesHash, setFilesHash] = useState('')

    const addFile = (name: string) => {
        files[name] = {
            name,
            language: fileNameToLanguage(name),
            value: ''
        }
        setFiles({ ...files })
    }

    const removeFile = (name: string) => {
        delete files[name]
        setFiles({ ...files })
    }

    const changeFileName = (oldFileName: string, newFileName: string) => {
        if (!files[oldFileName] || !newFileName) {
            return
        }

        const { [oldFileName]: value, ...other } = files
        const newFile: IFiles = {
            [newFileName]: {
                ...value,
                language: fileNameToLanguage(newFileName),
                name: newFileName
            }
        }
        setFiles({
            ...other,
            ...newFile
        })
    }

    const changeTheme = (theme: ITheme) => {
        setPlaygroundTheme(theme)
        setTheme(theme)
    }

    useEffect(() => {
        const hash = strToBase64(JSON.stringify(files))
        if (saveOnUrl) {
            window.location.hash = hash
        }
        setFilesHash(hash)
    }, [files])

    return (
        <PlaygroundContext.Provider
            value={{
                theme,
                filesHash,
                files,
                selectedFileName,
                setTheme,
                changeTheme,
                setSelectedFileName,
                setFiles,
                addFile,
                removeFile,
                changeFileName
            }}
        >
            {children}
        </PlaygroundContext.Provider>
    )
}

export default Provider
