import { r_sys_statistics_hardware } from '@/services/system'
import FlexBox from '@/components/common/FlexBox'
import { CommonCard } from '@/pages/System/Statistics'

const HardwareInfo = () => {
    const [hardwareInfoData, setHardwareInfoData] = useState<HardwareInfoVo>()

    useEffect(() => {
        void r_sys_statistics_hardware().then((res) => {
            const response = res.data
            if (response.success) {
                response.data && setHardwareInfoData(response.data)
            } else {
                void message.error('获取硬件信息失败，请稍后重试')
            }
        })
    }, [])

    return (
        <CommonCard
            icon={IconOxygenHardware}
            title={'硬件信息'}
            loading={hardwareInfoData === undefined}
        >
            <FlexBox className={'card-content'} direction={'horizontal'}>
                <FlexBox className={'key'}>
                    <div>CPU</div>
                    <div>CPU 架构</div>
                    <div>微架构</div>
                    <div>64位</div>
                    <div>物理 CPU</div>
                    <div>物理核心</div>
                    <div>逻辑核心</div>
                    <div>内存</div>
                    <div>磁盘</div>
                </FlexBox>
                <FlexBox className={'value'}>
                    <div title={hardwareInfoData?.cpu}>{hardwareInfoData?.cpu}</div>
                    <div title={hardwareInfoData?.arch}>{hardwareInfoData?.arch}</div>
                    <div title={hardwareInfoData?.microarchitecture}>
                        {hardwareInfoData?.microarchitecture}
                    </div>
                    <div title={hardwareInfoData?.is64Bit ? '是' : '否'}>
                        {hardwareInfoData?.is64Bit ? '是' : '否'}
                    </div>
                    <div title={hardwareInfoData?.cpuPhysicalPackageCount.toString()}>
                        {hardwareInfoData?.cpuPhysicalPackageCount}
                    </div>
                    <div title={hardwareInfoData?.cpuPhysicalProcessorCount.toString()}>
                        {hardwareInfoData?.cpuPhysicalProcessorCount}
                    </div>
                    <div title={hardwareInfoData?.cpuLogicalProcessorCount.toString()}>
                        {hardwareInfoData?.cpuLogicalProcessorCount}
                    </div>
                    <div title={hardwareInfoData?.memories}>{hardwareInfoData?.memories}</div>
                    <div title={hardwareInfoData?.disks}>{hardwareInfoData?.disks}</div>
                </FlexBox>
            </FlexBox>
        </CommonCard>
    )
}

export default HardwareInfo