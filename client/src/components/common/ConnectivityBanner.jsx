import React from 'react';
import { useConnectivity } from '../../context/ConnectivityContext';
import { WifiOff, AlertCircle, X } from 'lucide-react';

const ConnectivityBanner = () => {
  const { isOffline, offlineNoticeDismissed, dismissOfflineNotice, cachedSchemesCount } = useConnectivity();

  if (!isOffline || offlineNoticeDismissed) return null;

  return (
    <div className="bg-amber-600 text-white px-4 py-2.5 text-sm shadow-md transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 font-medium">
          <div className="p-1 rounded-full bg-amber-700/60">
            <WifiOff className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <span>आपण ऑफलाइन आहात (इंटरनेट बंद आहे).</span>
            <span className="hidden sm:inline text-amber-100 ml-1.5">
              कॅशे केलेल्या {cachedSchemesCount || 8} सरकारी योजना आणि हेल्पलाईन उपलब्ध आहेत. नवीन चौकशीसाठी इंटरनेट कनेक्ट करा.
            </span>
          </div>
        </div>
        <button
          onClick={dismissOfflineNotice}
          className="p-1 hover:bg-amber-700 rounded-md transition text-amber-200 hover:text-white"
          aria-label="Dismiss banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ConnectivityBanner;
