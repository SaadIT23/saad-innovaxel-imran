import React from 'react';
import { ExternalLink, Copy, Edit, Trash2, BarChart, Calendar, MousePointer } from 'lucide-react';

const UrlCard = ({
    url,
    onEdit,
    onDelete,
    onCopy,
    onRedirect,
    onViewStats,
}) => {
    const shortUrl = `${window.location.origin}/r/${url.shortCode}`;

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const truncateUrl = (url, maxLength = 60) => {
        if (url.length <= maxLength) return url;
        return url.substring(0, maxLength) + '...';
    };

    return (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {truncateUrl(url.url)}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-blue-600 font-medium">
                        <span className="bg-blue-50 px-2 py-1 rounded">
                            {shortUrl}
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                    <button
                        onClick={() => onCopy(url.shortCode)}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Copy short URL"
                    >
                        <Copy className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => onRedirect(url.shortCode)}
                        className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Open original URL"
                    >
                        <ExternalLink className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => onViewStats(url.shortCode)}
                        className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                        title="View statistics"
                    >
                        <BarChart className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => onEdit(url)}
                        className="p-2 text-gray-500 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                        title="Edit URL"
                    >
                        <Edit className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => onDelete(url.shortCode)}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete URL"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>Created {formatDate(url.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <MousePointer className="h-4 w-4" />
                        <span>{url.accessCount} clicks</span>
                    </div>
                </div>
                <div className="text-xs text-gray-400">
                    Code: {url.shortCode}
                </div>
            </div>
        </div>
    );
};

export default UrlCard;