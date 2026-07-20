import { describe, it, expect } from 'vitest'
import articleDetailSource from '../pages/ArticleDetail.vue?raw'

describe('Article detail navigation', () => {
  it('returns error-state users to the article listing', () => {
    expect(articleDetailSource).toContain('<router-link to="/articles" class="back-link">')
  })
})
