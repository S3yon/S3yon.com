'use client';

import { useState } from 'react';

interface NavigationProps {
  onSectionChange: (section: string) => void;
  currentSection: string;
}

export default function Navigation({ onSectionChange, currentSection }: NavigationProps) {
  const sections = [
    { id: 'bio', label: 'Bio', icon: '👤' },
    { id: 'skills', label: 'Skills', icon: '⚡' },
    { id: 'projects', label: 'Projects', icon: '🎮' },
    { id: 'contact', label: 'Contact', icon: '✉' },
  ];

  return (
    <div className="flex flex-col gap-2">
      {sections.map((section) => (
        <button
          key={section.id}
          onClick={() => onSectionChange(section.id)}
          className={`
            text-left px-4 py-3 text-xs border-4 rounded-lg transition-all
            ${currentSection === section.id
              ? 'bg-gameboy-dark text-gameboy-light border-gameboy-mid-light'
              : 'bg-gameboy-mid-light text-gameboy-dark border-gameboy-dark hover:bg-gameboy-lightest'
            }
          `}
          style={{ boxShadow: currentSection === section.id ? 'inset 2px 2px 0px rgba(0,0,0,0.3)' : '2px 2px 0px #0f380f' }}
        >
          <span className="mr-2">{section.icon}</span>
          {section.label}
        </button>
      ))}
    </div>
  );
}
