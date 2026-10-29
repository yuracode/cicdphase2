// app/tips/page.js

import { getTips } from '@/lib/tips'

export const metadata = {
  title: 'TODOのコツ | TODOアプリ',
}

export default async function TipsPage() {
  const tips = await getTips()
  return (
    <main className="container">
      <h1>TODOのコツ</h1>
      <ol>
        {tips.map((tip) => (
          <li key={tip.id}>{tip.text}</li>
        ))}
      </ol>
    </main>
  )
}
