import Playground from '@/components/Playground'
import templates from '@/components/Playground/templates'

const Tools = () => {
    const template = templates['base']
    return (
        <Playground
            initFiles={template.files}
            initTsconfigRaw={JSON.stringify(template.tsconfig, null, 2)}
            initImportMapRaw={JSON.stringify(template.importMap, null, 2)}
        />
    )
}

export default Tools
