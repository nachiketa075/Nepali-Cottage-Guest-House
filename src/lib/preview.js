import { site } from '../data/property.js'

/**
 * Editor preview shows "Placeholder" notes for missing details. It is off for
 * guests; turn it on with ?preview in the URL or `site.previewMode` in property.js.
 */
export const isPreview =
  site.previewMode || (typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('preview'))
