import React from 'react'
import { r_getUserList } from '@/services/user'
import { COLOR_BACKGROUND, DATABASE_SELECT_SUCCESS } from '@/constants/common.constants'
import { ColumnsType } from 'antd/es/table/interface'

const User: React.FC = () => {
    const [userList, setUserList] = useState<UserWithRoleInfoVo[]>([])

    const tableColumns: ColumnsType<UserWithRoleInfoVo> = [
        {
            dataIndex: 'id',
            title: 'ID'
        },
        {
            dataIndex: ['userInfo', 'avatar'],
            title: '头像',
            render: (value) => (
                <AntdAvatar
                    src={<img src={`data:image/png;base64,${value}`} alt={'avatar'} />}
                    style={{ background: COLOR_BACKGROUND }}
                />
            )
        },
        {
            dataIndex: 'username',
            title: '用户名'
        },
        {
            dataIndex: ['userInfo', 'nickname'],
            title: '昵称'
        }
    ]

    useEffect(() => {
        r_getUserList().then((res) => {
            const data = res.data
            if (data.code === DATABASE_SELECT_SUCCESS) {
                data.data && setUserList(data.data)
            }
        })
    }, [])

    return (
        <>
            <AntdTable dataSource={userList} columns={tableColumns} rowKey={'id'} />
        </>
    )
}

export default User
