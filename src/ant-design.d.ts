import * as React from 'react'
import { CustomIconComponentProps } from '@ant-design/icons/es/components/Icon'
import { TablePaginationConfig } from 'antd/lib'
import { ColumnsType, FilterValue, SorterResult, SortOrder } from 'antd/es/table/interface'
import { CheckboxChangeEvent } from 'antd/es/checkbox'
import type { DataNode } from 'antd/es/tree'

declare global {
    type IconComponent =
        | React.ComponentType<CustomIconComponentProps | React.SVGProps<SVGSVGElement>>
        | React.ForwardRefExoticComponent<CustomIconComponentProps>

    type _TablePaginationConfig = TablePaginationConfig

    type _ColumnsType<T> = ColumnsType<T>
    type _FilterValue = FilterValue
    type _SorterResult<T> = SorterResult<T>
    type _SortOrder = SortOrder
    type _CheckboxChangeEvent = CheckboxChangeEvent
    interface _DataNode extends DataNode {
        value: React.Key
        fullTitle?: string
        parentId?: number
        children?: _DataNode[]
    }
}
