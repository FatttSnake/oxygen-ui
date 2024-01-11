import esbuild, { Loader, OnLoadArgs, Plugin, PluginBuild } from 'esbuild-wasm'
import wasm from 'esbuild-wasm/esbuild.wasm?url'
import { IFiles, IImportMap } from '@/components/Playground/shared.ts'
import { cssToJs, ENTRY_FILE_NAME, jsonToJs } from '@/components/Playground/files.ts'
import localforage from 'localforage'
import axios from 'axios'

class Compiler {
    private init = false

    fileCache = localforage.createInstance({
        name: 'fileCache'
    })

    constructor() {
        try {
            void esbuild.initialize({ worker: true, wasmURL: wasm }).then(() => {
                this.init = true
            })
        } catch (e) {
            /* empty */
        }
    }

    transform = (code: string, loader: Loader) =>
        new Promise<void>((resolve) => {
            if (this.init) {
                resolve()
                return
            }
            const timer = setInterval(() => {
                if (this.init) {
                    clearInterval(timer)
                    resolve()
                }
            }, 100)
        }).then(() => {
            return esbuild.transform(code, { loader })
        })

    compile = (files: IFiles, importMap: IImportMap) =>
        new Promise<void>((resolve) => {
            if (this.init) {
                resolve()
                return
            }
            const timer = setInterval(() => {
                if (this.init) {
                    clearInterval(timer)
                    resolve()
                }
            }, 100)
        }).then(() => {
            return esbuild.build({
                bundle: true,
                entryPoints: [ENTRY_FILE_NAME],
                format: 'esm',
                metafile: true,
                write: false,
                plugins: [this.fileResolverPlugin(files, importMap)]
            })
        })

    stop = () => {
        esbuild.stop()
    }

    private fileResolverPlugin = (files: IFiles, importMap: IImportMap): Plugin => {
        return {
            name: 'file-resolver-plugin',
            setup: (build: PluginBuild) => {
                build.onResolve({ filter: /.*/ }, async (args: esbuild.OnResolveArgs) => {
                    if (args.path === ENTRY_FILE_NAME) {
                        return {
                            namespace: 'OxygenToolbox',
                            path: args.path
                        }
                    }
                    if (args.path.startsWith('./') && files[args.path.substring(2)]) {
                        return {
                            namespace: 'OxygenToolbox',
                            path: args.path.substring(2)
                        }
                    }
                    if (args.path.startsWith('./') && files[`${args.path.substring(2)}.tsx`]) {
                        return {
                            namespace: 'OxygenToolbox',
                            path: `${args.path.substring(2)}.tsx`
                        }
                    }
                    if (args.path.startsWith('./') && files[`${args.path.substring(2)}.jsx`]) {
                        return {
                            namespace: 'OxygenToolbox',
                            path: `${args.path.substring(2)}.jsx`
                        }
                    }
                    if (args.path.startsWith('./') && files[`${args.path.substring(2)}.ts`]) {
                        return {
                            namespace: 'OxygenToolbox',
                            path: `${args.path.substring(2)}.ts`
                        }
                    }
                    if (args.path.startsWith('./') && files[`${args.path.substring(2)}.js`]) {
                        return {
                            namespace: 'OxygenToolbox',
                            path: `${args.path.substring(2)}.js`
                        }
                    }

                    const path = importMap.imports[args.path]

                    if (!path) {
                        throw Error(`Import '${args.path}' not found in Import Map`)
                    }

                    return {
                        namespace: 'default',
                        path
                    }
                })

                build.onLoad({ filter: /.*\.css$/ }, async (args: OnLoadArgs) => {
                    const contents = cssToJs(files[args.path])
                    return {
                        loader: 'js',
                        contents
                    }
                })

                build.onLoad({ filter: /.*\.json$/ }, async (args: OnLoadArgs) => {
                    const contents = jsonToJs(files[args.path])
                    return {
                        loader: 'js',
                        contents
                    }
                })

                build.onLoad({ filter: /.*\.svg$/ }, async (args: OnLoadArgs) => {
                    const contents = files[args.path].value
                    return {
                        loader: 'text',
                        contents
                    }
                })

                build.onLoad({ filter: /.*/ }, async (args: OnLoadArgs) => {
                    if (args.path === ENTRY_FILE_NAME) {
                        return {
                            loader: 'tsx',
                            contents: files[ENTRY_FILE_NAME].value
                        }
                    }

                    if (files[args.path]) {
                        const contents = files[args.path].value
                        if (args.path.endsWith('.jsx')) {
                            return {
                                loader: 'jsx',
                                contents
                            }
                        }
                        if (args.path.endsWith('.ts')) {
                            return {
                                loader: 'ts',
                                contents
                            }
                        }
                        if (args.path.endsWith('.js')) {
                            return {
                                loader: 'js',
                                contents
                            }
                        }
                        return {
                            loader: 'tsx',
                            contents
                        }
                    }

                    const cached = await this.fileCache.getItem<esbuild.OnLoadResult>(args.path)

                    if (cached) {
                        return cached
                    }

                    const { data, request } = await axios.get(args.path)
                    const result: esbuild.OnLoadResult = {
                        loader: 'jsx',
                        contents: data,
                        resolveDir: new URL('./', request.responseURL).pathname
                    }

                    await this.fileCache.setItem(args.path, request)

                    return result
                })
            }
        }
    }
}

export default Compiler
