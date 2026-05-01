// api/waitlist.js
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { email } = req.body
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Invalid email' })
  }

  const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/waitlist`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': process.env.SUPABASE_KEY,
      'Authorization': `Bearer ${process.env.SUPABASE_KEY}`,
      'Prefer': 'return=minimal'
    },
    body: JSON.stringify({ email })
  })

  if (response.ok) return res.status(200).json({ success: true })

  const err = await response.json()
  if (err.code === '23505') return res.status(409).json({ error: 'duplicate' })

  return res.status(500).json({ error: 'Something went wrong' })
}