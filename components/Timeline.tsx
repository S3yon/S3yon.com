'use client';

import { useState, useEffect, useRef } from 'react';

interface TimelineEvent {
  date: string;
  type: 'Project' | 'Education' | 'Experience';
  title: string;
  company?: string;
  award?: string;
  description: string;
  tech?: string;
  achievements: string[];
  links?: { label: string; url: string }[];
}

export default function Timeline() {
  const [visibleEvents, setVisibleEvents] = useState<Set<number>>(new Set());
  const eventRefs = useRef<(HTMLDivElement | null)[]>([]);

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
    },
    {
      date: 'September 2025 - Present',
      type: 'Experience',
      title: 'Machine Learning Developer',
      company: 'Sheridan Centre for Applied AI - Oakville, ON',
      description: 'Developing diagnostic AI systems with PyTorch and optimizing for production deployment',
      tech: 'PyTorch, ResNet, MobileNet, OpenCV, CLAHE, FastAPI, Docker',
      achievements: [
        'Built diagnostic AI with 97.2% accuracy and deployed cross-platform with Docker',
      ],
    },
    {
      date: 'June 2025',
      type: 'Project',
      title: 'PriceValve',
      award: 'Built for SpurHacks 2025',
      description: 'Intelligent Steam game pricing platform with revenue optimization',
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
      date: 'April 2025',
      type: 'Project',
      title: 'UNO Multiplayer Game',
      company: 'Software Design Fundamentals',
      description: 'Full-featured multiplayer UNO game built in Java with OOP principles',
      tech: 'Java, NetBeans, Git, OOP, UML, Design Patterns',
      achievements: [
        '100% rule enforcement across 25+ test scenarios with design patterns',
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
      date: 'January 2025',
      type: 'Project',
      title: '404cast',
      description: 'Full-stack weather platform with Progressive Web App functionality',
      tech: 'React, Vite, Node.js, MongoDB, Express.js, Google Maps API',
      achievements: [
        'Full-stack PWA with Google Maps integration and optimized performance',
      ],
      links: [
        { label: 'Live', url: 'https://www.404cast.com' },
        { label: 'DevPost', url: 'https://devpost.com/software/404cast' },
      ],
    },
    {
      date: 'December 2024 - Present',
      type: 'Project',
      title: 'S3YON Portfolio',
      description: 'Modern retro portfolio website with Spotify integration',
      tech: 'Next.js 16, TypeScript, Tailwind CSS, Spotify API',
      achievements: [
        'Retro pixel art aesthetic with live Spotify integration',
      ],
      links: [
        { label: 'Live', url: 'https://seyons.com' },
        { label: 'GitHub', url: 'https://github.com/S3yon/S3yonPortfolio' },
      ],
    },
    {
      date: 'December 15, 2024',
      type: 'Project',
      title: 'Records Management System',
      company: 'Database Design Course',
      description: 'Comprehensive relational database system for student academic records management',
      tech: 'SQL, MySQL Workbench, Database Design, ERD',
      achievements: [
        '10+ normalized tables with 15+ optimized queries',
      ],
    },
    {
      date: 'May 2024 - August 2027',
      type: 'Education',
      title: 'Sheridan College',
      company: 'Software Development & Network Engineering',
      description: 'Computer Science program focused on full-stack development',
      achievements: [
        '3.9 GPA - Hack the North Staff, CS Club Executive, BearHacks Organizer',
      ],
    },
    {
      date: 'October 2020 - February 2022',
      type: 'Experience',
      title: 'Technical Support Advisor',
      company: 'Transcom - Remote',
      description: 'Remote diagnostics and structured troubleshooting for 500+ users',
      achievements: [
        'Provided remote support with system hardening and workflow optimization',
      ],
    },
  ];

  useEffect(() => {
    const observers = eventRefs.current.map((ref, index) => {
      if (!ref) return null;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisibleEvents((prev) => new Set([...prev, index]));
          }
        },
        { threshold: 0.3 }
      );

      observer.observe(ref);
      return observer;
    });

    return () => {
      observers.forEach((observer) => observer?.disconnect());
    };
  }, []);

  const getTypeIcon = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'Project': return '[P]';
      case 'Education': return '[E]';
      case 'Experience': return '[W]';
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <h2 className="text-sm sm:text-lg md:text-xl font-pixel text-retro-white border-l-4 border-retro-white pl-2 sm:pl-3 mb-4 md:mb-6">
        TIMELINE
      </h2>

      {events.map((event, index) => (
        <div
          key={index}
          ref={(el) => { eventRefs.current[index] = el; }}
          className="border-2 border-retro-gray rounded p-3 sm:p-4 bg-retro-gray-dark"
        >
          <div className={`transition-opacity duration-500 ${visibleEvents.has(index) ? 'opacity-100' : 'opacity-0'}`}>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="text-[9px] sm:text-[10px] font-pixel text-retro-gray-light">{getTypeIcon(event.type)}</span>
                <span className="text-[9px] sm:text-[10px] font-pixel text-retro-gray-light">{event.date}</span>
              </div>
              {event.award && (
                <span className="text-[8px] sm:text-[10px] bg-retro-white text-retro-black px-2 py-1 rounded font-pixel">
                  {event.award}
                </span>
              )}
            </div>

            {/* Title & Company */}
            <h3 className="text-xs sm:text-sm font-pixel text-retro-white mb-1">{event.title}</h3>
            {event.company && (
              <p className="text-[9px] sm:text-[10px] font-pixel text-retro-gray-light mb-2">{event.company}</p>
            )}

            {/* Description */}
            <p className="text-[9px] sm:text-[10px] font-pixel text-retro-white mb-2 leading-relaxed">{event.description}</p>

            {/* Tech Stack */}
            {event.tech && (
              <p className="text-[9px] sm:text-[10px] font-pixel text-retro-gray-light mb-2 leading-relaxed">
                <span className="font-bold">Tech:</span> {event.tech}
              </p>
            )}

            {/* Achievements with typing effect */}
            <div className="space-y-1">
              {event.achievements.map((achievement, idx) => (
                <p
                  key={idx}
                  className={`text-[9px] sm:text-[10px] font-pixel text-retro-white typing-text ${
                    visibleEvents.has(index) ? 'typing' : ''
                  }`}
                  style={{
                    animationDelay: `${idx * 0.3}s`,
                  }}
                >
                  {`> ${achievement}`}
                </p>
              ))}
            </div>

            {/* Links */}
            {event.links && event.links.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {event.links.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[9px] sm:text-[10px] font-pixel text-retro-white underline hover:text-retro-gray-light"
                  >
                    [{link.label}]
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
