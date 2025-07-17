"use client"

import { useState, useEffect } from "react"
import { Plus, Copy, Edit2, Trash2, BarChart3, ExternalLink } from "lucide-react"
import "./App.css"

const API_BASE = "http://localhost:3001"

function App() {
  const [urls, setUrls] = useState([])
  const [newUrl, setNewUrl] = useState("")
  const [editingUrl, setEditingUrl] = useState(null)
  const [editUrl, setEditUrl] = useState("")
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    fetchUrls()
  }, [])

  const fetchUrls = async () => {
    try {
      const response = await fetch(`${API_BASE}/urls`)
      if (response.ok) {
        const data = await response.json()
        setUrls(data)
      }
    } catch (error) {
      console.error("Error fetching URLs:", error)
    }
  }

  const createShortUrl = async (e) => {
    e.preventDefault()
    if (!newUrl.trim()) return

    setLoading(true)
    try {
      const response = await fetch(`${API_BASE}/shorten`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: newUrl }),
      })

      if (response.ok) {
        const data = await response.json()
        setUrls([data, ...urls])
        setNewUrl("")
        setMessage("Short URL created successfully!")
        setTimeout(() => setMessage(""), 3000)
      } else {
        const error = await response.json()
        setMessage(error.error || "Failed to create short URL")
        setTimeout(() => setMessage(""), 3000)
      }
    } catch (error) {
      setMessage("Error creating short URL")
      setTimeout(() => setMessage(""), 3000)
    }
    setLoading(false)
  }

  const updateUrl = async (shortCode) => {
    if (!editUrl.trim()) return

    try {
      const response = await fetch(`${API_BASE}/shorten/${shortCode}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: editUrl }),
      })

      if (response.ok) {
        const updatedUrl = await response.json()
        setUrls(urls.map((url) => (url.shortCode === shortCode ? updatedUrl : url)))
        setEditingUrl(null)
        setEditUrl("")
        setMessage("URL updated successfully!")
        setTimeout(() => setMessage(""), 3000)
      }
    } catch (error) {
      setMessage("Error updating URL")
      setTimeout(() => setMessage(""), 3000)
    }
  }

  const deleteUrl = async (shortCode) => {
    if (!confirm("Are you sure you want to delete this URL?")) return

    try {
      const response = await fetch(`${API_BASE}/shorten/${shortCode}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setUrls(urls.filter((url) => url.shortCode !== shortCode))
        setMessage("URL deleted successfully!")
        setTimeout(() => setMessage(""), 3000)
      }
    } catch (error) {
      setMessage("Error deleting URL")
      setTimeout(() => setMessage(""), 3000)
    }
  }

  const getStats = async (shortCode) => {
    try {
      const response = await fetch(`${API_BASE}/shorten/${shortCode}/stats`)
      if (response.ok) {
        const data = await response.json()
        setStats({ ...stats, [shortCode]: data })
      }
    } catch (error) {
      console.error("Error fetching stats:", error)
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    setMessage("Copied to clipboard!")
    setTimeout(() => setMessage(""), 2000)
  }

  const redirectToOriginal = async (shortCode) => {
    try {
      const response = await fetch(`${API_BASE}/shorten/${shortCode}`)
      if (response.ok) {
        const data = await response.json()
        window.open(data.url, "_blank")
        // Refresh stats after access
        setTimeout(() => getStats(shortCode), 500)
      }
    } catch (error) {
      console.error("Error redirecting:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">URL Shortener</h1>
          <p className="text-gray-600">Shorten your long URLs and track their usage</p>
        </div>

        {message && (
          <div className="mb-6 p-4 bg-blue-100 border border-blue-400 text-blue-700 rounded-lg">{message}</div>
        )}

        {/* Create URL Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Create Short URL</h2>
          <form onSubmit={createShortUrl} className="flex gap-4">
            <input
              type="url"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              placeholder="Enter your long URL here..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              {loading ? "Creating..." : "Shorten"}
            </button>
          </form>
        </div>

        {/* URLs List */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Your Short URLs</h2>
          </div>

          {urls.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No URLs created yet. Create your first short URL above!</div>
          ) : (
            <div className="divide-y divide-gray-200">
              {urls.map((url) => (
                <div key={url.shortCode} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-gray-500">Short URL:</span>
                        <code className="px-2 py-1 bg-gray-100 rounded text-sm">{`${API_BASE}/${url.shortCode}`}</code>
                        <button
                          onClick={() => copyToClipboard(`${API_BASE}/${url.shortCode}`)}
                          className="p-1 text-gray-400 hover:text-gray-600"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => redirectToOriginal(url.shortCode)}
                          className="p-1 text-gray-400 hover:text-gray-600"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </div>

                      {editingUrl === url.shortCode ? (
                        <div className="flex gap-2 mb-2">
                          <input
                            type="url"
                            value={editUrl}
                            onChange={(e) => setEditUrl(e.target.value)}
                            className="flex-1 px-3 py-1 border border-gray-300 rounded text-sm"
                            placeholder="Enter new URL"
                          />
                          <button
                            onClick={() => updateUrl(url.shortCode)}
                            className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => {
                              setEditingUrl(null)
                              setEditUrl("")
                            }}
                            className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="mb-2">
                          <span className="text-sm font-medium text-gray-500">Original URL:</span>
                          <p className="text-sm text-gray-700 break-all">{url.url}</p>
                        </div>
                      )}

                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Created: {new Date(url.createdAt).toLocaleDateString()}</span>
                        <span>Updated: {new Date(url.updatedAt).toLocaleDateString()}</span>
                        {stats[url.shortCode] && (
                          <span className="font-medium">Clicks: {stats[url.shortCode].accessCount || 0}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => getStats(url.shortCode)}
                        className="p-2 text-gray-400 hover:text-blue-600"
                        title="Get Statistics"
                      >
                        <BarChart3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setEditingUrl(url.shortCode)
                          setEditUrl(url.url)
                        }}
                        className="p-2 text-gray-400 hover:text-yellow-600"
                        title="Edit URL"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteUrl(url.shortCode)}
                        className="p-2 text-gray-400 hover:text-red-600"
                        title="Delete URL"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
