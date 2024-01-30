import { r_tool_detail } from '@/services/tool.tsx'
import { DATABASE_NO_RECORD_FOUND, DATABASE_SELECT_SUCCESS } from '@/constants/common.constants.ts'
import { getLoginStatus } from '@/util/auth.tsx'

const View = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const { username, toolId, ver } = useParams()

    const getTool = () => {
        if (loading) {
            return
        }
        setLoading(true)
        void message.loading({ content: '加载中……', key: 'LOADING', duration: 0 })

        void r_tool_detail(username!, toolId!, ver || 'latest')
            .then((res) => {
                const response = res.data
                switch (response.code) {
                    case DATABASE_SELECT_SUCCESS:
                        console.log(response.data)
                        break
                    case DATABASE_NO_RECORD_FOUND:
                        void message.error('未找到指定工具')
                        navigate('/')
                        break
                    default:
                        void message.error('获取工具信息失败，请稍后重试')
                }
            })
            .finally(() => {
                setLoading(false)
                message.destroy('LOADING')
            })
    }

    useEffect(() => {
        if (username === '!' && !getLoginStatus()) {
            navigate('/')
            return
        }
        if (username !== '!' && ver) {
            navigate(`/view/${username}/${toolId}`)
            return
        }
        if (username === '!' && !ver) {
            navigate(`/view/!/${toolId}/latest`)
            return
        }
        getTool()
    }, [])

    return (
        <>
            {username}:{toolId}:{ver}
        </>
    )
}

export default View
