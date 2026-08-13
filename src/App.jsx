import { useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Services from './components/Services'
import Gallery from './components/Gallery'
import BookingIntro from './components/BookingIntro'
import Team from './components/Team'
import Testimonials from './components/Testimonials'
import FAQ from './components/FAQ'
import Contact from './components/Contact'
import Footer from './components/Footer'
import BookingModal from './components/BookingModal'
import FloatingButton from './components/FloatingButton'
import FloatingQuickLinks from './components/FloatingQuickLinks'
import LegalPage from './components/LegalPage'
import { siteConfig } from './config/siteConfig'

const { legal } = siteConfig.content

export default function App() {
  const [bookingOpen, setBookingOpen] = useState(false)
  const [bookingServiceId, setBookingServiceId] = useState(null)
  const [bookingBarberId, setBookingBarberId] = useState(null)

  const path = window.location.pathname.replace(/\/+$/, '') || '/'
  if (path === legal.accessibility.path) return <LegalPage page={legal.accessibility} />
  if (path === legal.privacy.path) return <LegalPage page={legal.privacy} />

  function openBooking(serviceId = null, barberId = null) {
    setBookingServiceId(serviceId)
    setBookingBarberId(barberId)
    setBookingOpen(true)
  }

  return (
    <div className="min-h-dvh bg-surface font-body">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:right-4 focus:top-4 focus:z-[100] focus:bg-primary focus:px-4 focus:py-2 focus:font-semibold focus:text-white"
      >
        {siteConfig.content.skipToMain}
      </a>
      <Navbar onBook={() => openBooking()} />
      <main id="main">
        <Hero onBook={() => openBooking()} />
        <Services onBook={openBooking} />
        <BookingIntro onBook={openBooking} />
        <Gallery />
        <Team />
        <Testimonials />
        <FAQ />
        <Contact />
      </main>
      <Footer />

      <FloatingButton />
      <FloatingQuickLinks />
      <BookingModal
        isOpen={bookingOpen}
        onClose={() => setBookingOpen(false)}
        initialServiceId={bookingServiceId}
        initialBarberId={bookingBarberId}
      />
    </div>
  )
}
