'use client';

import RetroAvatar from '@/components/RetroAvatar';
import SpotifyNowPlaying from '@/components/SpotifyNowPlaying';
import Timeline from '@/components/Timeline';
import CyclingCharacter from '@/components/CyclingCharacter';
import Villager from '@/components/Villager';
import CRTOverlay from '@/components/CRTOverlay';
import Image from 'next/image';

const socialLinks = [
  { name: 'LinkedIn', icon: '/icons/linkedin.png', url: 'https://www.linkedin.com/in/seyon-sri/' },
  { name: 'GitHub', icon: '/icons/github.png', url: 'https://github.com/S3yon' },
  { name: 'Twitter', icon: '/icons/twitter.png', url: 'https://x.com/s3yon_' },
  { name: 'Instagram', icon: '/icons/instagram.png', url: 'https://www.instagram.com/s3yon' },
  { name: 'Spotify', icon: '/icons/spotify.png', url: 'https://open.spotify.com/user/9sdlhhtex6e98muw4ls6l8d1e' },
  { name: 'Email', icon: '/icons/email.png', url: 'mailto:sriskans@sheridancollege.ca' },
];

// Static grass positions - improved distribution for natural look
const GRASS_POSITIONS = (() => {
  const positions = [];
  const seededRandom = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  // Left side of road - 40 grass patches (spread across wider area)
  for (let i = 0; i < 40; i++) {
    const seed = i * 123.456;
    const clusterOffset = Math.floor(i / 5) * 0.5; // Create micro-clusters
    positions.push({
      right: Math.round((155 + seededRandom(seed) * 20) * 100) / 100, // Rounded to 2 decimals
      top: Math.round(((i * 2.5) + (seededRandom(seed + 1) * 3.5) + clusterOffset) * 100) / 100, // Rounded to 2 decimals
      size: 22 + Math.floor(seededRandom(seed + 2) * 7), // Varied sizes (22-29px)
      opacity: Math.round((0.6 + seededRandom(seed + 3) * 0.25) * 100) / 100, // Rounded to 2 decimals
    });
  }

  // Right side of road - 40 grass patches (spread across wider area)
  for (let i = 0; i < 40; i++) {
    const seed = (i + 100) * 123.456;
    const clusterOffset = Math.floor(i / 5) * 0.5;
    positions.push({
      right: Math.round((35 + seededRandom(seed) * 35) * 100) / 100, // Rounded to 2 decimals
      top: Math.round(((i * 2.5) + (seededRandom(seed + 1) * 3.5) + clusterOffset) * 100) / 100, // Rounded to 2 decimals
      size: 22 + Math.floor(seededRandom(seed + 2) * 7),
      opacity: Math.round((0.6 + seededRandom(seed + 3) * 0.25) * 100) / 100, // Rounded to 2 decimals
    });
  }

  // Add scattered grass near buildings (left side) - 10 patches
  for (let i = 0; i < 10; i++) {
    const seed = (i + 200) * 98.765;
    positions.push({
      right: Math.round((220 + seededRandom(seed) * 40) * 100) / 100, // Rounded to 2 decimals
      top: Math.round(((i * 10) + (seededRandom(seed + 1) * 8)) * 100) / 100, // Rounded to 2 decimals
      size: 20 + Math.floor(seededRandom(seed + 2) * 6),
      opacity: Math.round((0.55 + seededRandom(seed + 3) * 0.2) * 100) / 100, // Rounded to 2 decimals
    });
  }

  return positions;
})();

export default function Home() {

  return (
    <div className="bg-retro-white dark:bg-retro-gray-dark retro-scanlines p-4 lg:p-6 xl:p-8 overflow-x-hidden relative min-h-screen transition-colors duration-300">
      {/* Town Scene - Buildings on both sides of road - Responsive width */}
      <div className="town-scene fixed right-0 top-0 h-full w-[350px] xl:w-[400px] 2xl:w-[450px] z-10 hidden xl:block pointer-events-none">
        {/* RIGHT SIDE of road - Buildings closer to edge */}
        <div className="building-parallax absolute right-5 top-[-5%]" style={{ animationDelay: '0s', zIndex: 15 }}>
          <Image src="/medium-widget-2@3x.png" alt="building" width={130} height={130} className="pixelated opacity-85" loading="lazy" />
        </div>
        <div className="building-parallax absolute right-0 top-[8%]" style={{ animationDelay: '0.5s', zIndex: 15 }}>
          <Image src="/medium-widget-6@3x.png" alt="building" width={150} height={150} className="pixelated opacity-85" loading="lazy" />
        </div>
        <div className="building-parallax absolute right-10 top-[20%]" style={{ animationDelay: '1s', zIndex: 15 }}>
          <Image src="/medium-widget-2@3x.png" alt="building" width={130} height={130} className="pixelated opacity-80" loading="lazy" />
        </div>
        <div className="building-parallax absolute right-5 top-[32%]" style={{ animationDelay: '1.5s', zIndex: 15 }}>
          <Image src="/medium-widget-4@3x.png" alt="building" width={140} height={140} className="pixelated opacity-85" loading="lazy" />
        </div>
        <div className="building-parallax absolute right-0 top-[44%]" style={{ animationDelay: '2s', zIndex: 15 }}>
          <Image src="/medium-widget-6@3x.png" alt="building" width={150} height={150} className="pixelated opacity-80" loading="lazy" />
        </div>
        <div className="building-parallax absolute right-8 top-[56%]" style={{ animationDelay: '2.5s', zIndex: 15 }}>
          <Image src="/medium-widget-2@3x.png" alt="building" width={130} height={130} className="pixelated opacity-85" loading="lazy" />
        </div>
        <div className="building-parallax absolute right-3 top-[68%]" style={{ animationDelay: '3s', zIndex: 15 }}>
          <Image src="/medium-widget-4@3x.png" alt="building" width={140} height={140} className="pixelated opacity-80" loading="lazy" />
        </div>
        <div className="building-parallax absolute right-0 top-[80%]" style={{ animationDelay: '3.5s', zIndex: 15 }}>
          <Image src="/medium-widget-6@3x.png" alt="building" width={150} height={150} className="pixelated opacity-85" loading="lazy" />
        </div>
        <div className="building-parallax absolute right-10 top-[92%]" style={{ animationDelay: '4s', zIndex: 15 }}>
          <Image src="/medium-widget-2@3x.png" alt="building" width={130} height={130} className="pixelated opacity-80" loading="lazy" />
        </div>
        <div className="building-parallax absolute right-5 top-[104%]" style={{ animationDelay: '4.5s', zIndex: 15 }}>
          <Image src="/medium-widget-2@3x.png" alt="building" width={140} height={140} className="pixelated opacity-85" loading="lazy" />
        </div>
        <div className="building-parallax absolute right-8 top-[116%]" style={{ animationDelay: '5s', zIndex: 15 }}>
          <Image src="/small-widget-1@3x.png" alt="building" width={130} height={130} className="pixelated opacity-80" loading="lazy" />
        </div>

        {/* LEFT SIDE of road - Buildings on the other side */}
        <div className="building-parallax absolute right-[260px] top-[0%]" style={{ animationDelay: '0.2s', zIndex: 15 }}>
          <Image src="/medium-widget-2@3x.png" alt="building" width={130} height={130} className="pixelated opacity-80" loading="lazy" />
        </div>
        <div className="building-parallax absolute right-[270px] top-[12%]" style={{ animationDelay: '0.7s', zIndex: 15 }}>
          <Image src="/medium-widget-6@3x.png" alt="building" width={150} height={150} className="pixelated opacity-85" loading="lazy" />
        </div>
        <div className="building-parallax absolute right-[255px] top-[24%]" style={{ animationDelay: '1.2s', zIndex: 15 }}>
          <Image src="/medium-widget-2@3x.png" alt="building" width={140} height={140} className="pixelated opacity-80" loading="lazy" />
        </div>
        <div className="building-parallax absolute right-[265px] top-[36%]" style={{ animationDelay: '1.7s', zIndex: 15 }}>
          <Image src="/medium-widget-2@3x.png" alt="building" width={130} height={130} className="pixelated opacity-85" loading="lazy" />
        </div>
        <div className="building-parallax absolute right-[270px] top-[48%]" style={{ animationDelay: '2.2s', zIndex: 15 }}>
          <Image src="/medium-widget-6@3x.png" alt="building" width={150} height={150} className="pixelated opacity-80" loading="lazy" />
        </div>
        <div className="building-parallax absolute right-[258px] top-[60%]" style={{ animationDelay: '2.7s', zIndex: 15 }}>
          <Image src="/medium-widget-2@3x.png" alt="building" width={140} height={140} className="pixelated opacity-85" loading="lazy" />
        </div>
        <div className="building-parallax absolute right-[268px] top-[72%]" style={{ animationDelay: '3.2s', zIndex: 15 }}>
          <Image src="/medium-widget-2@3x.png" alt="building" width={130} height={130} className="pixelated opacity-80" loading="lazy" />
        </div>
        <div className="building-parallax absolute right-[272px] top-[84%]" style={{ animationDelay: '3.7s', zIndex: 15 }}>
          <Image src="/medium-widget-6@3x.png" alt="building" width={150} height={150} className="pixelated opacity-85" loading="lazy" />
        </div>
        <div className="building-parallax absolute right-[260px] top-[96%]" style={{ animationDelay: '4.2s', zIndex: 15 }}>
          <Image src="/medium-widget-2@3x.png" alt="building" width={140} height={140} className="pixelated opacity-80" loading="lazy" />
        </div>
        <div className="building-parallax absolute right-[270px] top-[108%]" style={{ animationDelay: '4.7s', zIndex: 15 }}>
          <Image src="/medium-widget-2@3x.png" alt="building" width={130} height={130} className="pixelated opacity-85" loading="lazy" />
        </div>
        <div className="building-parallax absolute right-[265px] top-[120%]" style={{ animationDelay: '5.2s', zIndex: 15 }}>
          <Image src="/small-widget-2@3x.png" alt="building" width={130} height={130} className="pixelated opacity-80" loading="lazy" />
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
        <div className="building-parallax absolute right-[285px] top-[40%]" style={{ animationDelay: '3.5s' }}>
          <Villager name="oak" startPosition={{ x: 0, y: 0 }} scale={1.3} />
        </div>

        {/* Nature decorations - Trees, flowers, grass, rocks, signs */}
        {/* Trees between road and buildings - BEHIND buildings Z-INDEX 14 (below buildings) */}
        <div className="absolute right-[180px] top-[7%]" style={{ zIndex: 14 }}>
          <Image src="/tree.png" alt="tree" width={22} height={22} className="pixelated opacity-80" loading="lazy" />
        </div>
        <div className="absolute right-[185px] top-[21%]" style={{ zIndex: 14 }}>
          <Image src="/tree2.png" alt="tree" width={36} height={36} className="pixelated opacity-85" loading="lazy" />
        </div>
        <div className="absolute right-[178px] top-[38%]" style={{ zIndex: 14 }}>
          <Image src="/tree.png" alt="tree" width={20} height={20} className="pixelated opacity-78" loading="lazy" />
        </div>
        <div className="absolute right-[188px] top-[52%]" style={{ zIndex: 14 }}>
          <Image src="/tree2.png" alt="tree" width={42} height={42} className="pixelated opacity-83" loading="lazy" />
        </div>
        <div className="absolute right-[182px] top-[68%]" style={{ zIndex: 14 }}>
          <Image src="/tree.png" alt="tree" width={24} height={24} className="pixelated opacity-85" loading="lazy" />
        </div>
        <div className="absolute right-[186px] top-[83%]" style={{ zIndex: 14 }}>
          <Image src="/tree2.png" alt="tree" width={38} height={38} className="pixelated opacity-81" loading="lazy" />
        </div>

        {/* Trees on RIGHT side - BEHIND buildings Z-INDEX 14 */}
        <div className="absolute right-[75px] top-[9%]" style={{ zIndex: 14 }}>
          <Image src="/tree2.png" alt="tree" width={40} height={40} className="pixelated opacity-83" loading="lazy" />
        </div>
        <div className="absolute right-[82px] top-[23%]" style={{ zIndex: 14 }}>
          <Image src="/tree.png" alt="tree" width={22} height={22} className="pixelated opacity-85" loading="lazy" />
        </div>
        <div className="absolute right-[78px] top-[41%]" style={{ zIndex: 14 }}>
          <Image src="/tree2.png" alt="tree" width={38} height={38} className="pixelated opacity-80" loading="lazy" />
        </div>
        <div className="absolute right-[85px] top-[56%]" style={{ zIndex: 14 }}>
          <Image src="/tree.png" alt="tree" width={20} height={20} className="pixelated opacity-81" loading="lazy" />
        </div>
        <div className="absolute right-[80px] top-[71%]" style={{ zIndex: 14 }}>
          <Image src="/tree2.png" alt="tree" width={36} height={36} className="pixelated opacity-87" loading="lazy" />
        </div>
        <div className="absolute right-[88px] top-[89%]" style={{ zIndex: 14 }}>
          <Image src="/tree.png" alt="tree" width={23} height={23} className="pixelated opacity-83" loading="lazy" />
        </div>

        {/* Optimized Grass patches (80 total) - Generated for performance */}
        {GRASS_POSITIONS.map((grass, idx) => (
          <div
            key={`grass-${idx}`}
            className="absolute"
            style={{
              right: `${grass.right}px`,
              top: `${grass.top}%`,
              zIndex: 1,
            }}
          >
            <Image
              src="/grass.png"
              alt=""
              width={grass.size}
              height={grass.size}
              className="pixelated"
              style={{ opacity: grass.opacity }}
              loading="lazy"
            />
          </div>
        ))}

        {/* Trees near left buildings - BEHIND buildings Z-INDEX 14 */}
        <div className="absolute right-[220px] top-[11%]" style={{ zIndex: 14 }}>
          <Image src="/tree2.png" alt="tree" width={38} height={38} className="pixelated opacity-83" loading="lazy" />
        </div>
        <div className="absolute right-[228px] top-[27%]" style={{ zIndex: 14 }}>
          <Image src="/tree.png" alt="tree" width={23} height={23} className="pixelated opacity-81" loading="lazy" />
        </div>
        <div className="absolute right-[223px] top-[43%]" style={{ zIndex: 14 }}>
          <Image src="/tree2.png" alt="tree" width={44} height={44} className="pixelated opacity-87" loading="lazy" />
        </div>
        <div className="absolute right-[218px] top-[59%]" style={{ zIndex: 14 }}>
          <Image src="/tree2.png" alt="tree" width={36} height={36} className="pixelated opacity-83" loading="lazy" />
        </div>
        <div className="absolute right-[226px] top-[75%]" style={{ zIndex: 14 }}>
          <Image src="/tree.png" alt="tree" width={22} height={22} className="pixelated opacity-82" loading="lazy" />
        </div>
        <div className="absolute right-[221px] top-[91%]" style={{ zIndex: 14 }}>
          <Image src="/tree2.png" alt="tree" width={40} height={40} className="pixelated opacity-85" loading="lazy" />
        </div>

        {/* Flowers scattered on left side of road */}
        <div className="absolute right-[188px] top-[10%]" style={{ zIndex: 3 }}>
          <Image src="/flowers.png" alt="flowers" width={20} height={20} className="pixelated opacity-85" loading="lazy" />
        </div>
        <div className="absolute right-[185px] top-[32%]" style={{ zIndex: 3 }}>
          <Image src="/flowers.png" alt="flowers" width={21} height={21} className="pixelated opacity-85" loading="lazy" />
        </div>
        <div className="absolute right-[190px] top-[54%]" style={{ zIndex: 3 }}>
          <Image src="/flowers.png" alt="flowers" width={20} height={20} className="pixelated opacity-85" loading="lazy" />
        </div>
        <div className="absolute right-[186px] top-[76%]" style={{ zIndex: 3 }}>
          <Image src="/flowers.png" alt="flowers" width={19} height={19} className="pixelated opacity-85" loading="lazy" />
        </div>
        <div className="absolute right-[183px] top-[96%]" style={{ zIndex: 3 }}>
          <Image src="/flowers.png" alt="flowers" width={19} height={19} className="pixelated opacity-85" loading="lazy" />
        </div>

        {/* Flowers scattered on RIGHT side of road */}
        <div className="absolute right-[70px] top-[12%]" style={{ zIndex: 3 }}>
          <Image src="/flowers.png" alt="flowers" width={20} height={20} className="pixelated opacity-85" loading="lazy" />
        </div>
        <div className="absolute right-[52px] top-[26%]" style={{ zIndex: 3 }}>
          <Image src="/flowers.png" alt="flowers" width={21} height={21} className="pixelated opacity-85" loading="lazy" />
        </div>
        <div className="absolute right-[68px] top-[40%]" style={{ zIndex: 3 }}>
          <Image src="/flowers.png" alt="flowers" width={20} height={20} className="pixelated opacity-85" loading="lazy" />
        </div>
        <div className="absolute right-[54px] top-[58%]" style={{ zIndex: 3 }}>
          <Image src="/flowers.png" alt="flowers" width={19} height={19} className="pixelated opacity-85" loading="lazy" />
        </div>
        <div className="absolute right-[72px] top-[72%]" style={{ zIndex: 3 }}>
          <Image src="/flowers.png" alt="flowers" width={19} height={19} className="pixelated opacity-85" loading="lazy" />
        </div>
        <div className="absolute right-[66px] top-[86%]" style={{ zIndex: 3 }}>
          <Image src="/flowers.png" alt="flowers" width={20} height={20} className="pixelated opacity-85" loading="lazy" />
        </div>

        {/* Flowers scattered on left side */}
        <div className="absolute right-[248px] top-[14%]" style={{ zIndex: 3 }}>
          <Image src="/flowers.png" alt="flowers" width={19} height={19} className="pixelated opacity-85" loading="lazy" />
        </div>
        <div className="absolute right-[250px] top-[28%]" style={{ zIndex: 3 }}>
          <Image src="/flowers.png" alt="flowers" width={18} height={18} className="pixelated opacity-85" loading="lazy" />
        </div>
        <div className="absolute right-[247px] top-[42%]" style={{ zIndex: 3 }}>
          <Image src="/flowers.png" alt="flowers" width={22} height={22} className="pixelated opacity-85" loading="lazy" />
        </div>
        <div className="absolute right-[249px] top-[56%]" style={{ zIndex: 3 }}>
          <Image src="/flowers.png" alt="flowers" width={20} height={20} className="pixelated opacity-85" loading="lazy" />
        </div>
        <div className="absolute right-[246px] top-[70%]" style={{ zIndex: 3 }}>
          <Image src="/flowers.png" alt="flowers" width={21} height={21} className="pixelated opacity-85" loading="lazy" />
        </div>
        <div className="absolute right-[248px] top-[84%]" style={{ zIndex: 3 }}>
          <Image src="/flowers.png" alt="flowers" width={19} height={19} className="pixelated opacity-80" loading="lazy" />
        </div>

        {/* Rocks on right side - spread out */}
        <div className="absolute right-[157px] top-[18%]" style={{ zIndex: 2 }}>
          <Image src="/rock.png" alt="rock" width={20} height={20} className="pixelated opacity-80" loading="lazy" />
        </div>
        <div className="absolute right-[196px] top-[44%]" style={{ zIndex: 2 }}>
          <Image src="/rock.png" alt="rock" width={20} height={20} className="pixelated opacity-85" loading="lazy" />
        </div>
        <div className="absolute right-[162px] top-[68%]" style={{ zIndex: 2 }}>
          <Image src="/rock.png" alt="rock" width={20} height={20} className="pixelated opacity-80" loading="lazy" />
        </div>
        <div className="absolute right-[198px] top-[88%]" style={{ zIndex: 2 }}>
          <Image src="/rock.png" alt="rock" width={22} height={22} className="pixelated opacity-85" loading="lazy" />
        </div>

        {/* Rocks on left side - spread out */}
        <div className="absolute right-[223px] top-[12%]" style={{ zIndex: 2 }}>
          <Image src="/rock.png" alt="rock" width={21} height={21} className="pixelated opacity-80" loading="lazy" />
        </div>
        <div className="absolute right-[257px] top-[38%]" style={{ zIndex: 2 }}>
          <Image src="/rock.png" alt="rock" width={21} height={21} className="pixelated opacity-85" loading="lazy" />
        </div>
        <div className="absolute right-[221px] top-[52%]" style={{ zIndex: 2 }}>
          <Image src="/rock.png" alt="rock" width={20} height={20} className="pixelated opacity-80" loading="lazy" />
        </div>
        <div className="absolute right-[258px] top-[74%]" style={{ zIndex: 2 }}>
          <Image src="/rock.png" alt="rock" width={22} height={22} className="pixelated opacity-85" loading="lazy" />
        </div>

        {/* Sign posts */}
        <div className="absolute right-[200px] top-[26%]" style={{ zIndex: 16 }}>
          <Image src="/sign.png" alt="sign" width={32} height={32} className="pixelated opacity-90" loading="lazy" />
        </div>
        <div className="absolute right-[205px] top-[66%]" style={{ zIndex: 16 }}>
          <Image src="/sign.png" alt="sign" width={34} height={34} className="pixelated opacity-90" loading="lazy" />
        </div>
      </div>

      {/* Retro Road - Hidden on mobile/tablet */}
      <div className="retro-road hidden xl:block">
        <div className="road-lines"></div>
      </div>

      {/* Cycling Character - Hidden on mobile/tablet */}
      <div className="hidden xl:block">
        <CyclingCharacter />
      </div>

      {/* Static Left Side Images - Responsive scaling based on screen size */}
      <div className="fixed -left-20 lg:-left-16 xl:-left-20 2xl:-left-24 top-0 h-full w-[500px] lg:w-[550px] xl:w-[750px] 2xl:w-[700px] z-10 hidden xl:block pointer-events-none overflow-hidden">
        {/* Big Camera - Scales with screen size */}
        <div className="absolute left-0 top-[-3%] lg:top-[-2%] xl:top-[-7%]">
          <Image
            src="/bigcamera.png"
            alt="photography"
            width={400}
            height={400}
            className="pixelated opacity-80 object-contain w-[28vw] h-[28vw] max-w-[550px] max-h-[550px] min-w-[400px] min-h-[400px]"
          />
        </div>
        {/* Church - Scales with screen size */}
        <div className="absolute left-16 lg:left-20 xl:left-5 2xl:left-28 top-[26%] lg:top-[27%] xl:top-[28%]">
          <div style={{ transform: 'rotate(-12deg)' }}>
            <Image
              src="/church.png"
              alt="church"
              width={280}
              height={280}
              className="pixelated opacity-85 object-contain w-[22vw] h-[22vw] max-w-[400px] max-h-[400px] min-w-[300px] min-h-[300px]"
            />
          </div>
        </div>
        {/* Car - Scales with screen size */}
        <div className="absolute left-24 lg:left-28 xl:left-40 2xl:left-36 top-[48%] lg:top-[49%] xl:top-[48%]">
          <div style={{ transform: 'rotate(18deg)' }}>
            <Image
              src="/car.png"
              alt="car"
              width={260}
              height={260}
              className="pixelated opacity-90 object-contain w-[21vw] h-[21vw] max-w-[380px] max-h-[380px] min-w-[280px] min-h-[280px]"
            />
          </div>
        </div>
        {/* Cross - Scales with screen size */}
        <div className="absolute left-12 lg:left-16 xl:left-25 2xl:left-24 top-[70%] lg:top-[71%] xl:top-[72%]">
          <div style={{ transform: 'rotate(-25deg)' }}>
            <Image
              src="/cross.png"
              alt="cross"
              width={260}
              height={260}
              className="pixelated opacity-90 object-contain w-[21vw] h-[21vw] max-w-[380px] max-h-[380px] min-w-[280px] min-h-[280px]"
            />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto relative z-20 w-full px-2 sm:px-4 lg:px-6">
        {/* Main Island */}
        <div className="bg-retro-gray-dark dark:bg-retro-black border-4 border-retro-black dark:border-retro-tan rounded-lg overflow-hidden shadow-lg transition-colors duration-300">

          {/* Header Section */}
          <div className="bg-retro-black dark:bg-retro-black border-b-4 border-retro-black dark:border-retro-tan p-4 sm:p-6 lg:p-7 xl:p-8 transition-colors duration-300">
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-5 lg:gap-6">
              <RetroAvatar />
              <div className="text-center md:text-left">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-pixel text-retro-white dark:text-retro-tan mb-3 transition-colors duration-300">
                  SEYON SRI
                </h1>
                <p className="text-xs sm:text-sm font-pixel text-retro-gray-light dark:text-retro-tan-dark mb-5 transition-colors duration-300">
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

              {/* Timeline */}
              <section>
                <Timeline />
              </section>

            </div>
          </div>

          {/* Footer */}
          <div className="bg-retro-black dark:bg-retro-black border-t-4 border-retro-black dark:border-retro-tan p-4 text-center transition-colors duration-300">
            <p className="text-[10px] font-pixel text-retro-gray-light dark:text-retro-tan-dark transition-colors duration-300">
              PORTFOLIO v1.0 · 2025
            </p>
          </div>

        </div>
      </div>

      {/* Minimal scroll space */}
      <div className="h-[20px]"></div>

      {/* CRT TV Effects Overlay */}
      <CRTOverlay />
    </div>
  );
}
