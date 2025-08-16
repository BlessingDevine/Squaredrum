// Image Audit Report - All image files and their usage status

export interface ImageReference {
  path: string
  usedIn: string[]
  status: "used" | "unused" | "duplicate"
}

export const imageAudit: ImageReference[] = [
  // Main brand assets - USED
  {
    path: "/squaredrum-logo.png",
    usedIn: ["app/layout.tsx", "components/header.tsx", "components/enhanced-mobile-menu.tsx"],
    status: "used",
  },
  {
    path: "/squaredrum-bg.jpg",
    usedIn: ["app/page.tsx"],
    status: "used",
  },
  {
    path: "/squaredrum-home-bg.jpg",
    usedIn: ["app/page.tsx"],
    status: "used",
  },
  {
    path: "/music-square-radio-logo-neon.png",
    usedIn: ["components/radio-player.tsx"],
    status: "used",
  },

  // Compilation covers - USED
  {
    path: "/afro-square.jpg",
    usedIn: ["lib/afro-square-tracks.ts", "app/page.tsx", "app/releases/page.tsx"],
    status: "used",
  },
  {
    path: "/country-square.jpg",
    usedIn: ["lib/country-square-tracks.ts", "app/page.tsx", "app/releases/page.tsx"],
    status: "used",
  },
  {
    path: "/pop-square-vol1.jpg",
    usedIn: ["lib/pop-square-tracks.ts", "app/page.tsx", "app/releases/page.tsx"],
    status: "used",
  },
  {
    path: "/rnb-square.jpg",
    usedIn: ["lib/rnb-square-tracks.ts", "app/page.tsx", "app/releases/page.tsx"],
    status: "used",
  },

  // About page images - USED
  {
    path: "/ai-human-collaboration-studio.jpg",
    usedIn: ["app/about/AboutClient.tsx"],
    status: "used",
  },
  {
    path: "/sarah-kim.jpg",
    usedIn: ["app/about/AboutClient.tsx"],
    status: "used",
  },
  {
    path: "/david-thompson.jpg",
    usedIn: ["app/about/AboutClient.tsx"],
    status: "used",
  },
  {
    path: "/melissa-chan.jpg",
    usedIn: ["app/about/AboutClient.tsx"],
    status: "used",
  },
  {
    path: "/hugo-rivera.png",
    usedIn: ["app/about/AboutClient.tsx"],
    status: "used",
  },

  // Artist profile images - USED
  {
    path: "/images/neilly-storm.jpg",
    usedIn: ["lib/artists-data.ts"],
    status: "used",
  },
  {
    path: "/images/lucas-meno.jpg",
    usedIn: ["lib/artists-data.ts"],
    status: "used",
  },
  {
    path: "/images/danni-blaze.jpg",
    usedIn: ["lib/artists-data.ts"],
    status: "used",
  },
  {
    path: "/images/virgo-dunst.jpg",
    usedIn: ["lib/artists-data.ts"],
    status: "used",
  },
  {
    path: "/images/saka.jpg",
    usedIn: ["lib/artists-data.ts"],
    status: "used",
  },
  {
    path: "/images/tonez.jpg",
    usedIn: ["lib/artists-data.ts"],
    status: "used",
  },
  {
    path: "/images/neka.jpg",
    usedIn: ["lib/artists-data.ts"],
    status: "used",
  },
  {
    path: "/images/riven-cole.jpg",
    usedIn: ["lib/artists-data.ts - Riven Cole profile image"],
    status: "used",
  },
  {
    path: "/images/artists/neilly-storm.jpg",
    usedIn: ["lib/artists-data.ts"],
    status: "used",
  },
  {
    path: "/images/artists/lucas-meno.jpg",
    usedIn: ["lib/artists-data.ts"],
    status: "used",
  },
  {
    path: "/images/artists/danni-blaze.jpg",
    usedIn: ["lib/artists-data.ts"],
    status: "used",
  },
  {
    path: "/images/artists/virgo-dunst.jpg",
    usedIn: ["lib/artists-data.ts"],
    status: "used",
  },
  {
    path: "/images/artists/saka.jpg",
    usedIn: ["lib/artists-data.ts"],
    status: "used",
  },
  {
    path: "/images/artists/tonez.jpg",
    usedIn: ["lib/artists-data.ts"],
    status: "used",
  },
  {
    path: "/images/artists/neka.jpg",
    usedIn: ["lib/artists-data.ts"],
    status: "used",
  },
  {
    path: "/images/artists/riven-cole.jpg",
    usedIn: ["lib/artists-data.ts - Riven Cole artist image"],
    status: "used",
  },
  {
    path: "/images/sadie-rose/sadie-rose.jpg",
    usedIn: ["lib/artists-data.ts"],
    status: "used",
  },
  {
    path: "/images/lunah/lunah.jpg",
    usedIn: ["lib/artists-data.ts"],
    status: "used",
  },
  {
    path: "/images/cedar-line.jpg",
    usedIn: ["lib/artists-data.ts"],
    status: "used",
  },

  // Hero images - USED
  {
    path: "/images/hero/tonez-hero.jpg",
    usedIn: ["app/page.tsx"],
    status: "used",
  },
  {
    path: "/images/hero/virgo-dunst-hero.jpg",
    usedIn: ["app/page.tsx"],
    status: "used",
  },
  {
    path: "/images/hero/j-cruz-hero.jpg",
    usedIn: ["app/page.tsx"],
    status: "used",
  },
  {
    path: "/images/hero/saka-hero.jpg",
    usedIn: ["app/page.tsx"],
    status: "used",
  },
  {
    path: "/images/hero/neka-hero.jpg",
    usedIn: ["app/page.tsx"],
    status: "used",
  },
  {
    path: "/images/hero/danni-blaze-hero.jpg",
    usedIn: ["app/page.tsx"],
    status: "used",
  },
  {
    path: "/images/hero/riven-cole-hero.jpg",
    usedIn: ["app/page.tsx - Riven Cole hero carousel"],
    status: "used",
  },
  {
    path: "/images/hero/neilly-storm-hero.jpg",
    usedIn: ["app/page.tsx"],
    status: "used",
  },
  {
    path: "/images/hero/sadie-rose-hero.jpg",
    usedIn: ["app/page.tsx"],
    status: "used",
  },
  {
    path: "/images/hero/lunah-hero.jpg",
    usedIn: ["app/page.tsx"],
    status: "used",
  },
  {
    path: "/images/hero/cedar-line-hero.jpg",
    usedIn: ["app/page.tsx"],
    status: "used",
  },

  // Design reference images - USED
  {
    path: "/images/play-button-design.png",
    usedIn: ["Design reference"],
    status: "used",
  },
  {
    path: "/images/featured-track-design.png",
    usedIn: ["Design reference"],
    status: "used",
  },

  // Photo gallery images - ALL USED in lib/artists-data.ts photoGallery arrays
  // Neilly Storm gallery (27 photos) - USED
  {
    path: "/images/neilly-storm/01.jpg",
    usedIn: ["lib/artists-data.ts - Neilly Storm photoGallery"],
    status: "used",
  },
  {
    path: "/images/neilly-storm/02.jpg",
    usedIn: ["lib/artists-data.ts - Neilly Storm photoGallery"],
    status: "used",
  },
  {
    path: "/images/neilly-storm/03.jpg",
    usedIn: ["lib/artists-data.ts - Neilly Storm photoGallery"],
    status: "used",
  },
  {
    path: "/images/neilly-storm/04.jpg",
    usedIn: ["lib/artists-data.ts - Neilly Storm photoGallery"],
    status: "used",
  },
  {
    path: "/images/neilly-storm/05.jpg",
    usedIn: ["lib/artists-data.ts - Neilly Storm photoGallery"],
    status: "used",
  },
  {
    path: "/images/neilly-storm/06.jpg",
    usedIn: ["lib/artists-data.ts - Neilly Storm photoGallery"],
    status: "used",
  },
  {
    path: "/images/neilly-storm/07.jpg",
    usedIn: ["lib/artists-data.ts - Neilly Storm photoGallery"],
    status: "used",
  },
  {
    path: "/images/neilly-storm/08.jpg",
    usedIn: ["lib/artists-data.ts - Neilly Storm photoGallery"],
    status: "used",
  },
  {
    path: "/images/neilly-storm/09.jpg",
    usedIn: ["lib/artists-data.ts - Neilly Storm photoGallery"],
    status: "used",
  },
  {
    path: "/images/neilly-storm/10.jpg",
    usedIn: ["lib/artists-data.ts - Neilly Storm photoGallery"],
    status: "used",
  },
  {
    path: "/images/neilly-storm/11.jpg",
    usedIn: ["lib/artists-data.ts - Neilly Storm photoGallery"],
    status: "used",
  },
  {
    path: "/images/neilly-storm/12.jpg",
    usedIn: ["lib/artists-data.ts - Neilly Storm photoGallery"],
    status: "used",
  },
  {
    path: "/images/neilly-storm/13.jpg",
    usedIn: ["lib/artists-data.ts - Neilly Storm photoGallery"],
    status: "used",
  },
  {
    path: "/images/neilly-storm/14.jpg",
    usedIn: ["lib/artists-data.ts - Neilly Storm photoGallery"],
    status: "used",
  },
  {
    path: "/images/neilly-storm/15.jpg",
    usedIn: ["lib/artists-data.ts - Neilly Storm photoGallery"],
    status: "used",
  },
  {
    path: "/images/neilly-storm/16.jpg",
    usedIn: ["lib/artists-data.ts - Neilly Storm photoGallery"],
    status: "used",
  },
  {
    path: "/images/neilly-storm/17.jpg",
    usedIn: ["lib/artists-data.ts - Neilly Storm photoGallery"],
    status: "used",
  },
  {
    path: "/images/neilly-storm/18.jpg",
    usedIn: ["lib/artists-data.ts - Neilly Storm photoGallery"],
    status: "used",
  },
  {
    path: "/images/neilly-storm/19.jpg",
    usedIn: ["lib/artists-data.ts - Neilly Storm photoGallery"],
    status: "used",
  },
  {
    path: "/images/neilly-storm/20.jpg",
    usedIn: ["lib/artists-data.ts - Neilly Storm photoGallery"],
    status: "used",
  },
  {
    path: "/images/neilly-storm/21.jpg",
    usedIn: ["lib/artists-data.ts - Neilly Storm photoGallery"],
    status: "used",
  },
  {
    path: "/images/neilly-storm/22.jpg",
    usedIn: ["lib/artists-data.ts - Neilly Storm photoGallery"],
    status: "used",
  },
  {
    path: "/images/neilly-storm/23.jpg",
    usedIn: ["lib/artists-data.ts - Neilly Storm photoGallery"],
    status: "used",
  },
  {
    path: "/images/neilly-storm/24.jpg",
    usedIn: ["lib/artists-data.ts - Neilly Storm photoGallery"],
    status: "used",
  },
  {
    path: "/images/neilly-storm/25.jpg",
    usedIn: ["lib/artists-data.ts - Neilly Storm photoGallery"],
    status: "used",
  },
  {
    path: "/images/neilly-storm/26.jpg",
    usedIn: ["lib/artists-data.ts - Neilly Storm photoGallery"],
    status: "used",
  },
  {
    path: "/images/neilly-storm/27.jpg",
    usedIn: ["lib/artists-data.ts - Neilly Storm photoGallery"],
    status: "used",
  },

  // Luv Tonez gallery (14 photos) - USED
  {
    path: "/images/luv-tonez/01.jpg",
    usedIn: ["lib/artists-data.ts - Luv Tonez photoGallery"],
    status: "used",
  },
  {
    path: "/images/luv-tonez/02.jpg",
    usedIn: ["lib/artists-data.ts - Luv Tonez photoGallery"],
    status: "used",
  },
  {
    path: "/images/luv-tonez/07.jpg",
    usedIn: ["lib/artists-data.ts - Luv Tonez photoGallery"],
    status: "used",
  },
  {
    path: "/images/luv-tonez/08.jpg",
    usedIn: ["lib/artists-data.ts - Luv Tonez photoGallery"],
    status: "used",
  },
  {
    path: "/images/luv-tonez/09.jpg",
    usedIn: ["lib/artists-data.ts - Luv Tonez photoGallery"],
    status: "used",
  },
  {
    path: "/images/luv-tonez/10.jpg",
    usedIn: ["lib/artists-data.ts - Luv Tonez photoGallery"],
    status: "used",
  },
  {
    path: "/images/luv-tonez/11.jpg",
    usedIn: ["lib/artists-data.ts - Luv Tonez photoGallery"],
    status: "used",
  },
  {
    path: "/images/luv-tonez/12.jpg",
    usedIn: ["lib/artists-data.ts - Luv Tonez photoGallery"],
    status: "used",
  },
  {
    path: "/images/luv-tonez/13.jpg",
    usedIn: ["lib/artists-data.ts - Luv Tonez photoGallery"],
    status: "used",
  },
  {
    path: "/images/luv-tonez/14.jpg",
    usedIn: ["lib/artists-data.ts - Luv Tonez photoGallery"],
    status: "used",
  },
  {
    path: "/images/luv-tonez/15.jpg",
    usedIn: ["lib/artists-data.ts - Luv Tonez photoGallery"],
    status: "used",
  },
  {
    path: "/images/luv-tonez/16.jpg",
    usedIn: ["lib/artists-data.ts - Luv Tonez photoGallery"],
    status: "used",
  },
  {
    path: "/images/luv-tonez/17.jpg",
    usedIn: ["lib/artists-data.ts - Luv Tonez photoGallery"],
    status: "used",
  },
  {
    path: "/images/luv-tonez/18.jpg",
    usedIn: ["lib/artists-data.ts - Luv Tonez photoGallery"],
    status: "used",
  },

  // Saka gallery (18 photos) - USED
  {
    path: "/images/saka/01.jpg",
    usedIn: ["lib/artists-data.ts - Saka photoGallery"],
    status: "used",
  },
  {
    path: "/images/saka/02.jpg",
    usedIn: ["lib/artists-data.ts - Saka photoGallery"],
    status: "used",
  },
  {
    path: "/images/saka/03.jpg",
    usedIn: ["lib/artists-data.ts - Saka photoGallery"],
    status: "used",
  },
  {
    path: "/images/saka/04.jpg",
    usedIn: ["lib/artists-data.ts - Saka photoGallery"],
    status: "used",
  },
  {
    path: "/images/saka/05.jpg",
    usedIn: ["lib/artists-data.ts - Saka photoGallery"],
    status: "used",
  },
  {
    path: "/images/saka/06.jpg",
    usedIn: ["lib/artists-data.ts - Saka photoGallery"],
    status: "used",
  },
  {
    path: "/images/saka/07.jpg",
    usedIn: ["lib/artists-data.ts - Saka photoGallery"],
    status: "used",
  },
  {
    path: "/images/saka/08.jpg",
    usedIn: ["lib/artists-data.ts - Saka photoGallery"],
    status: "used",
  },
  {
    path: "/images/saka/09.jpg",
    usedIn: ["lib/artists-data.ts - Saka photoGallery"],
    status: "used",
  },
  {
    path: "/images/saka/10.jpg",
    usedIn: ["lib/artists-data.ts - Saka photoGallery"],
    status: "used",
  },
  {
    path: "/images/saka/13.jpg",
    usedIn: ["lib/artists-data.ts - Saka photoGallery"],
    status: "used",
  },
  {
    path: "/images/saka/14.jpg",
    usedIn: ["lib/artists-data.ts - Saka photoGallery"],
    status: "used",
  },
  {
    path: "/images/saka/15.jpg",
    usedIn: ["lib/artists-data.ts - Saka photoGallery"],
    status: "used",
  },
  {
    path: "/images/saka/16.jpg",
    usedIn: ["lib/artists-data.ts - Saka photoGallery"],
    status: "used",
  },
  {
    path: "/images/saka/17.jpg",
    usedIn: ["lib/artists-data.ts - Saka photoGallery"],
    status: "used",
  },
  {
    path: "/images/saka/18.jpg",
    usedIn: ["lib/artists-data.ts - Saka photoGallery"],
    status: "used",
  },
  {
    path: "/images/saka/19.jpg",
    usedIn: ["lib/artists-data.ts - Saka photoGallery"],
    status: "used",
  },
  {
    path: "/images/saka/20.jpg",
    usedIn: ["lib/artists-data.ts - Saka photoGallery"],
    status: "used",
  },

  // Virgo Dunst gallery (23 photos) - USED
  {
    path: "/images/virgo-dunst/01.jpg",
    usedIn: ["lib/artists-data.ts - Virgo Dunst photoGallery"],
    status: "used",
  },
  {
    path: "/images/virgo-dunst/02.jpg",
    usedIn: ["lib/artists-data.ts - Virgo Dunst photoGallery"],
    status: "used",
  },
  {
    path: "/images/virgo-dunst/03.jpg",
    usedIn: ["lib/artists-data.ts - Virgo Dunst photoGallery"],
    status: "used",
  },
  {
    path: "/images/virgo-dunst/04.jpg",
    usedIn: ["lib/artists-data.ts - Virgo Dunst photoGallery"],
    status: "used",
  },
  {
    path: "/images/virgo-dunst/05.jpg",
    usedIn: ["lib/artists-data.ts - Virgo Dunst photoGallery"],
    status: "used",
  },
  {
    path: "/images/virgo-dunst/06.jpg",
    usedIn: ["lib/artists-data.ts - Virgo Dunst photoGallery"],
    status: "used",
  },
  {
    path: "/images/virgo-dunst/07.jpg",
    usedIn: ["lib/artists-data.ts - Virgo Dunst photoGallery"],
    status: "used",
  },
  {
    path: "/images/virgo-dunst/08.jpg",
    usedIn: ["lib/artists-data.ts - Virgo Dunst photoGallery"],
    status: "used",
  },
  {
    path: "/images/virgo-dunst/09.jpg",
    usedIn: ["lib/artists-data.ts - Virgo Dunst photoGallery"],
    status: "used",
  },
  {
    path: "/images/virgo-dunst/10.jpg",
    usedIn: ["lib/artists-data.ts - Virgo Dunst photoGallery"],
    status: "used",
  },
  {
    path: "/images/virgo-dunst/11.jpg",
    usedIn: ["lib/artists-data.ts - Virgo Dunst photoGallery"],
    status: "used",
  },
  {
    path: "/images/virgo-dunst/12.jpg",
    usedIn: ["lib/artists-data.ts - Virgo Dunst photoGallery"],
    status: "used",
  },
  {
    path: "/images/virgo-dunst/13.jpg",
    usedIn: ["lib/artists-data.ts - Virgo Dunst photoGallery"],
    status: "used",
  },
  {
    path: "/images/virgo-dunst/14.jpg",
    usedIn: ["lib/artists-data.ts - Virgo Dunst photoGallery"],
    status: "used",
  },
  {
    path: "/images/virgo-dunst/15.jpg",
    usedIn: ["lib/artists-data.ts - Virgo Dunst photoGallery"],
    status: "used",
  },
  {
    path: "/images/virgo-dunst/16.jpg",
    usedIn: ["lib/artists-data.ts - Virgo Dunst photoGallery"],
    status: "used",
  },
  {
    path: "/images/virgo-dunst/17.jpg",
    usedIn: ["lib/artists-data.ts - Virgo Dunst photoGallery"],
    status: "used",
  },
  {
    path: "/images/virgo-dunst/18.jpg",
    usedIn: ["lib/artists-data.ts - Virgo Dunst photoGallery"],
    status: "used",
  },
  {
    path: "/images/virgo-dunst/19.jpg",
    usedIn: ["lib/artists-data.ts - Virgo Dunst photoGallery"],
    status: "used",
  },
  {
    path: "/images/virgo-dunst/20.jpg",
    usedIn: ["lib/artists-data.ts - Virgo Dunst photoGallery"],
    status: "used",
  },
  {
    path: "/images/virgo-dunst/21.jpg",
    usedIn: ["lib/artists-data.ts - Virgo Dunst photoGallery"],
    status: "used",
  },
  {
    path: "/images/virgo-dunst/23.jpg",
    usedIn: ["lib/artists-data.ts - Virgo Dunst photoGallery"],
    status: "used",
  },
  {
    path: "/images/virgo-dunst/24.jpg",
    usedIn: ["lib/artists-data.ts - Virgo Dunst photoGallery"],
    status: "used",
  },

  // Neka gallery (12 photos) - USED
  {
    path: "/images/neka/01.jpg",
    usedIn: ["lib/artists-data.ts - Neka photoGallery"],
    status: "used",
  },
  {
    path: "/images/neka/25.jpg",
    usedIn: ["lib/artists-data.ts - Neka photoGallery"],
    status: "used",
  },
  {
    path: "/images/neka/08.jpg",
    usedIn: ["lib/artists-data.ts - Neka photoGallery"],
    status: "used",
  },
  {
    path: "/images/neka/35.jpg",
    usedIn: ["lib/artists-data.ts - Neka photoGallery"],
    status: "used",
  },
  {
    path: "/images/neka/16.jpg",
    usedIn: ["lib/artists-data.ts - Neka photoGallery"],
    status: "used",
  },
  {
    path: "/images/neka/11.jpg",
    usedIn: ["lib/artists-data.ts - Neka photoGallery"],
    status: "used",
  },
  {
    path: "/images/neka/14.jpg",
    usedIn: ["lib/artists-data.ts - Neka photoGallery"],
    status: "used",
  },
  {
    path: "/images/neka/19.jpg",
    usedIn: ["lib/artists-data.ts - Neka photoGallery"],
    status: "used",
  },
  {
    path: "/images/neka/22.jpg",
    usedIn: ["lib/artists-data.ts - Neka photoGallery"],
    status: "used",
  },
  {
    path: "/images/neka/18.jpg",
    usedIn: ["lib/artists-data.ts - Neka photoGallery"],
    status: "used",
  },
  {
    path: "/images/neka/37.jpg",
    usedIn: ["lib/artists-data.ts - Neka photoGallery"],
    status: "used",
  },
  {
    path: "/images/neka/38.jpg",
    usedIn: ["lib/artists-data.ts - Neka photoGallery"],
    status: "used",
  },

  // Danni Blaze gallery (19 photos) - USED
  {
    path: "/images/danni-blaze/01.jpg",
    usedIn: ["lib/artists-data.ts - Danni Blaze photoGallery"],
    status: "used",
  },
  {
    path: "/images/danni-blaze/02.jpg",
    usedIn: ["lib/artists-data.ts - Danni Blaze photoGallery"],
    status: "used",
  },
  {
    path: "/images/danni-blaze/03.jpg",
    usedIn: ["lib/artists-data.ts - Danni Blaze photoGallery"],
    status: "used",
  },
  {
    path: "/images/danni-blaze/04.jpg",
    usedIn: ["lib/artists-data.ts - Danni Blaze photoGallery"],
    status: "used",
  },
  {
    path: "/images/danni-blaze/05.jpg",
    usedIn: ["lib/artists-data.ts - Danni Blaze photoGallery"],
    status: "used",
  },
  {
    path: "/images/danni-blaze/06.jpg",
    usedIn: ["lib/artists-data.ts - Danni Blaze photoGallery"],
    status: "used",
  },
  {
    path: "/images/danni-blaze/07.jpg",
    usedIn: ["lib/artists-data.ts - Danni Blaze photoGallery"],
    status: "used",
  },
  {
    path: "/images/danni-blaze/08.jpg",
    usedIn: ["lib/artists-data.ts - Danni Blaze photoGallery"],
    status: "used",
  },
  {
    path: "/images/danni-blaze/09.jpg",
    usedIn: ["lib/artists-data.ts - Danni Blaze photoGallery"],
    status: "used",
  },
  {
    path: "/images/danni-blaze/10.jpg",
    usedIn: ["lib/artists-data.ts - Danni Blaze photoGallery"],
    status: "used",
  },
  {
    path: "/images/danni-blaze/11.jpg",
    usedIn: ["lib/artists-data.ts - Danni Blaze photoGallery"],
    status: "used",
  },
  {
    path: "/images/danni-blaze/12.jpg",
    usedIn: ["lib/artists-data.ts - Danni Blaze photoGallery"],
    status: "used",
  },
  {
    path: "/images/danni-blaze/13.jpg",
    usedIn: ["lib/artists-data.ts - Danni Blaze photoGallery"],
    status: "used",
  },
  {
    path: "/images/danni-blaze/16.jpg",
    usedIn: ["lib/artists-data.ts - Danni Blaze photoGallery"],
    status: "used",
  },
  {
    path: "/images/danni-blaze/17.jpg",
    usedIn: ["lib/artists-data.ts - Danni Blaze photoGallery"],
    status: "used",
  },
  {
    path: "/images/danni-blaze/18.jpg",
    usedIn: ["lib/artists-data.ts - Danni Blaze photoGallery"],
    status: "used",
  },
  {
    path: "/images/danni-blaze/19.jpg",
    usedIn: ["lib/artists-data.ts - Danni Blaze photoGallery"],
    status: "used",
  },
  {
    path: "/images/danni-blaze/20.jpg",
    usedIn: ["lib/artists-data.ts - Danni Blaze photoGallery"],
    status: "used",
  },
  {
    path: "/images/danni-blaze/21.jpg",
    usedIn: ["lib/artists-data.ts - Danni Blaze photoGallery"],
    status: "used",
  },
  {
    path: "/images/danni-blaze/22.jpg",
    usedIn: ["lib/artists-data.ts - Danni Blaze photoGallery"],
    status: "used",
  },

  // J Cruz gallery (13 photos) - USED
  {
    path: "/images/j-cruz/07.jpg",
    usedIn: ["lib/artists-data.ts - J Cruz photoGallery"],
    status: "used",
  },
  {
    path: "/images/j-cruz/08.jpg",
    usedIn: ["lib/artists-data.ts - J Cruz photoGallery"],
    status: "used",
  },
  {
    path: "/images/j-cruz/09.jpg",
    usedIn: ["lib/artists-data.ts - J Cruz photoGallery"],
    status: "used",
  },
  {
    path: "/images/j-cruz/10.jpg",
    usedIn: ["lib/artists-data.ts - J Cruz photoGallery"],
    status: "used",
  },
  {
    path: "/images/j-cruz/11.jpg",
    usedIn: ["lib/artists-data.ts - J Cruz photoGallery"],
    status: "used",
  },
  {
    path: "/images/j-cruz/12.jpg",
    usedIn: ["lib/artists-data.ts - J Cruz photoGallery"],
    status: "used",
  },
  {
    path: "/images/j-cruz/13.jpg",
    usedIn: ["lib/artists-data.ts - J Cruz photoGallery"],
    status: "used",
  },
  {
    path: "/images/j-cruz/14.jpg",
    usedIn: ["lib/artists-data.ts - J Cruz photoGallery"],
    status: "used",
  },
  {
    path: "/images/j-cruz/15.jpg",
    usedIn: ["lib/artists-data.ts - J Cruz photoGallery"],
    status: "used",
  },
  {
    path: "/images/j-cruz/16.jpg",
    usedIn: ["lib/artists-data.ts - J Cruz photoGallery"],
    status: "used",
  },
  {
    path: "/images/j-cruz/17.jpg",
    usedIn: ["lib/artists-data.ts - J Cruz photoGallery"],
    status: "used",
  },
  {
    path: "/images/j-cruz/18.jpg",
    usedIn: ["lib/artists-data.ts - J Cruz photoGallery"],
    status: "used",
  },
  {
    path: "/images/j-cruz/19.jpg",
    usedIn: ["lib/artists-data.ts - J Cruz photoGallery"],
    status: "used",
  },

  // Lucas Meno gallery (20 photos) - USED
  {
    path: "/images/lucas-meno/07.jpg",
    usedIn: ["lib/artists-data.ts - Lucas Meno photoGallery"],
    status: "used",
  },
  {
    path: "/images/lucas-meno/08.jpg",
    usedIn: ["lib/artists-data.ts - Lucas Meno photoGallery"],
    status: "used",
  },
  {
    path: "/images/lucas-meno/09.jpg",
    usedIn: ["lib/artists-data.ts - Lucas Meno photoGallery"],
    status: "used",
  },
  {
    path: "/images/lucas-meno/10.jpg",
    usedIn: ["lib/artists-data.ts - Lucas Meno photoGallery"],
    status: "used",
  },
  {
    path: "/images/lucas-meno/11.jpg",
    usedIn: ["lib/artists-data.ts - Lucas Meno photoGallery"],
    status: "used",
  },
  {
    path: "/images/lucas-meno/12.jpg",
    usedIn: ["lib/artists-data.ts - Lucas Meno photoGallery"],
    status: "used",
  },
  {
    path: "/images/lucas-meno/13.jpg",
    usedIn: ["lib/artists-data.ts - Lucas Meno photoGallery"],
    status: "used",
  },
  {
    path: "/images/lucas-meno/14.jpg",
    usedIn: ["lib/artists-data.ts - Lucas Meno photoGallery"],
    status: "used",
  },
  {
    path: "/images/lucas-meno/15.jpg",
    usedIn: ["lib/artists-data.ts - Lucas Meno photoGallery"],
    status: "used",
  },
  {
    path: "/images/lucas-meno/16.jpg",
    usedIn: ["lib/artists-data.ts - Lucas Meno photoGallery"],
    status: "used",
  },
  {
    path: "/images/lucas-meno/17.jpg",
    usedIn: ["lib/artists-data.ts - Lucas Meno photoGallery"],
    status: "used",
  },
  {
    path: "/images/lucas-meno/18.jpg",
    usedIn: ["lib/artists-data.ts - Lucas Meno photoGallery"],
    status: "used",
  },
  {
    path: "/images/lucas-meno/19.jpg",
    usedIn: ["lib/artists-data.ts - Lucas Meno photoGallery"],
    status: "used",
  },
  {
    path: "/images/lucas-meno/20.jpg",
    usedIn: ["lib/artists-data.ts - Lucas Meno photoGallery"],
    status: "used",
  },
  {
    path: "/images/lucas-meno/21.jpg",
    usedIn: ["lib/artists-data.ts - Lucas Meno photoGallery"],
    status: "used",
  },
  {
    path: "/images/lucas-meno/22.jpg",
    usedIn: ["lib/artists-data.ts - Lucas Meno photoGallery"],
    status: "used",
  },
  {
    path: "/images/lucas-meno/23.jpg",
    usedIn: ["lib/artists-data.ts - Lucas Meno photoGallery"],
    status: "used",
  },
  {
    path: "/images/lucas-meno/24.jpg",
    usedIn: ["lib/artists-data.ts - Lucas Meno photoGallery"],
    status: "used",
  },
  {
    path: "/images/lucas-meno/25.jpg",
    usedIn: ["lib/artists-data.ts - Lucas Meno photoGallery"],
    status: "used",
  },
  {
    path: "/images/lucas-meno/26.jpg",
    usedIn: ["lib/artists-data.ts - Lucas Meno photoGallery"],
    status: "used",
  },

  // Riven Cole gallery (20 photos) - USED
  {
    path: "/images/riven-cole/01.jpg",
    usedIn: ["lib/artists-data.ts - Riven Cole photoGallery"],
    status: "used",
  },
  {
    path: "/images/riven-cole/02.jpg",
    usedIn: ["lib/artists-data.ts - Riven Cole photoGallery"],
    status: "used",
  },
  {
    path: "/images/riven-cole/03.jpg",
    usedIn: ["lib/artists-data.ts - Riven Cole photoGallery"],
    status: "used",
  },
  {
    path: "/images/riven-cole/04.jpg",
    usedIn: ["lib/artists-data.ts - Riven Cole photoGallery"],
    status: "used",
  },
  {
    path: "/images/riven-cole/05.jpg",
    usedIn: ["lib/artists-data.ts - Riven Cole photoGallery"],
    status: "used",
  },
  {
    path: "/images/riven-cole/06.jpg",
    usedIn: ["lib/artists-data.ts - Riven Cole photoGallery"],
    status: "used",
  },
  {
    path: "/images/riven-cole/07.jpg",
    usedIn: ["lib/artists-data.ts - Riven Cole photoGallery"],
    status: "used",
  },
  {
    path: "/images/riven-cole/08.jpg",
    usedIn: ["lib/artists-data.ts - Riven Cole photoGallery"],
    status: "used",
  },
  {
    path: "/images/riven-cole/09.jpg",
    usedIn: ["lib/artists-data.ts - Riven Cole photoGallery"],
    status: "used",
  },
  {
    path: "/images/riven-cole/10.jpg",
    usedIn: ["lib/artists-data.ts - Riven Cole photoGallery"],
    status: "used",
  },
  {
    path: "/images/riven-cole/11.jpg",
    usedIn: ["lib/artists-data.ts - Riven Cole photoGallery"],
    status: "used",
  },
  {
    path: "/images/riven-cole/12.jpg",
    usedIn: ["lib/artists-data.ts - Riven Cole photoGallery"],
    status: "used",
  },
  {
    path: "/images/riven-cole/13.jpg",
    usedIn: ["lib/artists-data.ts - Riven Cole photoGallery"],
    status: "used",
  },
  {
    path: "/images/riven-cole/14.jpg",
    usedIn: ["lib/artists-data.ts - Riven Cole photoGallery"],
    status: "used",
  },
  {
    path: "/images/riven-cole/15.jpg",
    usedIn: ["lib/artists-data.ts - Riven Cole photoGallery"],
    status: "used",
  },
  {
    path: "/images/riven-cole/16.jpg",
    usedIn: ["lib/artists-data.ts - Riven Cole photoGallery"],
    status: "used",
  },
  {
    path: "/images/riven-cole/17.jpg",
    usedIn: ["lib/artists-data.ts - Riven Cole photoGallery"],
    status: "used",
  },
  {
    path: "/images/riven-cole/18.jpg",
    usedIn: ["lib/artists-data.ts - Riven Cole photoGallery"],
    status: "used",
  },
  {
    path: "/images/riven-cole/19.jpg",
    usedIn: ["lib/artists-data.ts - Riven Cole photoGallery"],
    status: "used",
  },
  {
    path: "/images/riven-cole/20.jpg",
    usedIn: ["lib/artists-data.ts - Riven Cole photoGallery"],
    status: "used",
  },
  {
    path: "/images/sadie-rose.jpg",
    usedIn: ["lib/artists-data.ts"],
    status: "used",
  },
  {
    path: "/images/lunah.jpg",
    usedIn: ["lib/artists-data.ts"],
    status: "used",
  },
  {
    path: "/images/cedar-line.jpg",
    usedIn: ["lib/artists-data.ts"],
    status: "used",
  },
]

// Summary of audit results
export const auditSummary = {
  totalImages: imageAudit.length,
  usedImages: imageAudit.filter((img) => img.status === "used").length,
  unusedImages: imageAudit.filter((img) => img.status === "unused").length,
  duplicateImages: imageAudit.filter((img) => img.status === "duplicate").length,

  // Categories
  brandAssets: 4,
  compilationCovers: 4,
  aboutPageImages: 5,
  artistProfiles: 12,
  heroImages: 12,
  designReferences: 2,
  photoGalleries: {
    "neilly-storm": 27,
    "luv-tonez": 14,
    saka: 18,
    "virgo-dunst": 23,
    neka: 12,
    "danni-blaze": 19,
    "j-cruz": 13,
    "lucas-meno": 20,
    "riven-cole": 20,
    "sadie-rose": 12,
    lunah: 6,
    "cedar-line": 15,
  },
}

// Files that were identified as unused and removed
export const removedFiles = [
  "/images/virgo-dunst/22.jpg", // Duplicate/unused file that was replaced
]
