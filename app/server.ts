import { Hono } from 'hono'
import { inertia } from '@hono/inertia'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { rootView } from './root-view'
import { createUser, findUser, listUsers } from './data'

/**
 * ユーザー情報入力時のスキーマ
 */
const userInput = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.email('Invalid email'),
  bio: z.string().max(200, 'Bio must be 200 characters or less').optional().default('')
})

// Honoクライアントインスタンスを生成
const app = new Hono()

// ミドルウェアを適用
app.use(inertia({ rootView }))

// ルーティングの設定
const routes = app
  .get('/', (c) => c.render('Home', { message: 'Hono x Inertia' }))
  .get('/users', (c) => c.render('Users/Index', { users: listUsers() }))
  .get('/users/new', (c) =>
    c.render('Users/New', {
      values: { name: '', email: '', bio: '' },
      errors: {} as Record<string, string>
    })
  )
  .get('/users/:id{[0-9]+}', (c) => {
    const id = Number(c.req.param('id'))
    // ユーザー検索
    const user = findUser(id)
    if (!user) return c.notFound()
    return c.render('Users/Show', { user })
  })
  .post(
    '/users',
    zValidator('form', userInput, (result, c) => {
      if (!result.success) {
        const fieldErrors = z.flattenError(result.error).fieldErrors
        const errors: Record<string, string> = {}
        for (const [key, messages] of Object.entries(fieldErrors)) {
          if (messages && messages.length > 0) errors[key] = messages[0]
        }
        const raw = (result as { data?: Record<string, unknown> }).data ?? {}
        return c.render('Users/New', {
          values: {
            name: typeof raw.name === 'string' ? raw.name : '',
            email: typeof raw.email === 'string' ? raw.email : '',
            bio: typeof raw.bio === 'string' ? raw.bio : ''
          },
          errors
        })
      }
    }),
    (c) => {
      // 入力データを取得
      const input = c.req.valid('form')
      // ユーザーを新規作成
      const user = createUser(input)
      return c.redirect(`/users/${user.id}`, 303)
    }
  )

export default routes
