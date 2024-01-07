import { ATABootstrapConfig, setupTypeAcquisition } from '@typescript/ata'

type DelegateListener = Required<{
    [k in keyof ATABootstrapConfig['delegate']]: Set<NonNullable<ATABootstrapConfig['delegate'][k]>>
}>

const createDelegate = (): DelegateListener => {
    return {
        receivedFile: new Set(),
        progress: new Set(),
        errorMessage: new Set(),
        finished: new Set(),
        started: new Set()
    }
}

const delegateListener = createDelegate()

type InferSet<T> = T extends Set<infer U> ? U : never

export const createATA = async () => {
    // @ts-ignore
    const ts = await import('https://esm.sh/typescript@5.3.3')
    const ata = setupTypeAcquisition({
        projectName: 'monaco-ts',
        typescript: ts,
        logger: console,
        fetcher: (input, init) => {
            let result: any
            try {
                result = fetch(input, init)
            } catch (error) {
                console.error('Error fetching data:', error)
            }
            return result
        },
        delegate: {
            receivedFile: (code, path) => {
                delegateListener.receivedFile.forEach((fn) => fn(code, path))
            },
            progress: (downloaded, estimatedTotal) => {
                delegateListener.progress.forEach((fn) => fn(downloaded, estimatedTotal))
            },
            started: () => {
                delegateListener.started.forEach((fn) => fn())
            },
            finished: (files) => {
                delegateListener.finished.forEach((fn) => fn(files))
            }
        }
    })

    const acquireType = (code: string) => ata(code)

    const addListener = <T extends keyof DelegateListener>(
        event: T,
        handler: InferSet<DelegateListener[T]>
    ) => {
        // @ts-ignore
        delegateListener[event].add(handler)
    }

    const removeListener = <T extends keyof DelegateListener>(
        event: T,
        handler: InferSet<DelegateListener[T]>
    ) => {
        // @ts-ignore
        delegateListener[event].delete(handler)
    }

    const dispose = () => {
        for (const key in delegateListener) {
            delegateListener[key as keyof DelegateListener].clear()
        }
    }

    return {
        acquireType,
        addListener,
        removeListener,
        dispose
    }
}
