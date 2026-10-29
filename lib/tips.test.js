import { getTips } from './tips'

test('コツを3件返す', async () => {
  const tips = await getTips()
  expect(tips).toHaveLength(3)
  expect(tips[0]).toEqual({ id: 1, text: expect.any(String) })
})
