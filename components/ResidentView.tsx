import React, { useState } from 'react';
import { ShoppingBag, MapPin, Trash2, Home, Search, Star, MessageCircle, Map } from 'lucide-react';
import { MarketItem, PlaceRecommendation } from '../types';
import { getNeighborhoodRecommendations } from '../services/geminiService';

const ResidentView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'MARKET' | 'GUIDE' | 'WASTE'>('GUIDE');

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold font-serif text-primary">SocietySync</h1>
        <p className="text-xs text-gray-500">Welcome, Priya (A-402)</p>
      </div>

      {/* Tabs */}
      <div className="flex bg-white border-b border-gray-200">
        <button 
          onClick={() => setActiveTab('MARKET')}
          className={`flex-1 py-3 text-sm font-medium flex justify-center items-center ${activeTab === 'MARKET' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}
        >
          <ShoppingBag size={18} className="mr-2" /> Marketplace
        </button>
        <button 
          onClick={() => setActiveTab('GUIDE')}
          className={`flex-1 py-3 text-sm font-medium flex justify-center items-center ${activeTab === 'GUIDE' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}
        >
          <MapPin size={18} className="mr-2" /> AI Guide
        </button>
        <button 
          onClick={() => setActiveTab('WASTE')}
          className={`flex-1 py-3 text-sm font-medium flex justify-center items-center ${activeTab === 'WASTE' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}
        >
          <Trash2 size={18} className="mr-2" /> Waste
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'MARKET' && <Marketplace />}
        {activeTab === 'GUIDE' && <NeighborhoodGuide />}
        {activeTab === 'WASTE' && <WasteGuide />}
      </div>
    </div>
  );
};

// --- Sub Components ---

const Marketplace: React.FC = () => {
  const items: MarketItem[] = [
    { id: '1', title: 'Homemade Tiffin Service', price: 120, seller: 'Priya S.', verified: true, image: 'https://picsum.photos/200/200?random=1', category: 'SERVICE', scope: 'CITY_WIDE' },
    { id: '2', title: 'Study Table', price: 1500, seller: 'Amit K.', verified: true, image: 'https://picsum.photos/200/200?random=2', category: 'SALE', scope: 'SOCIETY' },
    { id: '3', title: 'Math Tuition (Class 5-10)', price: 500, seller: 'Rohan M.', verified: true, image: 'https://picsum.photos/200/200?random=3', category: 'SERVICE', scope: 'SOCIETY' },
    { id: '4', title: 'Organic Honey', price: 350, seller: 'Farm Fresh', verified: true, image: 'https://picsum.photos/200/200?random=4', category: 'SALE', scope: 'CITY_WIDE' },
  ];

  return (
    <div className="p-4">
       <div className="flex justify-between items-center mb-4">
         <h2 className="font-bold text-gray-800">Community Market</h2>
         <span className="bg-secondary text-white text-xs px-2 py-1 rounded-full">City-Wide Active</span>
       </div>
       
       <div className="grid grid-cols-2 gap-4">
         {items.map(item => (
           <div key={item.id} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
             <div className="h-32 bg-gray-200 overflow-hidden relative">
               <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
               {item.scope === 'CITY_WIDE' && <span className="absolute top-2 right-2 bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-full shadow">City Wide</span>}
             </div>
             <div className="p-3">
               <h3 className="font-medium text-gray-900 truncate">{item.title}</h3>
               <p className="text-primary font-bold mt-1">₹{item.price}</p>
               <div className="flex items-center mt-2 text-xs text-gray-500">
                 {item.verified && <span className="bg-green-100 text-green-700 p-0.5 rounded-full mr-1"><CheckIcon size={10}/></span>}
                 {item.seller}
               </div>
             </div>
           </div>
         ))}
       </div>
    </div>
  );
}

const NeighborhoodGuide: React.FC = () => {
  const [query, setQuery] = useState('');
  const [recommendations, setRecommendations] = useState<PlaceRecommendation[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if(!query) return;
    setLoading(true);
    const results = await getNeighborhoodRecommendations(query);
    setRecommendations(results);
    setLoading(false);
  };

  return (
    <div className="p-4">
      <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-lg mb-6">
        <h2 className="font-bold text-indigo-900 flex items-center mb-2">
          <Star className="mr-2 text-secondary fill-current" size={18} />
          AI Neighborhood Guide
        </h2>
        <p className="text-sm text-indigo-700 mb-4">
          Trusted, 3-line summaries powered by Gemini. No more reading 100s of raw reviews.
        </p>
        
        <div className="flex space-x-2">
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. 'Best pizza nearby' or 'Pediatrician'"
            className="flex-1 p-2 rounded-lg border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
          <button 
            onClick={handleSearch}
            disabled={loading}
            className="bg-indigo-600 text-white p-2 rounded-lg"
          >
            {loading ? '...' : <Search size={20} />}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {recommendations.length === 0 && !loading && (
          <div className="text-center text-gray-400 mt-10">
            <Map size={48} className="mx-auto mb-2 opacity-50" />
            <p>Ask me anything about the neighborhood.</p>
          </div>
        )}

        {recommendations.map((place, idx) => (
          <div key={idx} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
             <div className="flex justify-between items-start mb-2">
               <div>
                 <h3 className="font-bold text-gray-900 text-lg">{place.name}</h3>
                 <p className="text-xs text-gray-500">{place.address} • {place.type}</p>
               </div>
               <div className="bg-green-100 text-green-800 font-bold px-2 py-1 rounded text-xs flex items-center">
                 {place.rating} <Star size={10} className="ml-1 fill-current" />
               </div>
             </div>
             
             <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 relative">
                <span className="absolute -top-2 left-3 bg-secondary text-white text-[10px] px-2 py-0.5 rounded">Gemini Summary</span>
                <p className="text-sm text-gray-700 mt-2 italic leading-relaxed">
                  "{place.summary}"
                </p>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const WasteGuide: React.FC = () => {
  return (
    <div className="p-4">
      <h2 className="font-bold text-gray-800 mb-4">Waste Management Guide</h2>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-green-50 border border-green-200 p-4 rounded-xl text-center">
          <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center mx-auto mb-2 text-2xl">🥬</div>
          <h3 className="font-bold text-green-800">Wet Waste</h3>
          <p className="text-xs text-green-600 mt-1">Kitchen scraps, fruit peels</p>
          <p className="text-[10px] font-bold mt-2 uppercase tracking-wide">Daily Collection</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl text-center">
          <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center mx-auto mb-2 text-2xl">📦</div>
          <h3 className="font-bold text-blue-800">Dry Waste</h3>
          <p className="text-xs text-blue-600 mt-1">Paper, plastic, metal</p>
          <p className="text-[10px] font-bold mt-2 uppercase tracking-wide">Mon, Wed, Fri</p>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
         <div>
           <p className="font-medium">Collection Reminder</p>
           <p className="text-xs text-gray-500">Next pickup: 7:00 AM Tomorrow</p>
         </div>
         <button className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm">Set Alarm</button>
      </div>
    </div>
  )
}

const CheckIcon = ({size} : {size: number}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
)

export default ResidentView;