import { renderToString } from 'react-dom/server'
import { Link, Script, ViteClient } from 'vite-ssr-components/react'
import { serializePage, type PageObject, type RootView } from '@hono/inertia'

/**
 * ルートビュー
 * @param param0 
 * @returns 
 */
const Document = ({ page }: { page: PageObject }) => (
  <html>
    <head>
      <ViteClient />
      <Link rel="stylesheet" href="/app/styles.css" />
      <Script src="/app/client.tsx" />
    </head>
    <body>
      <script data-page="app" type="application/json" dangerouslySetInnerHTML={{ __html: serializePage(page) }} />
      <div id="app" />
    </body>
  </html>
)

export const rootView: RootView = (page) => '<!DOCTYPE html>' + renderToString(<Document page={page} />)
