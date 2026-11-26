/** Serve images in public/img through the Netlify Image CDN at a sensible size. */
export function cdnImage(file: string, width: number) {
  return `/.netlify/images?url=/img/${file}&w=${width}&fm=webp&q=80`
}
