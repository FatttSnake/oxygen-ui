import * as React from 'react'
import { CustomIconComponentProps } from '@ant-design/icons/es/components/Icon'

declare global {
    type IconComponent =
        | React.ComponentType<CustomIconComponentProps | React.SVGProps<SVGSVGElement>>
        | React.ForwardRefExoticComponent<CustomIconComponentProps>
}
