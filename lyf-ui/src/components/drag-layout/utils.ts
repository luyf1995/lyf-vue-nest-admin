import { InjectionKey } from 'vue'

export interface IProps {
  minWidth?: number
  dragResizeWidth?: number // 拖拽条的宽度
}

export const dragWrapperContextKey: InjectionKey<IProps> = Symbol('dragWrapperContextKey')
