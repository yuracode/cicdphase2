import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TodoItem from './TodoItem'

test('TODO の文字が表示される', () => {
  const todo = { id: '1', text: '牛乳を買う', done: false }
  render(<TodoItem todo={todo} onToggle={() => {}} onDelete={() => {}} />)
  expect(screen.getByText('牛乳を買う')).toBeInTheDocument()
})

test('未完了ならチェックボックスはオフ', () => {
  const todo = { id: '1', text: '牛乳を買う', done: false }
  render(<TodoItem todo={todo} onToggle={() => {}} onDelete={() => {}} />)
  const checkbox = screen.getByRole('checkbox', { name: '牛乳を買う' })
  expect(checkbox).not.toBeChecked()
})

test('削除ボタンに TODO 名入りのラベルが付いている', () => {
  const todo = { id: '1', text: '牛乳を買う', done: false }
  render(<TodoItem todo={todo} onToggle={() => {}} onDelete={() => {}} />)
  expect(screen.getByRole('button', { name: '牛乳を買うを削除' })).toBeInTheDocument()
})

test('完了済みならチェックがオンで、打ち消し線が付く', () => {
  const todo = { id: '1', text: '牛乳を買う', done: true }
  render(<TodoItem todo={todo} onToggle={() => {}} onDelete={() => {}} />)
  expect(screen.getByRole('checkbox', { name: '牛乳を買う' })).toBeChecked()
  expect(screen.getByText('牛乳を買う')).toHaveStyle({ textDecoration: 'line-through' })
})

test('未完了なら打ち消し線は付かない', () => {
  const todo = { id: '1', text: '牛乳を買う', done: false }
  render(<TodoItem todo={todo} onToggle={() => {}} onDelete={() => {}} />)
  expect(screen.getByText('牛乳を買う')).toHaveStyle({ textDecoration: 'none' })
})

test('チェックと削除で onToggle / onDelete が id 付きで呼ばれる', async () => {
  const user = userEvent.setup()
  const onToggle = jest.fn()
  const onDelete = jest.fn()
  const todo = { id: '1', text: '牛乳を買う', done: false }
  render(<TodoItem todo={todo} onToggle={onToggle} onDelete={onDelete} />)
  await user.click(screen.getByRole('checkbox', { name: '牛乳を買う' }))
  await user.click(screen.getByRole('button', { name: '牛乳を買うを削除' }))
  expect(onToggle).toHaveBeenCalledWith('1')
  expect(onDelete).toHaveBeenCalledWith('1')
})

test('ダブルクリックで編集し、Enter で onEdit が呼ばれる', async () => {
  const user = userEvent.setup()
  const onEdit = jest.fn()
  const todo = { id: '1', text: '牛乳を買う', done: false }
  render(<TodoItem todo={todo} onToggle={() => {}} onDelete={() => {}} onEdit={onEdit} />)
  await user.dblClick(screen.getByText('牛乳を買う'))
  const input = screen.getByRole('textbox', { name: '牛乳を買うを編集' })
  await user.clear(input)
  await user.type(input, '豆乳を買う{Enter}')
  expect(onEdit).toHaveBeenCalledWith('1', '豆乳を買う')
  expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
})

test('Escape で編集をやめると onEdit は呼ばれない', async () => {
  const user = userEvent.setup()
  const onEdit = jest.fn()
  const todo = { id: '1', text: '牛乳を買う', done: false }
  render(<TodoItem todo={todo} onToggle={() => {}} onDelete={() => {}} onEdit={onEdit} />)
  await user.dblClick(screen.getByText('牛乳を買う'))
  await user.keyboard('{Escape}')
  expect(onEdit).not.toHaveBeenCalled()
  expect(screen.getByText('牛乳を買う')).toBeInTheDocument()
})
