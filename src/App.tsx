import React from 'react'
import { getRouter } from '@/router'
import LoadingMask from '@/components/common/LoadingMask'

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
                <Suspense fallback={<LoadingMask />}>
                    <RouterProvider router={routerState} />
                </Suspense>
            </AppContext.Provider>
        </>
    )
}

export default App
