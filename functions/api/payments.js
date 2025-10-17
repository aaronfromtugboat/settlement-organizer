// GET /api/payments - Get payments for a policy
export async function onRequestGet({ request, env }) {
  const url = new URL(request.url)
  const policyId = url.searchParams.get('policy_id')

  if (!policyId) {
    return new Response(JSON.stringify({ error: 'policy_id is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    const result = await env.DB.prepare(
      'SELECT * FROM payments WHERE policy_id = ? ORDER BY checkpoint_date ASC, created_at ASC'
    ).bind(policyId).all()

    return new Response(JSON.stringify(result.results || []), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

// POST /api/payments - Create a new payment
export async function onRequestPost({ request, env }) {
  try {
    const body = await request.json()
    const id = crypto.randomUUID()
    const now = new Date().toISOString()

    const stmt = env.DB.prepare(`
      INSERT INTO payments (id, policy_id, checkpoint_date, coverage_type, amount, notes, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(
      id,
      body.policy_id,
      body.checkpoint_date,
      body.coverage_type,
      body.amount,
      body.notes || null,
      now
    )

    await stmt.run()

    const result = await env.DB.prepare('SELECT * FROM payments WHERE id = ?').bind(id).first()

    return new Response(JSON.stringify(result), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

// PUT /api/payments - Update a payment
export async function onRequestPut({ request, env }) {
  try {
    const body = await request.json()

    const stmt = env.DB.prepare(`
      UPDATE payments SET
        checkpoint_date = ?,
        coverage_type = ?,
        amount = ?,
        notes = ?
      WHERE id = ?
    `).bind(
      body.checkpoint_date,
      body.coverage_type,
      body.amount,
      body.notes || null,
      body.id
    )

    await stmt.run()

    const result = await env.DB.prepare('SELECT * FROM payments WHERE id = ?').bind(body.id).first()

    return new Response(JSON.stringify(result), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

// DELETE /api/payments - Delete a payment
export async function onRequestDelete({ request, env }) {
  const url = new URL(request.url)
  const id = url.searchParams.get('id')

  if (!id) {
    return new Response(JSON.stringify({ error: 'Payment ID is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    await env.DB.prepare('DELETE FROM payments WHERE id = ?').bind(id).run()

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

