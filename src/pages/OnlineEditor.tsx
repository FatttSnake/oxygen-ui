import React from 'react'
import FitFullscreen from '@/components/common/FitFullscreen'
import Playground from '@/components/Playground'
import { initFiles, initImportMap } from '@/components/Playground/files.ts'

const OnlineEditor: React.FC = () => {
    return (
        <>
            <FitFullscreen>
                <Playground initFiles={initFiles} initImportMap={initImportMap} />
            </FitFullscreen>
        </>
    )
}

export default OnlineEditor
