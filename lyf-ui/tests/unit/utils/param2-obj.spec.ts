import { param2Obj } from '@/utils/utils'

describe('Utils:param2Obj', () => {
  const url = 'https://www.sunny.com?name=zhangsan&age=11'

  test('param2Obj test', () => {
    expect(param2Obj(url)).toEqual({
      name: 'zhangsan',
      age: '11'
    })
  })
})
