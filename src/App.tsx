import React from 'react'
import { getRouter } from '@/router'
import FullscreenLoadingMask from '@/components/common/FullscreenLoadingMask'

export const AppContext = createContext<{ refreshRouter: () => void }>({
    refreshRouter: () => undefined
})

const App: React.FC = () => {
    const [routerState, setRouterState] = useState(getRouter)

    return (
        <>
            <AppContext.Provider
                value={{
                    refreshRouter: () => {
                        setRouterState(getRouter())
                    }
                }}
            >
                <Suspense fallback={<FullscreenLoadingMask />}>
                    <RouterProvider router={routerState} />
                </Suspense>
            </AppContext.Provider>
        </>
    )
}

export default App
