import { nextTestSetup } from 'e2e-utils'

describe('styled-jsx with custom _document renderPage', () => {
  const { next } = nextTestSetup({
    files: __dirname,
    skipDeployment: true,
  })

  // When _document.getInitialProps calls ctx.renderPage() directly instead of
  // Document.getInitialProps(ctx), styled-jsx styles are lost because
  // defaultGetInitialProps is never called to collect them.
  //
  // All styled-jsx on this page uses dynamic expressions (interpolated props),
  // so the runtime computes numeric class names via DJB2 hash — matching the
  // pattern seen in the production FOUC bug.
  it('should contain styled-jsx styles during SSR', async () => {
    const html = await next.render('/')

    // Dynamic styled-jsx produces numeric class names at runtime
    const numericClasses = html.match(/\bjsx-\d+\b/g) || []
    console.log('Numeric jsx classes:', [...new Set(numericClasses)])
    expect(numericClasses.length).toBeGreaterThan(0)

    // The styles should be present as inline <style> tags
    expect(html).toMatch(/color:.*?green/) // main page
    expect(html).toMatch(/color:.*?blue/) // DynamicStyled
    expect(html).toMatch(/background-color:.*?navy/) // header
    expect(html).toMatch(/color:.*?purple/) // footer
  })
})
