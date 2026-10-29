import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TodoForm from './TodoForm'

// 3つの探し方のうち、おすすめは getByRole。
// 「入力欄である」という役割と名前の両方を確かめられ、読み上げソフトの使い方とも一致する。
// getByPlaceholderText は、プレースホルダーが入力すると消える補助の文字なので、名前の代わりにはならない。
test('getByRole で入力欄を探せる', () => {
  render(<TodoForm onAdd={() => {}} />)
  expect(screen.getByRole('textbox', { name: 'やること' })).toBeInTheDocument()
})

test('getByLabelText で入力欄を探せる', () => {
  render(<TodoForm onAdd={() => {}} />)
  expect(screen.getByLabelText('やること')).toBeInTheDocument()
})

test('getByPlaceholderText で入力欄を探せる', () => {
  render(<TodoForm onAdd={() => {}} />)
  expect(screen.getByPlaceholderText('やることを入力')).toBeInTheDocument()
})

test('入力して追加すると onAdd が呼ばれ、入力欄が空になる', async () => {
  const user = userEvent.setup()
  const onAdd = jest.fn()
  render(<TodoForm onAdd={onAdd} />)
  await user.type(screen.getByRole('textbox', { name: 'やること' }), '  牛乳を買う  ')
  await user.click(screen.getByRole('button', { name: '追加' }))
  expect(onAdd).toHaveBeenCalledWith('牛乳を買う')
  expect(screen.getByRole('textbox', { name: 'やること' })).toHaveValue('')
})

test('空のまま追加するとエラーが出て、入力すると消える', async () => {
  const user = userEvent.setup()
  const onAdd = jest.fn()
  render(<TodoForm onAdd={onAdd} />)
  await user.click(screen.getByRole('button', { name: '追加' }))
  expect(screen.getByRole('alert')).toHaveTextContent('やることを入力してください')
  expect(onAdd).not.toHaveBeenCalled()
  await user.type(screen.getByRole('textbox', { name: 'やること' }), 'a')
  expect(screen.queryByRole('alert')).not.toBeInTheDocument()
})
