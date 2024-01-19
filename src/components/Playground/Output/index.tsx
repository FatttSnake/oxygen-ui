import FlexBox from '@/components/common/FlexBox'
import { IFiles, IImportMap } from '@/components/Playground/shared'
import FileSelector from '@/components/Playground/CodeEditor/FileSelector'
import Transform from '@/components/Playground/Output/Transform'
import Preview from '@/components/Playground/Output/Preview'

interface OutputProps {
    files: IFiles
    selectedFileName: string
    importMap: IImportMap
}

const Output = ({ files, selectedFileName, importMap }: OutputProps) => {
    const [selectedTab, setSelectedTab] = useState('Preview')

    return (
        <FlexBox data-component={'playground-code-output'}>
            <FileSelector
                files={{
                    Preview: { name: 'Preview', language: 'json', value: '' },
                    Transform: { name: 'Transform', language: 'json', value: '' }
                }}
                selectedFileName={selectedTab}
                onChange={(tabName) => setSelectedTab(tabName)}
                readonly
            />
            {selectedTab === 'Preview' && (
                <Preview
                    iframeKey={JSON.stringify(importMap)}
                    files={files}
                    importMap={importMap}
                />
            )}
            {selectedTab === 'Transform' && <Transform file={files[selectedFileName]} />}
        </FlexBox>
    )
}

Output.Preview = Preview
Output.Transform = Transform

export default Output
