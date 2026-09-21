import commands from '../data/commands.json';

export async function GET() {
  const items = [
    ...commands.map(c => ({
      name: `${c.name} command`, kind: 'command', url: `/commands/${c.slug}/`, keywords: c.keywords
    }))
  ];
  return new Response(JSON.stringify(items), { headers: { 'Content-Type': 'application/json' } });
}
