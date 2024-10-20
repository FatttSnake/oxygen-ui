import { DetailedHTMLProps, HTMLAttributes } from 'react'
import useStyles from '@/assets/css/components/common/sidebar/separate'

const Separate = ({
    className,
    ...props
}: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>) => {
    const { styles } = useStyles()

    return <div className={`${styles.separate}${className ? ` ${className}` : ''}`} {...props} />
}

export default Separate
