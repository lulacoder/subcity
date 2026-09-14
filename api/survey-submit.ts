import { createHmac } from 'node:crypto'

function json(body: unknown, status: number) {
  return Response.json(body, {
    status,
    headers: { 'Cache-Control': 'no-store' },
  })
}

export default {
  async fetch(request: Request) {
    if (request.method !== 'POST') {
      return json({ error: 'Method not allowed.' }, 405)
    }

    const apiSecret = process.env.SURVEY_API_SECRET
    const hashSecret = process.env.IP_HASH_SECRET
    const convexSiteUrl = process.env.CONVEX_SITE_URL
    if (!apiSecret || !hashSecret || !convexSiteUrl) {
      return json({ error: 'Survey submissions are not configured.' }, 503)
    }

    const ip =
      request.headers.get('x-vercel-forwarded-for') ??
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    if (!ip)
      return json(
        { error: 'The request network could not be identified.' },
        400,
      )

    const contentLength = Number(request.headers.get('content-length') ?? 0)
    if (contentLength > 50_000)
      return json({ error: 'Response is too large.' }, 413)

    let payload: unknown
    try {
      payload = await request.json()
    } catch {
      return json({ error: 'Invalid survey response.' }, 400)
    }
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
      return json({ error: 'Invalid survey response.' }, 400)
    }

    const ipHash = createHmac('sha256', hashSecret).update(ip).digest('hex')
    const response = await fetch(
      `${convexSiteUrl.replace(/\/$/, '')}/survey-submit`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiSecret}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...payload, ipHash }),
      },
    )
    const body = await response.text()
    return new Response(body, {
      status: response.status,
      headers: {
        'Cache-Control': 'no-store',
        'Content-Type': 'application/json',
      },
    })
  },
}
