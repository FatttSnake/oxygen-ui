import React from 'react'
import Provider from '@/components/ReactPlayground/Provider.tsx'
import { IPlayground } from '@/components/ReactPlayground/shared.ts'
import Playground from '@/components/ReactPlayground/Playground.tsx'

const ReactPlayground: React.FC<IPlayground> = (props) => {
    return (
        <>
            <Provider saveOnUrl={props.saveOnUrl}>
                <Playground {...props} />
            </Provider>
        </>
    )
}

export default ReactPlayground
