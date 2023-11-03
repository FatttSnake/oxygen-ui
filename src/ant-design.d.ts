import * as React from 'react'
import { CustomIconComponentProps } from '@ant-design/icons/es/components/Icon'
import { TablePaginationConfig } from 'antd/lib'
import { FilterValue } from 'antd/es/table/interface'

declare global {
    type IconComponent =
        | React.ComponentType<CustomIconComponentProps | React.SVGProps<SVGSVGElement>>
        | React.ForwardRefExoticComponent<CustomIconComponentProps>

    type PaginationConfig = TablePaginationConfig

    type FilterVal = FilterValue
}
