export default function handler(req, res) {
  res.status(200).json({
    message: 'API is working! Vercel deployment success.',
    time: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development'
  });
}
