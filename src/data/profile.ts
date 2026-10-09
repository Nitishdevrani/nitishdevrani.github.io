export const education = [
  { badge: 'BCA', dates: '2017 — 2020', title: 'Bachelor’s in Computer Application', school: 'Maharishi Dayanand University, India' },
  { badge: 'MCA', dates: '2020 — 2022', title: 'Master’s in Computer Application', school: 'Gurugram University, India' },
  { badge: 'M.Sc', dates: '2024 — 2026', title: 'Master’s in AI & Robotics', school: 'University of Technology Nuremberg, Germany' },
];

export const community = [
  { label: 'NGO · 3 years', title: 'Rural Education Volunteering', image: '/images/ai/ngo.jpg', alt: 'Volunteering with rural school children', body: 'Assessed learning levels of rural school children and shared the data with government bodies. Stayed with students for days in remote areas — tutoring, easing stage fear, and making room for singing and dancing. Several months each year.' },
  { label: 'Hobby', title: 'Marathon Running', image: '/images/ai/marathon.jpg', alt: 'Nitish with a marathon medal', body: 'Pushing limits physically and mentally.' },
];

export const portfolioCommunity = [
  ...community.map(item => item.title === 'Marathon Running'
    ? { ...item, title: 'Marathon 2025', alt: 'Nitish with his Marathon 2025 medal' }
    : item),
  { label: 'Hobby', title: 'Marathon 2026', image: '/assets/Marathon-2026.jpg', alt: 'Nitish holding his 2026 finisher medal at the stadium', body: 'Another year, another finish line. Keep moving forward.' },
];
