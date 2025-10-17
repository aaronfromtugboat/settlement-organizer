// GET /api/policy - Get all policies or a specific policy by ID
export async function onRequestGet({ request, env }) {
  const url = new URL(request.url)
  const id = url.searchParams.get('id')

  try {
    if (id) {
      // Get specific policy
      const result = await env.DB.prepare('SELECT * FROM policies WHERE id = ?').bind(id).first()
      
      if (!result) {
        return new Response(JSON.stringify({ error: 'Policy not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        })
      }

      return new Response(JSON.stringify(result), {
        headers: { 'Content-Type': 'application/json' },
      })
    } else {
      // Get all policies
      const result = await env.DB.prepare('SELECT * FROM policies ORDER BY created_at DESC').all()
      
      return new Response(JSON.stringify(result.results || []), {
        headers: { 'Content-Type': 'application/json' },
      })
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

// POST /api/policy - Create a new policy
export async function onRequestPost({ request, env }) {
  try {
    const body = await request.json()
    const id = crypto.randomUUID()
    const now = new Date().toISOString()

    const stmt = env.DB.prepare(`
      INSERT INTO policies (
        id, created_at, updated_at, policy_number, policy_holder_name, deductible,
        dwelling, dwelling_debris, other_structures, other_structures_debris,
        personal_property, personal_property_debris, ale, trees_shrubs_landscaping,
        extended_dwelling, extended_dwelling_debris, extended_other_structures,
        extended_other_structures_debris, personal_property_options, building_code
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      id, now, now, body.policy_number, body.policy_holder_name, body.deductible || 0,
      body.dwelling || 0, body.dwelling_debris || 0, body.other_structures || 0,
      body.other_structures_debris || 0, body.personal_property || 0,
      body.personal_property_debris || 0, body.ale || 0, body.trees_shrubs_landscaping || 0,
      body.extended_dwelling || 0, body.extended_dwelling_debris || 0,
      body.extended_other_structures || 0, body.extended_other_structures_debris || 0,
      body.personal_property_options || 0, body.building_code || 0
    )

    await stmt.run()

    const result = await env.DB.prepare('SELECT * FROM policies WHERE id = ?').bind(id).first()

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

// PUT /api/policy - Update a policy
export async function onRequestPut({ request, env }) {
  try {
    const body = await request.json()
    const now = new Date().toISOString()

    const stmt = env.DB.prepare(`
      UPDATE policies SET
        updated_at = ?,
        policy_number = ?,
        policy_holder_name = ?,
        deductible = ?,
        dwelling = ?,
        dwelling_debris = ?,
        other_structures = ?,
        other_structures_debris = ?,
        personal_property = ?,
        personal_property_debris = ?,
        ale = ?,
        trees_shrubs_landscaping = ?,
        extended_dwelling = ?,
        extended_dwelling_debris = ?,
        extended_other_structures = ?,
        extended_other_structures_debris = ?,
        personal_property_options = ?,
        building_code = ?
      WHERE id = ?
    `).bind(
      now, body.policy_number, body.policy_holder_name, body.deductible,
      body.dwelling, body.dwelling_debris, body.other_structures,
      body.other_structures_debris, body.personal_property,
      body.personal_property_debris, body.ale, body.trees_shrubs_landscaping,
      body.extended_dwelling, body.extended_dwelling_debris,
      body.extended_other_structures, body.extended_other_structures_debris,
      body.personal_property_options, body.building_code, body.id
    )

    await stmt.run()

    const result = await env.DB.prepare('SELECT * FROM policies WHERE id = ?').bind(body.id).first()

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

// DELETE /api/policy - Delete a policy
export async function onRequestDelete({ request, env }) {
  const url = new URL(request.url)
  const id = url.searchParams.get('id')

  if (!id) {
    return new Response(JSON.stringify({ error: 'Policy ID is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    await env.DB.prepare('DELETE FROM policies WHERE id = ?').bind(id).run()

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

