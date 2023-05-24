import { deepClone } from '@/utils/utils'

describe('Utils:deepClone', () => {
  const sourceObj = {
    name: '张三',
    job: {
      salary: 1000
    }
  }
  test('deepClone test', () => {
    expect(deepClone(sourceObj)).toEqual(sourceObj)
  })
})
