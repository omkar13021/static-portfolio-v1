import type { ContactContent } from '@/types/content';

/**
 * The final cinematic ending — night sky, character looking outward (REQUIREMENTS §5,
 * final chapter). Five CTAs in fixed order. Replace hrefs / resume file (§15).
 */
export const CONTACT: ContactContent = {
  closing: {
    title: 'Every story is unfinished.',
    body: 'Thank you for becoming part of mine.',
  },
  ctas: [
    { label: "Let's talk", href: 'mailto:dev@zodix.net', kind: 'lets-talk' },
    { label: 'Résumé', href: '/resume.pdf', kind: 'resume' },
    { label: 'GitHub', href: 'https://github.com/', kind: 'github' },
    { label: 'LinkedIn', href: 'https://linkedin.com/', kind: 'linkedin' },
    { label: 'Email', href: 'mailto:dev@zodix.net', kind: 'email' },
  ],
};
