// GET /api/documents - Get documents for a policy
export async function onRequestGet({ request, env }) {
  const url = new URL(request.url)
  const policyId = url.searchParams.get('policy_id')
  const id = url.searchParams.get('id')

  try {
    if (id) {
      // Get specific document and return the file
      const doc = await env.DB.prepare('SELECT * FROM documents WHERE id = ?').bind(id).first()
      
      if (!doc) {
        return new Response(JSON.stringify({ error: 'Document not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        })
      }

      // Get file from R2
      const object = await env.DOCUMENTS.get(doc.file_key)
      
      if (!object) {
        return new Response(JSON.stringify({ error: 'File not found in storage' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        })
      }

      return new Response(object.body, {
        headers: {
          'Content-Type': doc.file_type,
          'Content-Disposition': `attachment; filename="${doc.file_name}"`,
        },
      })
    } else if (policyId) {
      // Get document metadata for a policy
      const result = await env.DB.prepare(
        'SELECT * FROM documents WHERE policy_id = ? ORDER BY uploaded_at DESC'
      ).bind(policyId).all()

      return new Response(JSON.stringify(result.results || []), {
        headers: { 'Content-Type': 'application/json' },
      })
    } else {
      return new Response(JSON.stringify({ error: 'policy_id or id is required' }), {
        status: 400,
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

// POST /api/documents - Upload a new document
export async function onRequestPost({ request, env }) {
  try {
    const formData = await request.formData()
    const file = formData.get('file')
    const policyId = formData.get('policy_id')
    const paymentId = formData.get('payment_id') || null

    if (!file || !policyId) {
      return new Response(JSON.stringify({ error: 'file and policy_id are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const id = crypto.randomUUID()
    const fileKey = `${policyId}/${id}-${file.name}`
    const now = new Date().toISOString()

    // Upload file to R2
    await env.DOCUMENTS.put(fileKey, file.stream(), {
      httpMetadata: {
        contentType: file.type,
      },
    })

    // Save metadata to D1
    const stmt = env.DB.prepare(`
      INSERT INTO documents (id, policy_id, payment_id, file_key, file_name, file_type, file_size, uploaded_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      id,
      policyId,
      paymentId,
      fileKey,
      file.name,
      file.type,
      file.size,
      now
    )

    await stmt.run()

    const result = await env.DB.prepare('SELECT * FROM documents WHERE id = ?').bind(id).first()

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

// DELETE /api/documents - Delete a document
export async function onRequestDelete({ request, env }) {
  const url = new URL(request.url)
  const id = url.searchParams.get('id')

  if (!id) {
    return new Response(JSON.stringify({ error: 'Document ID is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    // Get document metadata
    const doc = await env.DB.prepare('SELECT * FROM documents WHERE id = ?').bind(id).first()
    
    if (!doc) {
      return new Response(JSON.stringify({ error: 'Document not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Delete from R2
    await env.DOCUMENTS.delete(doc.file_key)

    // Delete from D1
    await env.DB.prepare('DELETE FROM documents WHERE id = ?').bind(id).run()

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

