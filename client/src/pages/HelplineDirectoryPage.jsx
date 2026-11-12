import React, { useState, useEffect } from 'react';
import { helplinesAPI } from '../services/api';
import { INDIAN_STATES } from '../utils/constants';
import VerifiedBadge from '../components/common/VerifiedBadge';
import { PhoneCall, Search, ExternalLink, Clock, ShieldCheck, MapPin } from 'lucide-react';

const HelplineDirectoryPage = () => {
  const [helplines, setHelplines] = useState([]);
  const [search, setSearch] = useState('');
  const [stateFilter, setStateFilter] = useState('All India');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHelplines();
  }, [stateFilter]);

  const fetchHelplines = async () => {
    setLoading(true);
    try {
      const res = await helplinesAPI.getHelplines({
        state: stateFilter,
        search,
      });
      if (res.data?.helplines) {
        setHelplines(res.data.helplines);
      }
    } catch (err) {
      console.warn('Helplines fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchHelplines();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 font-indic tracking-tight">
          अधिकृत शासकीय हेल्पलाईन निर्देशिका
        </h1>
        <p className="text-sm text-slate-600">
          शासनाच्या विविध विभागांचे टोल-फ्री क्रमांक, कॉल सेंटर वेळ आणि थेट फोन संपर्क.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md space-y-4">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="विभागाचे नाव किंवा सेवा शोधा (उदा. किसान, महिला, आरोग्य, तक्रार...)"
              className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-700"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 rounded-2xl bg-teal-800 hover:bg-teal-700 text-white font-bold text-sm shadow-md transition"
          >
            शोधा (Search)
          </button>
        </form>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <span>राज्य निवडा:</span>
            <select
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white font-semibold text-slate-700 focus:outline-none"
            >
              {INDIAN_STATES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <span className="font-semibold text-slate-700">
            एकूण हेल्पलाईन: {helplines.length}
          </span>
        </div>
      </div>

      {/* Helplines Cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-44 rounded-3xl bg-slate-100 animate-pulse" />
          ))}
        </div>
      ) : helplines.length === 0 ? (
        <div className="text-center py-12 text-slate-500 text-sm">
          कोणतीही हेल्पलाईन सापडली नाही.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {helplines.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{item.state}</span>
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {item.isTollFree ? 'टोल-फ्री (Toll-Free)' : 'शुल्क लागू'}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 font-indic">
                  {item.serviceName}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  विभाग: {item.department}
                </p>

                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{item.timings}</span>
                </div>
              </div>

              {/* One-tap dial button */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                <a
                  href={`tel:${item.phoneNumber.split('/')[0].trim()}`}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl bg-teal-800 hover:bg-teal-700 text-white font-bold text-sm shadow-md transition"
                >
                  <PhoneCall className="w-4 h-4 text-saffron" />
                  <span>कॉल करा: {item.phoneNumber}</span>
                </a>

                {item.officialSource && (
                  <a
                    href={item.officialSource}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                    title="Official Web Portal"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HelplineDirectoryPage;
