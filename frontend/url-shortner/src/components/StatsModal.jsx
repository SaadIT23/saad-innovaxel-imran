import React from 'react';
import { BarChart, X, Calendar, MousePointer, Link } from 'lucide-react';

const StatsModal = ({ url, onClose }) => {
    const shortUrl = `${window.location.origin}/r/${url.shortCode}`;

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const truncateUrl = (url, maxLength = 50) => {
        if (url.length <= maxLength) return url;
        return url.substring(0, maxLength) + '...';
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                        <BarChart className="h-5 w-5 text-blue-600" />
                        <h3 className="text-lg font-semibold text-gray-900">URL Statistics</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                            <MousePointer className="h-8 w-8 text-blue-600" />
                        </div>
                        <h4 className="text-3xl font-bold text-gray-900 mb-2">{url.accessCount}</h4>
                        <p className="text-gray-600">Total Clicks</p>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Link className="h-4 w-4 text-gray-600" />
                                <span className="text-sm font-medium text-gray-700">Original URL</span>
                            </div>
                            <p className="text-sm text-gray-900 break-all" title={url.url}>
                                {truncateUrl(url.url, 60)}
                            </p>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Link className="h-4 w-4 text-gray-600" />
                                <span className="text-sm font-medium text-gray-700">Short URL</span>
                            </div>
                            <p className="text-sm text-blue-600 break-all">{shortUrl}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Calendar className="h-4 w-4 text-gray-600" />
                                    <span className="text-sm font-medium text-gray-700">Created</span>
                                </div>
                                <p className="text-sm text-gray-900">{formatDate(url.createdAt)}</p>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Calendar className="h-4 w-4 text-gray-600" />
                                    <span className="text-sm font-medium text-gray-700">Last Updated</span>
                                </div>
                                <p className="text-sm text-gray-900">{formatDate(url.updatedAt)}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end p-6 border-t border-gray-200">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StatsModal;