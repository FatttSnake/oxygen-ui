import React, { useState } from 'react'
import FitFullScreen from '@/components/common/FitFullScreen.tsx'
import Card from '@/components/common/Card'
import { r_getSysLog } from '@/services/system.tsx'
import { DATABASE_SELECT_SUCCESS } from '@/constants/common.constants.ts'

const Log: React.FC = () => {
    const [logList, setLogList] = useState<SysLogGetVo[]>([])

    const getLog = () => {
        r_getSysLog().then((res) => {
            const data = res.data
            if (data.code === DATABASE_SELECT_SUCCESS) {
                data.data && setLogList(data.data)
            }
        })
    }

    useEffect(() => {
        getLog()
    }, [])

    return (
        <>
            <FitFullScreen style={{ padding: '20px' }}>
                <Card>
                    <AntdTable dataSource={logList} />
                </Card>
            </FitFullScreen>
        </>
    )
}

export default Log
