import React, { useState, useEffect } from 'react';
import { Link, ExternalLink, Copy, Edit, Trash2, BarChart, Plus } from 'lucide-react';
import CreateUrlForm from './components/CreateUrlForm';
import UrlCard from './components/UrlCard';
import EditUrlModal from './components/EditUrlModal';
import StatsModal from './components/StatsModal';

const API_BASE_URL = 'http://localhost:5000/api';

function App() {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUrl, setEditingUrl] = useState(null);
  const [viewingStats, setViewingStats] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const fetchUrls = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/urls`);
      const data = await response.json();
      setUrls(data);
    } catch (error) {
      console.error('Error fetching URLs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUrls();
  }, []);

  const handleCreateUrl = async (url) => {
    try {
      const response = await fetch(`${API_BASE_URL}/shorten`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (response.ok) {
        const newUrl = await response.json();
        setUrls([newUrl, ...urls]);
        setShowCreateForm(false);
        return { success: true };
      } else {
        const error = await response.json();
        return { success: false, error: error.error };
      }
    } catch (error) {
      return { success: false, error: 'Failed to create short URL' };
    }
  };

  const handleUpdateUrl = async (shortCode, newUrl) => {
    try {
      const response = await fetch(`${API_BASE_URL}/shorten/${shortCode}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: newUrl }),
      });

      if (response.ok) {
        const updatedUrl = await response.json();
        setUrls(urls.map(url => url.shortCode === shortCode ? updatedUrl : url));
        setEditingUrl(null);
        return { success: true };
      } else {
        const error = await response.json();
        return { success: false, error: error.error };
      }
    } catch (error) {
      return { success: false, error: 'Failed to update URL' };
    }
  };

  const handleDeleteUrl = async (shortCode) => {
    try {
      const response = await fetch(`${API_BASE_URL}/shorten/${shortCode}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setUrls(urls.filter(url => url.shortCode !== shortCode));
      }
    } catch (error) {
      console.error('Error deleting URL:', error);
    }
  };

  const handleCopyUrl = (shortCode) => {
    const shortUrl = `${window.location.origin}/r/${shortCode}`;
    navigator.clipboard.writeText(shortUrl);
  };

  const handleRedirect = async (shortCode) => {
    try {
      const response = await fetch(`${API_BASE_URL}/shorten/${shortCode}`);
      if (response.ok) {
        const data = await response.json();
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error redirecting:', error);
    }
  };

  const handleViewStats = async (shortCode) => {
    try {
      const response = await fetch(`${API_BASE_URL}/shorten/${shortCode}/stats`);
      if (response.ok) {
        const data = await response.json();
        setViewingStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Link className="h-8 w-8 text-blue-600 mr-2" />
            <h1 className="text-4xl font-bold text-gray-900">URL Shortener</h1>
          </div>
          <p className="text-gray-600 text-lg">Create and manage your short URLs with ease</p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-semibold text-gray-900">Your URLs</h2>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus className="h-5 w-5" />
              Create New URL
            </button>
          </div>

          {showCreateForm && (
            <div className="mb-8">
              <CreateUrlForm
                onSubmit={handleCreateUrl}
                onCancel={() => setShowCreateForm(false)}
              />
            </div>
          )}

          {urls.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <Link className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No URLs yet</h3>
              <p className="text-gray-600 mb-6">Create your first short URL to get started</p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg inline-flex items-center gap-2 transition-colors"
              >
                <Plus className="h-5 w-5" />
                Create Your First URL
              </button>
            </div>
          ) : (
            <div className="grid gap-4">
              {urls.map((url) => (
                <UrlCard
                  key={url.shortCode}
                  url={url}
                  onEdit={setEditingUrl}
                  onDelete={handleDeleteUrl}
                  onCopy={handleCopyUrl}
                  onRedirect={handleRedirect}
                  onViewStats={handleViewStats}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {editingUrl && (
        <EditUrlModal
          url={editingUrl}
          onSave={handleUpdateUrl}
          onClose={() => setEditingUrl(null)}
        />
      )}

      {viewingStats && (
        <StatsModal
          url={viewingStats}
          onClose={() => setViewingStats(null)}
        />
      )}
    </div>
  );
}

export default App;