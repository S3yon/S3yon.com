export default function Contact() {
  const contactLinks = [
    {
      label: 'Email',
      value: 'sriskans@sheridancollege.ca',
      href: 'mailto:sriskans@sheridancollege.ca',
      icon: '📧'
    },
    {
      label: 'Phone',
      value: '+1 (416) 409-0865',
      href: 'tel:+14164090865',
      icon: '📱'
    },
    {
      label: 'GitHub',
      value: 'github.com/S3yon',
      href: 'https://github.com/S3yon',
      icon: '💻'
    },
    {
      label: 'LinkedIn',
      value: 'linkedin.com/in/seyon-sri',
      href: 'https://linkedin.com/in/seyon-sri',
      icon: '💼'
    }
  ];

  return (
    <div className="space-y-4">
      <div className="dialog-box">
        <h2 className="text-xl mb-4 text-gameboy-dark">Contact</h2>
        <p className="text-xs leading-relaxed text-gameboy-dark">
          Let's connect! Feel free to reach out:
        </p>
      </div>

      <div className="dialog-box space-y-4">
        {contactLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target={link.href.startsWith('http') ? '_blank' : undefined}
            rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
            className="block hover:bg-gameboy-mid-light p-3 rounded border-2 border-gameboy-dark transition-colors"
          >
            <div className="flex items-start gap-3">
              <span className="text-lg">{link.icon}</span>
              <div>
                <p className="text-xs font-bold text-gameboy-dark">{link.label}</p>
                <p className="text-xs text-gameboy-mid-dark break-all">{link.value}</p>
              </div>
            </div>
          </a>
        ))}
      </div>

      <div className="dialog-box">
        <h3 className="text-sm mb-3 text-gameboy-dark">Involvements</h3>
        <div className="text-xs leading-relaxed text-gameboy-dark space-y-2">
          <p>🎯 Hack the North - Volunteer Staff (Sep 2025)</p>
          <p>💻 Sheridan Computer Science Club - Executive, Developer</p>
          <p>🚀 BearHacks - Organizer (Feb-March 2025)</p>
        </div>
      </div>
    </div>
  );
}
