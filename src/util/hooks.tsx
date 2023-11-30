import React from 'react'

export const useUpdatedEffect = (
    effect: React.EffectCallback,
    dependencies: React.DependencyList
) => {
    const isFirstRender = useRef(true)

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false
        } else {
            effect()
        }
    }, dependencies)
}
