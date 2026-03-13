import React, { useState } from 'react';
import { 
  Filter, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  AlertCircle 
} from 'lucide-react';

const OrderManagement = ({ ordersData }) => {
  const [filter, setFilter] = useState('all');

  const getPlatformColor = (platform) => {
    switch (platform) {
      case 'Glovo': return 'bg-[#ffb800]/20 text-[#ffb800] border-[#ffb800]/30';
      case 'Jumia': return 'bg-gray-200 dark:bg-zinc-700/50 text-gray-700 dark:text-zinc-300 border-gray-300 dark:border-zinc-600';
      case 'Direct': return 'bg-salmon-50/80 dark:bg-salmon-500/20 text-salmon-600 dark:text-salmon-400 border-salmon-200 dark:border-salmon-500/30';
      default: return 'bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400 border-gray-200 dark:border-zinc-700';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'new': return <AlertCircle size={16} className="text-amber-500 mr-1.5" />;
      case 'prep': return <Clock size={16} className="text-blue-400 mr-1.5" />;
      case 'ready': return <CheckCircle2 size={16} className="text-emerald-500 mr-1.5" />;
      case 'delivering': return <MapPin size={16} className="text-purple-400 mr-1.5" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-zinc-100">Live Orders</h2>
          <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">Multi-channel incoming orders stream</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg p-1 flex shadow-sm dark:shadow-none">
            {['All', 'Glovo', 'Jumia', 'Direct'].map(opt => (
              <button 
                key={opt}
                onClick={() => setFilter(opt.toLowerCase())}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                  filter === opt.toLowerCase() 
                    ? 'bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 shadow-sm' 
                    : 'text-gray-500 dark:text-zinc-500 hover:text-gray-700 dark:hover:text-zinc-300'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
          <button className="p-2 border border-gray-200 dark:border-zinc-800 rounded-lg text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-200 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors bg-white dark:bg-transparent shadow-sm dark:shadow-none">
            <Filter size={18} />
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900/80 backdrop-blur-md border border-gray-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm dark:shadow-none transition-colors duration-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900/50">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Customer / Items</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Platform</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-zinc-800/60">
              {ordersData.filter(o => filter === 'all' || o.platform.toLowerCase() === filter).map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/30 transition-colors group">
                  <td className="px-6 py-4">
                    <span className="font-medium text-gray-700 dark:text-zinc-300 group-hover:text-salmon-500 dark:group-hover:text-salmon-400 transition-colors">
                      {order.id}
                    </span>
                    <p className="text-xs text-gray-500 dark:text-zinc-500 mt-1">{order.time}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900 dark:text-zinc-200">{order.customer}</div>
                    <div className="text-xs text-gray-500 dark:text-zinc-400 mt-1 line-clamp-1">{order.items}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getPlatformColor(order.platform)}`}>
                      {order.platform}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {getStatusIcon(order.status)}
                      <span className="text-sm text-gray-700 dark:text-zinc-300 capitalize">{order.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="font-medium text-emerald-500 dark:text-emerald-400">{order.total}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrderManagement;
