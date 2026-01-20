import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [createForm, setCreateForm] = useState({ name: '', email: '', age: '' })
  const [editId, setEditId] = useState(null)
  const [editForm, setEditForm] = useState({ name: '', email: '', age: '' })

  async function api(path, options) {
    const res = await fetch(path, {
      headers: { 'Content-Type': 'application/json', ...(options?.headers || {}) },
      ...options,
    })
    const text = await res.text()
    const data = text ? JSON.parse(text) : null
    if (!res.ok) {
      const message = data?.error || `Request failed (${res.status})`
      throw new Error(message)
    }
    return data
  }

  async function loadUsers() {
    setError('')
    setLoading(true)
    try {
      const data = await api('/api/users')
      setUsers(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  function toAge(value) {
    if (value === '' || value === null || value === undefined) return undefined
    const n = Number(value)
    return Number.isFinite(n) ? Math.trunc(n) : undefined
  }

  async function createUser(e) {
    e.preventDefault()
    setError('')
    try {
      const payload = {
        name: createForm.name.trim(),
        email: createForm.email.trim(),
      }
      const age = toAge(createForm.age)
      if (age !== undefined) payload.age = age
      await api('/api/users', { method: 'POST', body: JSON.stringify(payload) })
      setCreateForm({ name: '', email: '', age: '' })
      await loadUsers()
    } catch (e2) {
      setError(e2.message)
    }
  }

  function startEdit(u) {
    setEditId(u.id)
    setEditForm({
      name: u.name ?? '',
      email: u.email ?? '',
      age: u.age === null || u.age === undefined ? '' : String(u.age),
    })
  }

  function cancelEdit() {
    setEditId(null)
    setEditForm({ name: '', email: '', age: '' })
  }

  async function saveEdit(id) {
    setError('')
    try {
      const payload = {}
      if (editForm.name.trim() !== '') payload.name = editForm.name.trim()
      if (editForm.email.trim() !== '') payload.email = editForm.email.trim()
      const age = toAge(editForm.age)
      if (age !== undefined) payload.age = age
      await api(`/api/users/${id}`, { method: 'PUT', body: JSON.stringify(payload) })
      cancelEdit()
      await loadUsers()
    } catch (e) {
      setError(e.message)
    }
  }

  async function deleteUser(id) {
    setError('')
    try {
      await api(`/api/users/${id}`, { method: 'DELETE' })
      await loadUsers()
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <div className="page">
      <header className="header">
        <h1>Users CRUD</h1>
        <button className="btn" onClick={loadUsers} disabled={loading}>
          Refresh
        </button>
      </header>

      <section className="card">
        <h2>Create user</h2>
        <form className="grid" onSubmit={createUser}>
          <label>
            <span>Name</span>
            <input
              value={createForm.name}
              onChange={(e) => setCreateForm((s) => ({ ...s, name: e.target.value }))}
              placeholder="John"
              required
            />
          </label>
          <label>
            <span>Email</span>
            <input
              value={createForm.email}
              onChange={(e) => setCreateForm((s) => ({ ...s, email: e.target.value }))}
              placeholder="john@example.com"
              required
            />
          </label>
          <label>
            <span>Age (optional)</span>
            <input
              value={createForm.age}
              onChange={(e) => setCreateForm((s) => ({ ...s, age: e.target.value }))}
              placeholder="25"
              inputMode="numeric"
            />
          </label>
          <div className="actions">
            <button className="btn primary" type="submit">
              Create User
            </button>
          </div>
        </form>
        {error ? <p className="error">{error}</p> : null}
      </section>

      <section className="card">
        <h2>Users</h2>
        {loading ? <p>Loading…</p> : null}

        <div className="table">
          <div className="row head">
            <div>ID</div>
            <div>Name</div>
            <div>Email</div>
            <div>Age</div>
            <div>Actions</div>
          </div>

          {users.map((u) => {
            const isEditing = editId === u.id
            return (
              <div className="row" key={u.id}>
                <div>{u.id}</div>
                <div>
                  {isEditing ? (
                    <input
                      value={editForm.name}
                      onChange={(e) => setEditForm((s) => ({ ...s, name: e.target.value }))}
                    />
                  ) : (
                    u.name
                  )}
                </div>
                <div>
                  {isEditing ? (
                    <input
                      value={editForm.email}
                      onChange={(e) => setEditForm((s) => ({ ...s, email: e.target.value }))}
                    />
                  ) : (
                    u.email
                  )}
                </div>
                <div>
                  {isEditing ? (
                    <input
                      value={editForm.age}
                      onChange={(e) => setEditForm((s) => ({ ...s, age: e.target.value }))}
                      inputMode="numeric"
                    />
                  ) : u.age ?? (
                    <span className="muted">—</span>
                  )}
                </div>
                <div className="rowActions">
                  {isEditing ? (
                    <>
                      <button className="btn primary" onClick={() => saveEdit(u.id)}>
                        Save
                      </button>
                      <button className="btn" onClick={cancelEdit}>
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="btn" onClick={() => startEdit(u)}>
                        Edit
                      </button>
                      <button className="btn danger" onClick={() => deleteUser(u.id)}>
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}

export default App