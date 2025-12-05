'use client';

import { useState, useEffect, useRef } from 'react';

interface TimelineEvent {
  date: string;
  type: 'Project' | 'Education' | 'Experience' | 'Volunteer';
  title: string;
  company?: string;
  companyUrl?: string;
  award?: string;
  description: string;
  tech?: string;
  achievements: string[];
  links?: { label: string; url: string }[];
}

interface ScrollProgress {
  progress: number; // 0 to 1
  isVisible: boolean;
}

export default function Timeline() {
  const [scrollProgress, setScrollProgress] = useState<Map<number, ScrollProgress>>(new Map());
  const eventRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rafRef = useRef<number | undefined>(undefined);

  const events: TimelineEvent[] = [
    {
      date: 'November 2025',
      type: 'Project',
      title: 'HemoStat',
      award: 'Most Impactful Award @ DevOps for GenAI',
      description: 'Multi-agent system for Docker container health monitoring and remediation',
      tech: 'Python, Docker, Redis, LangChain, GPT-4, Claude, Prometheus, Grafana',
      achievements: [
        'Built 4-agent system with GPT-4 & Claude integration and production monitoring stack',
      ],
      links: [
        { label: 'GitHub', url: 'https://github.com/S3yon/HemoStat' },
      ],
    },
    {
      date: 'November 2025',
      type: 'Project',
      title: 'AI Datathon',
      company: 'Sheridan Centre for Applied AI',
      description: 'Predictive analytics solution built under time constraints using ML and real-world datasets',
      tech: 'Python, Pandas, Scikit-Learn, Matplotlib, XGBoost',
      achievements: [
        'Developed high-performing ML pipeline for fast exploratory modeling and visualization',
      ],
    },
    {
      date: 'September 2025 – Present',
      type: 'Experience',
      title: 'Machine Learning Developer',
      company: 'Sheridan Centre for Applied AI (CAAI), Oakville, ON',
      companyUrl: 'https://www.sheridancollege.ca/research/centres/applied-ai',
      description: 'Developing diagnostic AI systems using deep learning and preparing models for deployment',
      tech: 'PyTorch, ResNet, MobileNet, OpenCV, CLAHE, FastAPI, Docker',
      achievements: [
        'Built diagnostic AI with 97.2% accuracy and deployed cross-platform with Docker',
      ],
    },
    {
      date: 'July 2025',
      type: 'Project',
      title: '404Cast',
      company: 'Hack404',
      description: 'Full-stack PWA with real-time weather data and Google Maps integration',
      tech: 'React, Vite, Node.js, MongoDB, Express.js, Google Maps API',
      achievements: [
        'Full-stack PWA with Google Maps integration and optimized performance',
      ],
      links: [
        { label: 'DevPost', url: 'https://devpost.com/software/404cast' },
      ],
    },
    {
      date: 'June 2025',
      type: 'Project',
      title: 'PriceValve',
      company: 'SpurHacks',
      description: 'Intelligent game pricing platform for Steam developers',
      tech: 'Next.js 15, TypeScript, Express.js, Node.js, Tailwind CSS, Steam API',
      achievements: [
        'Real-time game data analysis with revenue optimization engine',
      ],
      links: [
        { label: 'DevPost', url: 'https://devpost.com/software/pricevalve' },
        { label: 'GitHub', url: 'https://github.com/S3yon/PriceValve' },
      ],
    },
    {
      date: 'June 2025',
      type: 'Project',
      title: 'UNO Multiplayer Game',
      company: 'Software Design Fundamentals',
      description: 'Full-featured multiplayer UNO game using OOP & design patterns',
      tech: 'Java, NetBeans, Git, OOP, UML, Design Patterns',
      achievements: [
        '100% rule enforcement across 25+ test scenarios using design patterns',
      ],
    },
    {
      date: 'February 2025',
      type: 'Project',
      title: 'ThyroTrack',
      award: '2nd Place @ AI in Healthcare Hackathon',
      description: 'AI-powered health monitoring app for thyroid patients',
      tech: 'Python, XGBoost, Pandas, Scikit-Learn, Matplotlib, Seaborn, Imblearn',
      achievements: [
        'XGBoost model with 91% accuracy for tracking 10+ health metrics',
      ],
    },
    {
      date: 'September 2025',
      type: 'Volunteer',
      title: 'Volunteer Staff',
      company: 'Hack the North',
      companyUrl: 'https://www.linkedin.com/company/hack-the-north/',
      description: "Supported Canada's largest hackathon, assisting 1000+ participants",
      achievements: [
        'Helped manage logistics and provided support across event activities',
      ],
    },
    {
      date: 'August 2025',
      type: 'Volunteer',
      title: 'New Student Orientation Volunteer',
      company: 'Sheridan College',
      companyUrl: 'https://www.sheridancollege.ca',
      description: 'Guided incoming students during orientation week and supported campus navigation',
      achievements: [
        'Helped create a positive and welcoming start for new students',
      ],
    },
    {
      date: 'June 2025 – Present',
      type: 'Volunteer',
      title: 'Executive',
      company: 'Sheridan Computer Science Club',
      companyUrl: 'https://www.linkedin.com/company/sheridan-cs-club/',
      description: 'Organizing tech events, workshops, and competitions to increase student engagement',
      achievements: [
        'Led workshops and supported programming events for 200+ students',
      ],
    },
    {
      date: 'June 2025 – Present',
      type: 'Volunteer',
      title: 'Student Volunteer',
      company: 'Sheridan Student Union (SSU)',
      companyUrl: 'https://www.thessu.ca/',
      description: 'Supported campus event operations and student engagement',
      achievements: [
        'Assisted with large-scale events and inclusive community initiatives',
      ],
    },
    {
      date: 'March 2025',
      type: 'Volunteer',
      title: 'Organizer',
      company: 'BearHacks',
      companyUrl: 'https://www.bearhacks.com/',
      description: 'Coordinated registration for 260+ participants at hackathon sponsored by Perplexity, Scotiabank & Google',
      achievements: [
        'Managed participant logistics and event workflows',
      ],
    },
    {
      date: 'May 2024 – August 2027',
      type: 'Education',
      title: 'Sheridan College',
      company: 'Software Development & Network Engineering',
      companyUrl: 'https://www.sheridancollege.ca/programs/computer-systems-technology-software-development-and-network-engineering',
      description: 'Focused on full-stack development, cloud, database systems, and software engineering',
      achievements: [
        '3.9 GPA – Hack the North Staff, CS Club Executive, BearHacks Organizer',
      ],
    },
    {
      date: 'February 2022 – April 2025',
      type: 'Experience',
      title: 'Rental Database & Operations Specialist',
      company: 'Vistek',
      description: 'Managed inventory workflows and supported rental systems for high-volume camera equipment',
      achievements: [
        'Streamlined database workflows and improved day-to-day operational efficiency',
      ],
    },
    {
      date: 'October 2020 – February 2022',
      type: 'Experience',
      title: 'Technical Support Advisor',
      company: 'Transcom (Remote)',
      description: 'Provided remote diagnostics and troubleshooting for 500+ users',
      achievements: [
        'Delivered structured technical support with improvements to user workflows',
      ],
    },
  ];

  useEffect(() => {
    const calculateScrollProgress = () => {
      const newProgress = new Map<number, ScrollProgress>();

      eventRefs.current.forEach((ref, index) => {
        if (!ref) return;

        const rect = ref.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // Calculate when element enters/exits viewport
        // Element starts entering from bottom when its top is at windowHeight
        // Element finishes entering when its top is at 20% of windowHeight
        // Element starts exiting when its bottom is at 80% of windowHeight
        // Element finishes exiting when its bottom is at 0

        const enterStart = windowHeight;
        const enterEnd = windowHeight * 0.2;
        const exitStart = windowHeight * 0.8;
        const exitEnd = 0;

        let progress = 0;
        let isVisible = false;

        // Element is entering from bottom
        if (rect.top <= enterStart && rect.top >= enterEnd) {
          progress = 1 - ((rect.top - enterEnd) / (enterStart - enterEnd));
          isVisible = true;
        }
        // Element is fully visible
        else if (rect.top < enterEnd && rect.bottom > exitStart) {
          progress = 1;
          isVisible = true;
        }
        // Element is exiting from top
        else if (rect.bottom <= exitStart && rect.bottom >= exitEnd) {
          progress = rect.bottom / exitStart;
          isVisible = true;
        }
        // Element is completely off screen
        else {
          progress = 0;
          isVisible = false;
        }

        // Clamp progress between 0 and 1
        progress = Math.max(0, Math.min(1, progress));

        newProgress.set(index, { progress, isVisible });
      });

      setScrollProgress(newProgress);
    };

    const handleScroll = () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }

      rafRef.current = requestAnimationFrame(calculateScrollProgress);
    };

    // Initial calculation
    calculateScrollProgress();

    // Listen to scroll events
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  const getTypeIcon = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'Project': return '[P]';
      case 'Education': return '[E]';
      case 'Experience': return '[W]';
      case 'Volunteer': return '[V]';
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {events.map((event, index) => {
        const itemProgress = scrollProgress.get(index);
        const progress = itemProgress?.progress ?? 0;

        // Subtle easing function
        const easeOutQuad = (t: number) => t * (2 - t);
        const easedProgress = easeOutQuad(progress);

        // More subtle transform values - mobile friendly
        const translateY = (1 - easedProgress) * 20; // Reduced from 60px to 20px
        const opacity = 0.3 + (easedProgress * 0.7); // Start at 0.3 instead of 0 for readability

        return (
          <div
            key={index}
            ref={(el) => { eventRefs.current[index] = el; }}
            className="border-2 border-retro-gray dark:border-retro-tan-dark rounded p-3 sm:p-4 lg:p-5 bg-retro-gray-dark dark:bg-retro-black transition-colors duration-300 w-full"
            style={{
              opacity,
              transform: `translateY(${translateY}px)`,
              transition: 'border-color 0.3s, background-color 0.3s',
            }}
          >
            <div className="timeline-item-content">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2 sm:mb-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] sm:text-[11px] lg:text-xs font-pixel text-retro-gray-light dark:text-retro-tan-dark transition-colors duration-300 shrink-0">
                  {getTypeIcon(event.type)}
                </span>
                <span className="text-[10px] sm:text-[11px] lg:text-xs font-pixel text-retro-gray-light dark:text-retro-tan-dark transition-colors duration-300 break-words overflow-wrap-anywhere">
                  {event.date}
                </span>
              </div>
              {event.award && (
                <span className="text-[9px] sm:text-[10px] lg:text-[11px] bg-retro-white dark:bg-retro-tan text-retro-black dark:text-retro-black px-2 py-1 rounded font-pixel transition-colors duration-300 break-words overflow-wrap-anywhere leading-relaxed inline-block max-w-full">
                  {event.award}
                </span>
              )}
            </div>

            {/* Title & Company */}
            <h3 className="text-xs sm:text-sm lg:text-base font-pixel text-retro-white dark:text-retro-tan mb-2 break-words overflow-wrap-anywhere leading-relaxed">
              {event.title}
            </h3>
            {event.company && (
              event.companyUrl ? (
                <a
                  href={event.companyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] sm:text-[11px] lg:text-xs font-pixel text-retro-gray-light dark:text-retro-tan-dark mb-2 sm:mb-3 break-words overflow-wrap-anywhere leading-relaxed hover:text-retro-white dark:hover:text-retro-tan transition-colors inline-block underline"
                >
                  {event.company}
                </a>
              ) : (
                <p className="text-[10px] sm:text-[11px] lg:text-xs font-pixel text-retro-gray-light dark:text-retro-tan-dark mb-2 sm:mb-3 break-words overflow-wrap-anywhere leading-relaxed">
                  {event.company}
                </p>
              )
            )}

            {/* Description */}
            <p className="text-[10px] sm:text-[11px] lg:text-xs font-pixel text-retro-white dark:text-retro-tan mb-2 sm:mb-3 leading-relaxed break-words overflow-wrap-anywhere hyphens-auto" lang="en">
              {event.description}
            </p>

            {/* Tech Stack */}
            {event.tech && (
              <div className="bg-retro-black dark:bg-retro-gray-dark border-l-2 border-retro-gray dark:border-retro-tan-dark pl-2 sm:pl-3 py-1 sm:py-2 mb-2 sm:mb-3 w-full">
                <p className="text-[9px] sm:text-[10px] lg:text-[11px] font-pixel text-retro-gray-light dark:text-retro-tan-dark leading-relaxed break-words overflow-wrap-anywhere hyphens-auto" lang="en">
                  {event.tech}
                </p>
              </div>
            )}

            {/* Achievements - no separate animation, follows parent */}
            <div className="space-y-1 sm:space-y-2 mb-2 sm:mb-3 w-full">
              {event.achievements.map((achievement, idx) => (
                <div key={idx} className="achievement-item">
                  <p className="text-[10px] sm:text-[11px] lg:text-xs font-pixel text-retro-white dark:text-retro-tan break-words overflow-wrap-anywhere leading-relaxed hyphens-auto" lang="en">
                    {`▸ ${achievement}`}
                  </p>
                </div>
              ))}
            </div>

            {/* Links */}
            {event.links && event.links.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3 pt-2 sm:pt-3 border-t border-retro-gray dark:border-retro-tan-dark">
                {event.links.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] sm:text-[11px] lg:text-xs font-pixel text-retro-white dark:text-retro-tan bg-retro-black dark:bg-retro-gray-dark px-2 sm:px-3 py-1 sm:py-1.5 border border-retro-gray dark:border-retro-tan-dark hover:bg-retro-gray dark:hover:bg-retro-gray transition-colors inline-block"
                  >
                    {link.label} →
                  </a>
                ))}
              </div>
            )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
