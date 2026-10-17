import { cn } from '../../lib/cn.js'

/**
 * Serves WebP variants with a JPEG fallback. Width/height are always set so the
 * browser reserves space before the file arrives. Below-the-fold images lazy-load.
 */
export function ResponsiveImage({ image, sizes = '100vw', priority = false, className, imgClassName, alt }) {
  return (
    <picture className={cn('block', className)}>
      {image.srcSet && <source type="image/webp" srcSet={image.srcSet} sizes={sizes} />}
      <img
        src={image.src}
        width={image.width}
        height={image.height}
        alt={alt ?? image.alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        fetchPriority={priority ? 'high' : undefined}
        style={{ objectPosition: image.position }}
        className={cn('h-full w-full object-cover', imgClassName)}
      />
    </picture>
  )
}
