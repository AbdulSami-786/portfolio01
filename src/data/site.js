// ─────────────────────────────────────────────────────────────
//  Everything you'd want to edit lives in this file.
//  Text, links, email, projects and each category's process.
// ─────────────────────────────────────────────────────────────

import designs from './designs.json'

export const site = {
  name: 'Maya James',
  roles: ['Video Editor', 'Graphic Designer', '3D Motion Artist'],
  mantra: ['Dream', 'Create', 'Edit'],
  // TODO: replace with your real email — the contact form sends here.
  email: 'hello@example.com',
  // Leave a link empty ('') to hide that button.
  socials: [
    { label: 'YouTube', href: '' },
    { label: 'Instagram', href: '' },
    { label: 'Twitter / X', href: '' },
    { label: 'Facebook', href: '' },
    { label: 'Upwork', href: '' },
  ],
}

// ─── Visitor tracking → Google Sheet ─────────────────────────
// Paste the Web app URL from your Google Apps Script here (see tracking/SETUP.md).
// Leave it empty ('') to switch tracking off completely.
export const analytics = {
  endpoint: 'https://script.google.com/macros/s/AKfycbwUViYxCS7BTLX5IREg3km3YAxbqvxjgYzmKkNESDU5rYhRdtOplbH8FEkgfdsvYTAX/exec',
}

// Software shown on your channel banner.
export const tools = [
  { code: 'Pr', name: 'Premiere Pro', hue: 'from-indigo-500/40 to-violet-700/40', text: 'text-indigo-200' },
  { code: 'Ae', name: 'After Effects', hue: 'from-fuchsia-500/40 to-purple-800/40', text: 'text-fuchsia-200' },
  { code: 'Ps', name: 'Photoshop', hue: 'from-sky-500/40 to-blue-800/40', text: 'text-sky-200' },
  { code: 'Bl', name: 'Blender', hue: 'from-orange-500/40 to-amber-700/40', text: 'text-orange-200' },
]

export const marquee = [
  'Video Editing',
  'Motion Graphics',
  '2D Animation',
  'Voice-Over',
  'Graphic Design',
  'Thumbnails',
  'Channel Banners',
  'Storytelling',
]

// ─── Work, grouped by category ───────────────────────────────
// Each category gets its own page at /#/<slug>.
// group.kind: 'video' | 'thumb' | 'banner'

const videoEditing = [
  {
    id: 'saas-ad',
    title: 'SaaS Product Ad',
    desc: 'A short B2B promo that walks through a software product, using screen recordings, UI zooms and smooth transitions.',
    src: '/media/video/b2b-saas-ad.mp4',
    poster: '/media/img/poster-b2b-saas-ad.jpg',
    duration: '0:32',
  },
  {
    id: 'sports-edit',
    title: 'Sports Promo Edit',
    desc: 'A fast-paced fitness and sports promo, cut around movement, rhythm and strong close-up shots.',
    src: '/media/video/edit-reel.mp4',
    poster: '/media/img/poster-edit-reel.jpg',
    duration: '0:41',
  },
  {
    id: 'brand-case',
    title: 'Brand Case-Study Film',
    desc: 'A customer story that combines interview footage, animated illustrations, screen captures and subtitles.',
    src: '/media/video/brand-case-study.mp4',
    poster: '/media/img/poster-brand-case-study.jpg',
    duration: '1:53',
  },
]

const thumbnails = [
  { src: '/media/img/thumb-6.jpg', title: 'The New American Housing Crisis Has Landed', views: '2.4M', runtime: '15:21' },
  { src: '/media/img/thumb-5.jpg', title: 'The Stock Market Is Being Used as a Dumping Ground', views: '1.4M', runtime: '17:23' },
  { src: '/media/img/thumb-3.jpg', title: 'This Time the Stock Market Crash Hits Everything', views: '938K', runtime: '15:41' },
  { src: '/media/img/thumb-4.jpg', title: "The Money Squeeze That's Choking the Economy", views: '859K', runtime: '16:37' },
  { src: '/media/img/thumb-2.jpg', title: "The World's Next Great Crisis Just Started With France", views: '824K', runtime: '18:15' },
  { src: '/media/img/thumb-1.jpg', title: 'The $3.1 Trillion Real Estate Crisis Nobody Sees Coming', views: '607K', runtime: '15:37' },
]

const banners = [
  { src: '/media/img/banner.png', title: 'Creative Studio Banner', label: 'Personal brand banner' },
  { src: '/media/img/channel-banner.jpg', title: 'Illustrated Channel Banner', label: '2D illustrated channel art' },
]

// Print & brand design — sections of the Graphic Design page, in this order.
// Images + sizes come from designs.json (made by scripts/import-designs.py); re-running it never touches this text.
// cols: columns in the gallery on desktop (2 for wide pieces, 3 for compact ones). kind 'banner' = full width.
const designGroup = ({ slug, title, noun, note, cols = 3, kind = 'design' }) => ({
  kind,
  cols,
  id: slug,
  title,
  note,
  items: designs[slug].map((d, i) => ({
    ...d,
    title: `${noun} ${String(i + 1).padStart(2, '0')}`,
    label: `Graphic Design · ${title}`,
  })),
})

const designGroups = [
  designGroup({ slug: 'logo-design', title: 'Logo design', noun: 'Logo', note: 'Marks and identities for brands.' }),
  designGroup({ slug: 'business-cards', title: 'Business cards', noun: 'Business card', note: 'Front-and-back cards that match the brand.' }),
  designGroup({ slug: 'letterheads', title: 'Letterheads', noun: 'Letterhead', note: 'Branded business stationery.' }),
  designGroup({ slug: 'flyers', title: 'Flyers', noun: 'Flyer', note: 'Offers, events and announcements.' }),
  designGroup({ slug: 'brochures', title: 'Brochures', noun: 'Brochure', note: 'Tri-fold and multi-panel brochures.', cols: 2 }),
  designGroup({ slug: 'posters', title: 'Posters', noun: 'Poster', note: 'Posters for events, products and ideas.' }),
  designGroup({ slug: 'banners', title: 'Large-format banners', noun: 'Banner', note: 'Wide banners for events, schools and shops.', kind: 'banner' }),
  designGroup({ slug: 'standees', title: 'Standees', noun: 'Standee', note: 'Roll-up and floor standees.' }),
  designGroup({ slug: 'trade-show-booths', title: 'Trade show booths', noun: 'Booth', note: 'Exhibition booth and backdrop graphics.', cols: 2 }),
  designGroup({ slug: 'signage', title: 'Signage', noun: 'Signage', note: 'Billboards, signs and outdoor boards.', cols: 2 }),
  designGroup({ slug: 'packaging', title: 'Packaging', noun: 'Packaging', note: 'Boxes, bags and product packs.', cols: 2 }),
  designGroup({ slug: 'labels', title: 'Label design', noun: 'Label', note: 'Product labels, shown flat and on pack.', cols: 2 }),
  designGroup({ slug: 'menu-design', title: 'Menu design', noun: 'Menu', note: 'Menus for cafés and restaurants.' }),
  designGroup({ slug: 'infographics', title: 'Infographics', noun: 'Infographic', note: 'Data and ideas, made visual.' }),
  designGroup({ slug: 'social-media', title: 'Social media', noun: 'Social post', note: 'Posts and campaign graphics.' }),
]

export const categories = [
  {
    slug: 'video-editing',
    title: 'Video Editing',
    short: 'Ads, promos and case-study films.',
    description:
      'Edits for brands and creators — product ads, promos and customer stories. Footage, screen recordings, graphics and subtitles are cut together into one clear, well-paced video.',
    cover: '/media/img/poster-edit-reel.jpg',
    groups: [{ kind: 'video', items: videoEditing.map((p) => ({ ...p, label: 'Video Editing' })) }],
    deliverables: ['Final video export (MP4)', 'Formats for YouTube, social or web', 'Revisions based on your feedback'],
    process: [
      { title: 'Brief & footage', text: 'You share the goal, audience, length, references and raw footage. I review everything and confirm the plan with you.' },
      { title: 'Rough cut', text: 'I assemble the story and structure first, so you can approve the flow before any fine detail is added.' },
      { title: 'Fine cut', text: 'Pacing, transitions, graphics, subtitles, sound and colour are refined on top of the approved structure.' },
      { title: 'Review & export', text: 'I apply your feedback and export the final video in the formats and sizes you need.' },
    ],
  },
  {
    slug: 'motion-graphics',
    title: 'Motion Graphics',
    short: 'Animated interfaces and graphics.',
    description:
      'Animated graphics that explain a product or idea — app interfaces, cards, charts and text, moving cleanly in sync with the story.',
    cover: '/media/img/poster-storytelling-motion.jpg',
    groups: [
      {
        kind: 'video',
        items: [
          {
            id: 'ui-motion',
            label: 'Motion Graphics',
            title: 'App UI Motion Showcase',
            desc: 'An animated showcase of app and dashboard interfaces, with floating UI cards and smooth scene-to-scene transitions.',
            src: '/media/video/storytelling-motion.mp4',
            poster: '/media/img/poster-storytelling-motion.jpg',
            duration: '0:53',
          },
        ],
      },
    ],
    deliverables: ['Final animation export (MP4)', 'Versions for different platforms on request', 'Revisions based on your feedback'],
    process: [
      { title: 'Concept & script', text: 'We define what the animation needs to explain, who it is for, and the key points to show, in order.' },
      { title: 'Style & storyboard', text: 'I prepare style frames and a simple storyboard — colours, type and layout — for you to approve before animating.' },
      { title: 'Animation', text: 'I animate the elements, transitions and text, and refine the timing so everything reads clearly.' },
      { title: 'Polish & delivery', text: 'I add sound and finishing touches, apply your feedback and deliver the final render.' },
    ],
  },
  {
    slug: '2d-animation',
    title: '2D Animation',
    short: 'Character-led storytelling.',
    description:
      'Hand-drawn style 2D animation with characters, expressions and scenes, made for story-driven and explainer videos.',
    cover: '/media/img/poster-trendy-animation.jpg',
    groups: [
      {
        kind: 'video',
        items: [
          {
            id: 'animation',
            label: '2D Animation',
            title: '2D Story Animation',
            desc: 'A long-form 2D animated story with expressive characters and scene-by-scene storytelling.',
            src: '/media/video/trendy-animation.mp4',
            poster: '/media/img/poster-trendy-animation.jpg',
            duration: '11:05',
          },
        ],
      },
    ],
    deliverables: ['Final animated video (MP4)', 'Character and asset files on request', 'Revisions based on your feedback'],
    process: [
      { title: 'Script & storyboard', text: 'The script is broken into scenes and shots, so the story, pacing and visuals are agreed before animation starts.' },
      { title: 'Characters & assets', text: 'I design the characters, backgrounds and props, and share them with you for approval.' },
      { title: 'Animation', text: 'Scenes are animated with attention to expressions, movement and timing, then composited together.' },
      { title: 'Sound & export', text: 'Voice, music and sound effects are added, feedback is applied, and the final video is exported.' },
    ],
  },
  {
    slug: 'voice-over',
    title: 'Voice-Over',
    short: 'Narrated long-form video.',
    description:
      'Long-form videos where narration leads the story, with visuals and archive footage edited to match the script.',
    cover: '/media/img/poster-long-voiceover.jpg',
    groups: [
      {
        kind: 'video',
        items: [
          {
            id: 'voiceover',
            label: 'Voice-Over',
            title: 'Aviation Documentary',
            desc: 'A long-form documentary-style video about aviation, narrated with voice-over and edited with archive footage.',
            src: '/media/video/long-voiceover.mp4',
            poster: '/media/img/poster-long-voiceover.jpg',
            duration: '17:57',
          },
        ],
      },
    ],
    deliverables: ['Narration audio synced to the video', 'Final video export (MP4)', 'Revisions based on your feedback'],
    process: [
      { title: 'Script review', text: 'I read the script with you, check tone, length and pronunciation, and agree on the style of narration.' },
      { title: 'Narration', text: 'The script is recorded section by section, so any line can be redone without affecting the rest.' },
      { title: 'Edit & sync', text: 'Audio is cleaned and edited, then the footage and visuals are cut to match the narration.' },
      { title: 'Mix & delivery', text: 'Voice, music and effects are balanced, your feedback is applied, and the final video is delivered.' },
    ],
  },
  {
    slug: 'graphic-design',
    title: 'Graphic Design',
    short: 'Thumbnails, logos, print and packaging.',
    description:
      'YouTube thumbnails and channel banners, plus logos, stationery, flyers, brochures, packaging, signage and more — clear type, simple layouts and a look that fits the brand.',
    cover: '/media/img/thumb-6.jpg',
    groups: [
      {
        kind: 'thumb',
        id: 'thumbnails',
        title: 'YouTube thumbnails',
        note: 'View counts are for the published videos these thumbnails were made for.',
        items: thumbnails,
      },
      { kind: 'banner', id: 'channel-art', title: 'Banners & channel art', items: banners },
      ...designGroups,
    ],
    deliverables: ['Final files (JPG / PNG / PDF)', 'Print-ready files with correct size and bleed', 'Revisions based on your feedback'],
    process: [
      { title: 'Brief & references', text: 'You share the topic, audience, brand colours and any references, so the design starts in the right direction.' },
      { title: 'Concepts', text: 'I sketch a few layout and text ideas, and you choose the one to take forward.' },
      { title: 'Design', text: 'The chosen concept is designed in full, with type, imagery and colour set for the platform or print format it will be used in.' },
      { title: 'Feedback & files', text: 'I apply your changes and deliver the final files at the right size and format.' },
    ],
  },
]

export const countItems = (c) => c.groups.reduce((n, g) => n + g.items.length, 0)

// Combined views of the six videos shown in the thumbnail screenshots (≈7.03M).
export const stats = [
  { value: 7, suffix: 'M+', label: 'Combined views on videos using my thumbnails' },
  { value: categories.reduce((n, c) => n + countItems(c), 0), suffix: '', label: 'Pieces shown in this portfolio' },
  { value: categories.length, suffix: '', label: 'Work categories' },
  { value: tools.length, suffix: '', label: 'Core design & video tools' },
]
