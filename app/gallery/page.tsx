import EagerImageGallery from '@/components/eager-image-gallery'

export default function GalleryPage() {
  // Define your gallery items here.
  // IMPORTANT: All files are stored in /public/gallery and referenced as /gallery/filename.jpg?v=1
  const images = [
    { src: '/gallery/01.png?v=1', alt: 'Studio portrait 01', caption: 'Studio Portrait 01' },
    { src: '/gallery/02.png?v=1', alt: 'Studio portrait 02', caption: 'Studio Portrait 02' },
    { src: '/gallery/03.png?v=1', alt: 'Concert moment 03', caption: 'Concert Moment 03' },
    { src: '/gallery/04.png?v=1', alt: 'Concert moment 04', caption: 'Concert Moment 04' },
    { src: '/gallery/05.png?v=1', alt: 'Album cover concept 05', caption: 'Album Concept 05' },
    { src: '/gallery/06.png?v=1', alt: 'Backstage 06', caption: 'Backstage 06' },
    { src: '/gallery/07.png?v=1', alt: 'Rehearsal 07', caption: 'Rehearsal 07' },
    { src: '/gallery/08.png?v=1', alt: 'Behind the scenes 08', caption: 'Behind The Scenes 08' },
    { src: '/gallery/09.png?v=1', alt: 'Promo still 09', caption: 'Promo Still 09' },
    { src: '/gallery/10.png?v=1', alt: 'Promo still 10', caption: 'Promo Still 10' },
    { src: '/gallery/11.png?v=1', alt: 'Promo still 11', caption: 'Promo Still 11' },
    { src: '/gallery/12.png?v=1', alt: 'Promo still 12', caption: 'Promo Still 12' },
  ]

  return (
    <main className="min-h-screen w-full px-4 sm:px-6 lg:px-8 py-12 text-white">
      <div className="mx-auto w-full max-w-7xl">
        <EagerImageGallery images={images} title="SQUAREDRUM Gallery" />
      </div>
    </main>
  )
}
