import FitFullscreen from '@/components/common/FitFullscreen'
import Playground from '@/components/Playground'
import { initFiles, initImportMap, initTsconfig } from '@/components/Playground/files'

const OnlineEditor = () => {
    return (
        <>
            <FitFullscreen>
                <Playground
                    initFiles={initFiles}
                    initImportMapRaw={JSON.stringify(initImportMap, null, 2)}
                    initTsconfigRaw={JSON.stringify(initTsconfig, null, 2)}
                />
            </FitFullscreen>
        </>
    )
}

export default OnlineEditor
