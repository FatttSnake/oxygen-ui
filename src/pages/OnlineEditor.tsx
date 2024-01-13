import React from 'react'
import FitFullscreen from '@/components/common/FitFullscreen'
import Playground from '@/components/Playground'
import { initFiles, initImportMap, initTsConfig } from '@/components/Playground/files'

const OnlineEditor: React.FC = () => {
    return (
        <>
            <FitFullscreen>
                <Playground
                    initFiles={initFiles}
                    initImportMapRaw={JSON.stringify(initImportMap, null, 2)}
                    initTsConfigRaw={JSON.stringify(initTsConfig, null, 2)}
                />
            </FitFullscreen>
        </>
    )
}

export default OnlineEditor
