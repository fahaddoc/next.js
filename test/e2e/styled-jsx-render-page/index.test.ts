import { nextTestSetup } from 'e2e-utils'

describe('styled-jsx with custom _document renderPage', () => {
  const { next } = nextTestSetup({
    files: __dirname,
    skipDeployment: true,
  })

  // When _document.getInitialProps calls ctx.renderPage() directly instead of
  // Document.getInitialProps(ctx), styled-jsx styles are lost because
  // defaultGetInitialProps is never called to collect them.
  it('should contain styled-jsx styles during SSR', async () => {
    const html = await next.render('/')
    expect(html).toMatch(/color:.*?red/)
  })
})
