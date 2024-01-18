import '@/assets/css/pages/tools/create.scss'
import FlexBox from '@/components/common/FlexBox.tsx'
import Card from '@/components/common/Card.tsx'
import FitFullscreen from '@/components/common/FitFullscreen.tsx'
import Preview from '@/components/Playground/Output/Preview'
import templates from '@/components/Playground/templates.ts'
import { useEffect } from 'react'
import HideScrollbar from '@/components/common/HideScrollbar.tsx'

const Create = () => {
    const [form] = AntdForm.useForm<{
        name: string
        toolId: string
        desc: string
        version: string
        template: string
        private: boolean
        keyword: string[]
        category: string[]
    }>()
    const formValues = AntdForm.useWatch([], form)
    const [template, setTemplate] = useState(templates['demo'])

    useEffect(() => {
        formValues?.template && setTemplate(templates[formValues?.template])
    }, [formValues?.template])

    useEffect(() => {
        const temp: string[] = []
        formValues?.keyword.forEach((item) => {
            if (item.length <= 10) {
                temp.push(item)
            }
        })
        form.setFieldValue('keyword', temp)
    }, [form, formValues?.keyword])

    return (
        <FitFullscreen data-component={'tools-create'}>
            <FlexBox direction={'horizontal'} className={'root-content'}>
                <FlexBox>
                    <Card className={'title'}>
                        <FlexBox>配置</FlexBox>
                    </Card>
                    <Card className={'config'}>
                        <HideScrollbar>
                            <div className={'config-content'}>
                                <AntdForm form={form} layout={'vertical'}>
                                    <AntdForm.Item
                                        label={'名称'}
                                        name={'name'}
                                        rules={[{ required: true }]}
                                    >
                                        <AntdInput
                                            maxLength={20}
                                            showCount
                                            placeholder={'请输入名称'}
                                        />
                                    </AntdForm.Item>
                                    <AntdForm.Item
                                        label={'工具 ID'}
                                        name={'toolId'}
                                        rules={[
                                            { required: true },
                                            {
                                                pattern: /^[a-zA-Z-_][0-9a-zA-Z-_]{2,19}$/,
                                                message:
                                                    '只能包含字母、数字、连字符和下划线，不能以数字开头'
                                            }
                                        ]}
                                    >
                                        <AntdInput
                                            maxLength={20}
                                            showCount
                                            placeholder={'请输入工具 ID'}
                                        />
                                    </AntdForm.Item>
                                    <AntdForm.Item label={'简介'} name={'desc'}>
                                        <AntdInput.TextArea
                                            autoSize={{ minRows: 6, maxRows: 6 }}
                                            maxLength={200}
                                            showCount
                                            placeholder={'请输入简介'}
                                        />
                                    </AntdForm.Item>
                                    <AntdForm.Item
                                        label={'版本'}
                                        name={'version'}
                                        rules={[
                                            { required: true },
                                            {
                                                pattern: /^\d+\.\d+\.\d+$/,
                                                message: `格式必须为 '<数字>.<数字>.<数字>', eg. 1.0.3`
                                            }
                                        ]}
                                    >
                                        <AntdInput
                                            maxLength={10}
                                            showCount
                                            placeholder={'请输入版本'}
                                        />
                                    </AntdForm.Item>
                                    <AntdForm.Item
                                        label={'模板'}
                                        name={'template'}
                                        initialValue={'demo'}
                                        rules={[{ required: true }]}
                                    >
                                        <AntdSelect>
                                            {Object.keys(templates).map((item) => (
                                                <AntdSelect.Option key={item}>
                                                    {templates[item].name}
                                                </AntdSelect.Option>
                                            ))}
                                        </AntdSelect>
                                    </AntdForm.Item>
                                    <AntdForm.Item
                                        label={'访问权限'}
                                        name={'private'}
                                        initialValue={false}
                                    >
                                        <AntdSwitch
                                            checkedChildren={'私有'}
                                            unCheckedChildren={'公开'}
                                        />
                                    </AntdForm.Item>
                                    <AntdForm.Item
                                        label={'关键字'}
                                        tooltip={'工具搜索（每个不超过10个字符）'}
                                        name={'keyword'}
                                        rules={[{ required: true, message: '请输入关键字' }]}
                                    >
                                        <AntdSelect mode={'tags'} maxCount={20} />
                                    </AntdForm.Item>
                                    <AntdForm.Item
                                        label={'类别'}
                                        tooltip={'工具分类'}
                                        name={'category'}
                                        rules={[{ required: true }]}
                                    >
                                        <AntdSelect mode={'multiple'} />
                                    </AntdForm.Item>
                                    <AntdForm.Item>
                                        <AntdButton className={'create-bt'} type={'primary'}>
                                            创建
                                        </AntdButton>
                                    </AntdForm.Item>
                                </AntdForm>
                            </div>
                        </HideScrollbar>
                    </Card>
                </FlexBox>
                <FlexBox>
                    <Card className={'title'}>
                        <FlexBox>预览</FlexBox>
                    </Card>
                    <Card className={'preview'}>
                        <Preview
                            iframeKey={JSON.stringify(template.importMap)}
                            files={template.files}
                            importMap={template.importMap}
                        />
                    </Card>
                </FlexBox>
            </FlexBox>
        </FitFullscreen>
    )
}

export default Create
