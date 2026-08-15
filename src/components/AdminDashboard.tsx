import React, { useState, useEffect } from 'react';
import { 
  X, 
  Users, 
  ShoppingBag, 
  Mail, 
  MessageSquare, 
  Search, 
  RefreshCw, 
  ShieldCheck, 
  DollarSign, 
  Watch, 
  Database
} from 'lucide-react';
import { api, type AdminOverviewData } from '../services/api';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
}) => {
  const [data, setData] = useState<AdminOverviewData | null>(null);
  const [activeTab, setActiveTab] = useState<'patrons' | 'orders' | 'subscribers' | 'concierge'>('patrons');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchOverview = async () => {
    setLoading(true);
    const overview = await api.getAdminOverview();
    if (overview) setData(overview);
    setLoading(false);
  };

  useEffect(() => {
    if (isOpen) {
      fetchOverview();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const users = data?.users || [];
  const orders = data?.orders || [];
  const subscribers = data?.subscribers || [];
  const conciergeMessages = data?.conciergeMessages || [];
  const metrics = data?.metrics || {
    totalPatrons: users.length,
    totalOrders: orders.length,
    totalRevenue: orders.reduce((sum, o) => sum + (o.total || 0), 0),
    totalWatchesSold: orders.reduce((sum, o) => sum + (o.items?.reduce((isum, i) => isum + i.quantity, 0) || 0), 0),
    totalSubscribers: subscribers.length
  };

  // Search filtering
  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.memberId?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredOrders = orders.filter(o =>
    o.orderRef?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.userEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.certificateNumber?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSubscribers = subscribers.filter(s =>
    s.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-2xl animate-fadeIn">
      <div className="relative w-full max-w-6xl max-h-[92vh] bg-[#050e09] border border-emerald-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Top Bar */}
        <div className="flex items-center justify-between px-6 sm:px-8 py-5 border-b border-emerald-500/20 bg-black/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-950/80 border border-emerald-400/40 text-emerald-400 flex items-center justify-center shadow-emerald-glow">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-serif font-bold text-white tracking-wide">
                  CHRONOVA MANUFACTURE SALON
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-[9px] font-bold text-emerald-300">
                  DATABASE LIVE
                </span>
              </div>
              <div className="text-xs text-slate-400 font-mono">
                Geneva Atelier Client & Acquisition Management Registry
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchOverview}
              className={`p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.09] border border-white/10 text-slate-300 hover:text-emerald-400 transition-all ${loading ? 'animate-spin' : ''}`}
              title="Refresh Real-Time Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Overview Metrics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 sm:px-8 border-b border-emerald-500/15 bg-[#07130e]/70">
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-emerald-500/15">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span className="uppercase tracking-wider font-semibold text-[10px]">Total Revenue</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-serif font-bold text-white mt-1 emerald-gradient-text">
              ${metrics.totalRevenue.toLocaleString()}
            </div>
            <div className="text-[10px] text-emerald-400/80 font-mono mt-0.5">
              {metrics.totalWatchesSold} Timepieces Distributed
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.02] border border-emerald-500/15">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span className="uppercase tracking-wider font-semibold text-[10px]">Registered Patrons</span>
              <Users className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-serif font-bold text-white mt-1">
              {metrics.totalPatrons}
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
              VIP Tier Allocations
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.02] border border-emerald-500/15">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span className="uppercase tracking-wider font-semibold text-[10px]">Completed Orders</span>
              <ShoppingBag className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-serif font-bold text-white mt-1">
              {metrics.totalOrders}
            </div>
            <div className="text-[10px] text-emerald-400 font-mono mt-0.5">
              All Certificates Verified
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.02] border border-emerald-500/15">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span className="uppercase tracking-wider font-semibold text-[10px]">VIP Subscribers</span>
              <Mail className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-serif font-bold text-white mt-1">
              {metrics.totalSubscribers}
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
              Private Salon Circle
            </div>
          </div>
        </div>

        {/* Tab Navigation & Search Filter */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 sm:px-8 py-3.5 border-b border-emerald-500/15 bg-black/40">
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('patrons')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2 ${
                activeTab === 'patrons'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 shadow-emerald-glow'
                  : 'text-slate-400 hover:text-white border border-transparent'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Patrons ({users.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2 ${
                activeTab === 'orders'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 shadow-emerald-glow'
                  : 'text-slate-400 hover:text-white border border-transparent'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Orders ({orders.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('subscribers')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2 ${
                activeTab === 'subscribers'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 shadow-emerald-glow'
                  : 'text-slate-400 hover:text-white border border-transparent'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Subscribers ({subscribers.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('concierge')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2 ${
                activeTab === 'concierge'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 shadow-emerald-glow'
                  : 'text-slate-400 hover:text-white border border-transparent'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Concierge ({conciergeMessages.length})</span>
            </button>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, ref..."
              className="w-full bg-[#040906] border border-emerald-500/25 focus:border-emerald-400 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Tab Body Content */}
        <div className="p-6 sm:px-8 overflow-y-auto flex-1">
          
          {/* 1. PATRONS TAB */}
          {activeTab === 'patrons' && (
            <div className="space-y-3">
              {filteredUsers.length === 0 ? (
                <div className="py-16 text-center text-slate-400 text-sm">
                  No patrons match your search query.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-emerald-500/20 text-slate-400 uppercase tracking-wider text-[10px]">
                        <th className="pb-3 px-3">Patron Name</th>
                        <th className="pb-3 px-3">Email Address</th>
                        <th className="pb-3 px-3">Member ID</th>
                        <th className="pb-3 px-3">Tier</th>
                        <th className="pb-3 px-3">Timepieces in Vault</th>
                        <th className="pb-3 px-3">Registered At</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.04]">
                      {filteredUsers.map((u) => (
                        <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="py-3.5 px-3 font-semibold text-white flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-emerald-300 font-bold flex items-center justify-center text-[10px]">
                              {u.name?.charAt(0) || 'P'}
                            </div>
                            <span>{u.name}</span>
                          </td>
                          <td className="py-3.5 px-3 text-slate-300 font-mono">{u.email}</td>
                          <td className="py-3.5 px-3 font-mono text-emerald-400 font-bold">{u.memberId}</td>
                          <td className="py-3.5 px-3">
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-400/40 text-[9px] font-bold text-emerald-300">
                              {u.tier}
                            </span>
                          </td>
                          <td className="py-3.5 px-3 text-slate-200">
                            {u.vaultItems && u.vaultItems.length > 0 ? (
                              <div className="space-y-1">
                                {u.vaultItems.map((v, idx) => (
                                  <div key={idx} className="text-[11px] font-mono text-emerald-300 flex items-center gap-1">
                                    <Watch className="w-3 h-3 text-emerald-400" />
                                    <span>{v.name} ({v.serialNumber})</span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <span className="text-slate-500 italic">0 watches</span>
                            )}
                          </td>
                          <td className="py-3.5 px-3 text-slate-400 font-mono text-[11px]">
                            {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Active'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* 2. ORDERS TAB */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {filteredOrders.length === 0 ? (
                <div className="py-16 text-center text-slate-400 text-sm">
                  No orders found. Place an order on the site to see it recorded here live!
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredOrders.map((order) => (
                    <div 
                      key={order.id}
                      className="p-5 rounded-2xl bg-[#08150f] border border-emerald-500/20 space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/[0.06]">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold font-mono text-emerald-400">
                            {order.orderRef}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-400/40 text-[9px] font-bold text-emerald-300">
                            {order.status}
                          </span>
                        </div>
                        <div className="text-xs text-slate-400 font-mono">
                          {new Date(order.createdAt).toLocaleString()}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                        <div>
                          <span className="text-[10px] text-slate-500 uppercase block font-mono">Patron</span>
                          <span className="font-semibold text-white">{order.userName}</span>
                          <div className="text-slate-400 font-mono text-[11px]">{order.userEmail}</div>
                        </div>

                        <div>
                          <span className="text-[10px] text-slate-500 uppercase block font-mono">Certificate of Origin</span>
                          <span className="font-mono text-emerald-300 font-bold">{order.certificateNumber}</span>
                          <div className="text-[11px] text-slate-400">{order.shippingAddress}</div>
                        </div>

                        <div className="text-left sm:text-right">
                          <span className="text-[10px] text-slate-500 uppercase block font-mono">Order Total</span>
                          <span className="text-base font-serif font-bold emerald-gradient-text">${order.total.toLocaleString()}</span>
                          <div className="text-[11px] text-slate-400">{order.items?.length || 1} Timepiece(s)</div>
                        </div>
                      </div>

                      {/* Purchased Items List */}
                      <div className="pt-2 border-t border-white/[0.04] flex flex-wrap gap-3">
                        {order.items?.map((item, i) => (
                          <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-xs">
                            <img src={item.watch.image} alt={item.watch.name} className="w-5 h-5 object-contain" />
                            <span className="text-white font-medium">{item.watch.name}</span>
                            <span className="text-slate-400">× {item.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 3. SUBSCRIBERS TAB */}
          {activeTab === 'subscribers' && (
            <div className="space-y-3">
              {filteredSubscribers.length === 0 ? (
                <div className="py-16 text-center text-slate-400 text-sm">
                  No subscribers yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {filteredSubscribers.map((sub) => (
                    <div key={sub.id} className="p-4 rounded-2xl bg-[#08150f] border border-emerald-500/15 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Mail className="w-4 h-4 text-emerald-400" />
                        <div>
                          <div className="text-xs font-mono text-white">{sub.email}</div>
                          <div className="text-[10px] text-slate-500">{new Date(sub.subscribedAt).toLocaleDateString()}</div>
                        </div>
                      </div>
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-400/30">
                        Subscribed
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 4. CONCIERGE TAB */}
          {activeTab === 'concierge' && (
            <div className="space-y-3">
              {conciergeMessages.length === 0 ? (
                <div className="py-16 text-center text-slate-400 text-sm">
                  No concierge communications recorded.
                </div>
              ) : (
                <div className="space-y-3 max-w-2xl mx-auto">
                  {conciergeMessages.map((msg) => (
                    <div 
                      key={msg.id}
                      className={`p-4 rounded-2xl text-xs space-y-1 ${
                        msg.sender === 'user'
                          ? 'bg-[#0a1a12] border border-emerald-500/30 ml-8'
                          : 'bg-black/60 border border-white/10 mr-8'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="font-bold text-emerald-400 uppercase">
                          {msg.sender === 'user' ? 'Client Inquiry' : 'Geneva Salon Concierge'}
                        </span>
                        <span className="text-slate-500 font-mono">{msg.time}</span>
                      </div>
                      <p className="text-slate-200 text-sm">{msg.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 sm:px-8 py-3.5 border-t border-emerald-500/20 bg-black/60 text-xs text-slate-400 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Geneva Manufacture Master Administrative Control</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.09] border border-white/10 text-white font-medium"
          >
            Close Dashboard
          </button>
        </div>

      </div>
    </div>
  );
};
