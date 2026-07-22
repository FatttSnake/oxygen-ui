import useStyles from '@/assets/css/components/playground/output/index.style'
import FlexBox from '@/components/common/FlexBox'
import { IFileTree } from '@/components/Playground/shared'
import { findNodeByKey } from '@/components/Playground/files'
import Transform from '@/components/Playground/Output/Transform'
import Preview from '@/components/Playground/Output/Preview'
import TabBar from '@/components/Playground/TabBar'

interface OutputProps {
    isDarkMode?: boolean
    fileTree: IFileTree
    selectedFileKey: string
    entryPointPath?: string
    preExpansionCode?: string
    postExpansionCode?: string
    globalJsVariables?: Record<string, unknown>
    globalCssVariables?: string
}

const Output = ({
    isDarkMode,
    fileTree,
    selectedFileKey,
    entryPointPath,
    preExpansionCode,
    postExpansionCode,
    globalJsVariables,
    globalCssVariables
}: OutputProps) => {
    const { styles } = useStyles()
    const [selectedTabKey, setSelectedTabKey] = useState('Preview')

    return (
        <FlexBox className={styles.root}>
            <TabBar
                tabs={[
                    { key: 'Preview', name: 'Preview', closable: false, editable: false },
                    { key: 'Transform', name: 'Transform', closable: false, editable: false }
                ]}
                creatable={false}
                selectedTabKey={selectedTabKey}
                onChange={(tabName) => {
                    setSelectedTabKey(tabName)
                    return true
                }}
            />
            {selectedTabKey === 'Preview' && (
                <Preview
                    iframeKey={fileTree.key + entryPointPath}
                    fileTree={fileTree}
                    entryPointPath={entryPointPath}
                    preExpansionCode={preExpansionCode}
                    postExpansionCode={postExpansionCode}
                    globalJsVariables={globalJsVariables}
                    globalCssVariables={globalCssVariables}
                />
            )}
            {selectedTabKey === 'Transform' && (
                <Transform
                    isDarkMode={isDarkMode}
                    file={findNodeByKey(fileTree, selectedFileKey)?.node}
                />
            )}
        </FlexBox>
    )
}

Output.Preview = Preview
Output.Transform = Transform

export default Output
