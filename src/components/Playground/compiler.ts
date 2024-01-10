import esbuild, { Loader } from 'esbuild-wasm'
import wasm from 'esbuild-wasm/esbuild.wasm?url'

class Compiler {
    private init = false

    constructor() {
        try {
            void esbuild.initialize({ worker: true, wasmURL: wasm }).then(() => {
                this.init = true
            })
        } catch (e) {
            throw e
        }
    }

    transform = (code: string, loader: Loader) =>
        new Promise<boolean>((resolve) => {
            const timer = setInterval(() => {
                if (this.init) {
                    clearInterval(timer)
                    resolve(true)
                }
            }, 100)
        }).then(() => {
            return esbuild.transform(code, { loader })
        })
}

export default Compiler
