import { gallery } from '../data/gallery'
import RazorReveal from './RazorReveal'
import { siteConfig } from '../config/siteConfig'

const galleryContent = siteConfig.content.gallery

export default function Gallery() {
  return (
    <section id="gallery" className="border-y border-ink/10 bg-surface py-24">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <span className="text-xs font-semibold tracking-[0.3em] text-accent">{galleryContent.eyebrow}</span>
        <RazorReveal as="h2" className="mt-4 overflow-hidden font-display text-4xl text-ink sm:text-5xl">
          {galleryContent.title}
        </RazorReveal>

        <div className="mt-12 flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory sm:grid sm:grid-cols-5 sm:gap-4 sm:overflow-visible sm:pb-0">
          {gallery.map((g) => (
            <figure
              key={g.id}
              className="relative aspect-square w-[70vw] max-w-[280px] shrink-0 snap-center overflow-hidden border border-ink/10 sm:w-auto sm:max-w-none"
            >
              <img
                src={g.image}
                alt={g.caption}
                loading="lazy"
                className="h-full w-full object-cover grayscale-[15%]"
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/90 to-transparent p-3 text-sm text-surface-dim">
                {g.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
