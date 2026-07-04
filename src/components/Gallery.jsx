import { gallery } from '../data/gallery'
import RazorReveal from './RazorReveal'

export default function Gallery() {
  return (
    <section id="gallery" className="border-y border-charcoal/10 bg-cream py-24">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <span className="text-xs font-semibold tracking-[0.3em] text-burgundy">תיק עבודות</span>
        <RazorReveal as="h2" className="mt-4 overflow-hidden font-display text-4xl text-charcoal sm:text-5xl">
          כל תמונה מדברת בעד עצמה
        </RazorReveal>

        <div className="mt-12 flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory sm:grid sm:grid-cols-5 sm:gap-4 sm:overflow-visible sm:pb-0">
          {gallery.map((g) => (
            <figure
              key={g.id}
              className="relative aspect-square w-[70vw] max-w-[280px] shrink-0 snap-center overflow-hidden border border-charcoal/10 sm:w-auto sm:max-w-none"
            >
              <img
                src={g.image}
                alt={g.caption}
                loading="lazy"
                className="h-full w-full object-cover grayscale-[15%]"
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-charcoal/90 to-transparent p-3 text-sm text-cream-dim">
                {g.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
