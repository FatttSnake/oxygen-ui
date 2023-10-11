import React from 'react'
import router from '@/router'
import LoadingMask from '@/components/common/LoadingMask'

const App: React.FC = () => {
    return (
        <>
            <Suspense fallback={<LoadingMask />}>
                <RouterProvider router={router} />
            </Suspense>
        </>
    )
}

export default App
