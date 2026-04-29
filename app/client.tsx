import { createInertiaApp, type ResolvedComponent } from '@inertiajs/react'
import { createRoot } from 'react-dom/client'

/**
 * InertiaAppクライアントを生成する
 */
createInertiaApp({
  // resolveメソッド
  resolve: async (name) => {
    // pages
    const pages = import.meta.glob<{ default: ResolvedComponent }>('./pages/**/*.tsx')
    const page = await pages[`./pages/${name}.tsx`]()
    return page.default
  },
  // セットアップ
  setup({ el, App, props }) {
    createRoot(el).render(<App {...props} />)
  }
})
