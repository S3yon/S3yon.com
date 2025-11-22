'use client';

import RetroAvatar from '@/components/RetroAvatar';
import SpotifyNowPlaying from '@/components/SpotifyNowPlaying';
import Timeline from '@/components/Timeline';
import CyclingCharacter from '@/components/CyclingCharacter';
import Villager from '@/components/Villager';
import Image from 'next/image';

const socialLinks = [
  { name: 'LinkedIn', icon: '/icons/linkedin.png', url: 'https://www.linkedin.com/in/seyon-sri/' },
  { name: 'GitHub', icon: '/icons/github.png', url: 'https://github.com/S3yon' },
  { name: 'Twitter', icon: '/icons/twitter.png', url: 'https://x.com/s3yon_' },
  { name: 'Instagram', icon: '/icons/instagram.png', url: 'https://www.instagram.com/s3yon' },
  { name: 'Spotify', icon: '/icons/spotify.png', url: 'https://open.spotify.com/user/9sdlhhtex6e98muw4ls6l8d1e' },
  { name: 'Email', icon: '/icons/email.png', url: 'mailto:sriskans@sheridancollege.ca' },
];

export default function Home() {
  return (
    <div className="bg-retro-white retro-scanlines p-4 lg:p-6 xl:p-8 overflow-x-hidden relative min-h-screen">
      {/* Town Scene - Buildings on both sides of road */}
      <div className="town-scene fixed right-0 top-0 h-full w-[500px] z-10 hidden lg:block pointer-events-none">
        {/* RIGHT SIDE of road - Buildings closer to edge */}
        <div className="building-parallax absolute right-5 top-[-5%]" style={{ animationDelay: '0s' }}>
          <Image src="/medium-widget-4@3x.png" alt="building" width={130} height={130} className="pixelated opacity-85" loading="lazy" />
        </div>
        <div className="building-parallax absolute right-0 top-[8%]" style={{ animationDelay: '0.5s' }}>
          <Image src="/medium-widget-6@3x.png" alt="building" width={150} height={150} className="pixelated opacity-85" loading="lazy" />
        </div>
        <div className="building-parallax absolute right-10 top-[20%]" style={{ animationDelay: '1s' }}>
          <Image src="/medium-widget-2@3x.png" alt="building" width={130} height={130} className="pixelated opacity-80" loading="lazy" />
        </div>
        <div className="building-parallax absolute right-5 top-[32%]" style={{ animationDelay: '1.5s' }}>
          <Image src="/medium-widget-4@3x.png" alt="building" width={140} height={140} className="pixelated opacity-85" loading="lazy" />
        </div>
        <div className="building-parallax absolute right-0 top-[44%]" style={{ animationDelay: '2s' }}>
          <Image src="/medium-widget-6@3x.png" alt="building" width={150} height={150} className="pixelated opacity-80" loading="lazy" />
        </div>
        <div className="building-parallax absolute right-8 top-[56%]" style={{ animationDelay: '2.5s' }}>
          <Image src="/medium-widget-2@3x.png" alt="building" width={130} height={130} className="pixelated opacity-85" loading="lazy" />
        </div>
        <div className="building-parallax absolute right-3 top-[68%]" style={{ animationDelay: '3s' }}>
          <Image src="/medium-widget-4@3x.png" alt="building" width={140} height={140} className="pixelated opacity-80" loading="lazy" />
        </div>
        <div className="building-parallax absolute right-0 top-[80%]" style={{ animationDelay: '3.5s' }}>
          <Image src="/medium-widget-6@3x.png" alt="building" width={150} height={150} className="pixelated opacity-85" loading="lazy" />
        </div>
        <div className="building-parallax absolute right-10 top-[92%]" style={{ animationDelay: '4s' }}>
          <Image src="/medium-widget-2@3x.png" alt="building" width={130} height={130} className="pixelated opacity-80" loading="lazy" />
        </div>
        <div className="building-parallax absolute right-5 top-[104%]" style={{ animationDelay: '4.5s' }}>
          <Image src="/medium-widget-4@3x.png" alt="building" width={140} height={140} className="pixelated opacity-85" loading="lazy" />
        </div>

        {/* LEFT SIDE of road - Buildings on the other side */}
        <div className="building-parallax absolute right-[280px] top-[0%]" style={{ animationDelay: '0.2s' }}>
          <Image src="/medium-widget-2@3x.png" alt="building" width={130} height={130} className="pixelated opacity-80" loading="lazy" />
        </div>
        <div className="building-parallax absolute right-[290px] top-[12%]" style={{ animationDelay: '0.7s' }}>
          <Image src="/medium-widget-6@3x.png" alt="building" width={150} height={150} className="pixelated opacity-85" loading="lazy" />
        </div>
        <div className="building-parallax absolute right-[275px] top-[24%]" style={{ animationDelay: '1.2s' }}>
          <Image src="/medium-widget-4@3x.png" alt="building" width={140} height={140} className="pixelated opacity-80" loading="lazy" />
        </div>
        <div className="building-parallax absolute right-[285px] top-[36%]" style={{ animationDelay: '1.7s' }}>
          <Image src="/medium-widget-2@3x.png" alt="building" width={130} height={130} className="pixelated opacity-85" loading="lazy" />
        </div>
        <div className="building-parallax absolute right-[290px] top-[48%]" style={{ animationDelay: '2.2s' }}>
          <Image src="/medium-widget-6@3x.png" alt="building" width={150} height={150} className="pixelated opacity-80" loading="lazy" />
        </div>
        <div className="building-parallax absolute right-[278px] top-[60%]" style={{ animationDelay: '2.7s' }}>
          <Image src="/medium-widget-4@3x.png" alt="building" width={140} height={140} className="pixelated opacity-85" loading="lazy" />
        </div>
        <div className="building-parallax absolute right-[288px] top-[72%]" style={{ animationDelay: '3.2s' }}>
          <Image src="/medium-widget-2@3x.png" alt="building" width={130} height={130} className="pixelated opacity-80" loading="lazy" />
        </div>
        <div className="building-parallax absolute right-[292px] top-[84%]" style={{ animationDelay: '3.7s' }}>
          <Image src="/medium-widget-6@3x.png" alt="building" width={150} height={150} className="pixelated opacity-85" loading="lazy" />
        </div>
        <div className="building-parallax absolute right-[280px] top-[96%]" style={{ animationDelay: '4.2s' }}>
          <Image src="/medium-widget-4@3x.png" alt="building" width={140} height={140} className="pixelated opacity-80" loading="lazy" />
        </div>
        <div className="building-parallax absolute right-[290px] top-[108%]" style={{ animationDelay: '4.7s' }}>
          <Image src="/medium-widget-2@3x.png" alt="building" width={130} height={130} className="pixelated opacity-85" loading="lazy" />
        </div>

        {/* Truck - positioned on right side */}
        <div className="building-parallax absolute right-15 top-[52%]" style={{ animationDelay: '2.4s', zIndex: 10 }}>
          <Image
            src="/truck.png"
            alt="truck"
            width={50}
            height={50}
            className="pixelated opacity-90"
            priority
          />
        </div>

        {/* Villager on left side of road */}
        <div className="building-parallax absolute right-[310px] top-[40%]" style={{ animationDelay: '3.5s' }}>
          <Villager name="oak" startPosition={{ x: 0, y: 0 }} scale={1.3} />
        </div>
      </div>

      {/* Retro Road - Hidden on mobile/tablet */}
      <div className="retro-road hidden lg:block">
        <div className="road-lines"></div>
      </div>

      {/* Cycling Character - Hidden on mobile/tablet */}
      <div className="hidden lg:block">
        <CyclingCharacter />
      </div>

      {/* Static Left Side Images */}
      <div className="fixed -left-20 lg:-left-16 xl:-left-20 top-0 h-full w-[500px] lg:w-[550px] xl:w-[600px] z-10 hidden lg:block pointer-events-none">
        {/* Big Camera */}
        <div className="absolute left-0 top-[-15%] lg:top-[-12%] xl:top-[-8%]">
          <Image src="/bigcamera.png" alt="photography" width={400} height={400} className="pixelated opacity-80 object-contain" style={{ width: '500px', height: '500px' }} />
        </div>
        {/* Church - More spacing from camera */}
        <div className="absolute left-16 lg:left-18 xl:left-20 top-[28%] lg:top-[30%] xl:top-[32%]">
          <div style={{ transform: 'rotate(-12deg)' }}>
            <Image src="/church.png" alt="church" width={350} height={350} className="pixelated opacity-85 object-contain" style={{ width: '300px', height: '300px' }} />
          </div>
        </div>
        {/* Car - More spacing from church */}
        <div className="absolute left-32 lg:left-36 xl:left-40 top-[52%] lg:top-[54%] xl:top-[56%]">
          <div style={{ transform: 'rotate(18deg)' }}>
            <Image src="/car.png" alt="car" width={250} height={250} className="pixelated opacity-90 object-contain" style={{ width: '300px', height: '300px' }} />
          </div>
        </div>
        {/* Cross - More spacing from car */}
        <div className="absolute left-8 lg:left-9 xl:left-10 top-[74%] lg:top-[76%] xl:top-[78%]">
          <div style={{ transform: 'rotate(-25deg)' }}>
            <Image src="/cross.png" alt="cross" width={300} height={300} className="pixelated opacity-90 object-contain" style={{ width: '300px', height: '300px' }} />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto relative z-20 w-full px-2 sm:px-4 lg:px-6">
        {/* Main Island */}
        <div className="bg-retro-gray-dark border-4 border-retro-black rounded-lg overflow-hidden shadow-lg">

          {/* Header Section */}
          <div className="bg-retro-black border-b-4 border-retro-black p-4 sm:p-6 lg:p-7 xl:p-8">
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-5 lg:gap-6">
              <RetroAvatar />
              <div className="text-center md:text-left">
                <h1 className="text-xl sm:text-2xl font-pixel text-retro-white mb-2">
                  SEYON SRI
                </h1>
                <p className="text-[10px] sm:text-xs font-pixel text-retro-gray-light mb-4">
                  Software Developer · Student · GTA, Canada
                </p>

                {/* Social Icons */}
                <div className="flex gap-2 sm:gap-3 justify-center md:justify-start flex-wrap">
                  {socialLinks.map((link) => (
                    <a
                      key={link.name}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:opacity-70 transition-opacity"
                      title={link.name}
                    >
                      <Image
                        src={link.icon}
                        alt={link.name}
                        width={32}
                        height={32}
                        className="pixelated w-6 h-6 sm:w-8 sm:h-8"
                      />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="p-4 sm:p-6 lg:p-7 xl:p-8">
            <div className="space-y-6 lg:space-y-7 xl:space-y-8">

              {/* Spotify Now Playing */}
              <section>
                <SpotifyNowPlaying />
              </section>

              {/* About */}
              <section>
                <h2 className="text-xs sm:text-sm lg:text-[15px] font-pixel text-retro-white mb-3 lg:mb-4 border-l-4 border-retro-white pl-2">
                  ABOUT
                </h2>
                <div className="text-[10px] sm:text-xs font-pixel text-retro-gray-light leading-relaxed space-y-2">
                  <p>CS student building backend, cloud, and ML projects with real-world impact. Worked on tools in health tech and safety. Always learning by creating.</p>
                  <p className="flex items-center gap-1 flex-wrap">
                    Outside of tech, you'll find me cycling
                    <Image src="/icons/bike.png" alt="cycling" width={24} height={24} className="pixelated inline-block w-5 h-5 sm:w-6 sm:h-6" />,
                    taking photos
                    <Image src="/icons/camera.png" alt="photography" width={24} height={24} className="pixelated inline-block w-5 h-5 sm:w-6 sm:h-6" />,
                    or playing guitar
                    <Image src="/icons/guitar.png" alt="guitar" width={24} height={24} className="pixelated inline-block w-5 h-5 sm:w-6 sm:h-6" />.
                  </p>
                </div>
              </section>

              {/* Skills */}
              <section>
                <h2 className="text-xs sm:text-sm lg:text-[15px] font-pixel text-retro-white mb-3 lg:mb-4 border-l-4 border-retro-white pl-2">
                  SKILLS
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 text-[10px] font-pixel text-retro-gray-light">
                  <div>
                    <p className="text-retro-white mb-1 md:mb-2">LANGUAGES</p>
                    <p className="leading-relaxed">Python, Java, JavaScript, TypeScript, SQL</p>
                  </div>
                  <div>
                    <p className="text-retro-white mb-1 md:mb-2">FRAMEWORKS</p>
                    <p className="leading-relaxed">React, Next.js, Node.js, Spring Boot, FastAPI, PyTorch, TensorFlow</p>
                  </div>
                  <div>
                    <p className="text-retro-white mb-1 md:mb-2">DATABASES</p>
                    <p className="leading-relaxed">MySQL, PostgreSQL, MongoDB, SQLite</p>
                  </div>
                  <div>
                    <p className="text-retro-white mb-1 md:mb-2">TOOLS</p>
                    <p className="leading-relaxed">AWS, Docker, Git, Vercel, Heroku</p>
                  </div>
                </div>
              </section>

              {/* Timeline */}
              <section>
                <Timeline />
              </section>

            </div>
          </div>

          {/* Footer */}
          <div className="bg-retro-black border-t-4 border-retro-black p-4 text-center">
            <p className="text-[10px] font-pixel text-retro-gray-light">
              PORTFOLIO v1.0 · 2025
            </p>
          </div>

        </div>
      </div>

      {/* Minimal scroll space */}
      <div className="h-[20px]"></div>
    </div>
  );
}
