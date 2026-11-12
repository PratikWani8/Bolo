import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { schemesAPI } from '../services/api';
import { SCHEME_CATEGORIES, INDIAN_STATES } from '../utils/constants';
import VerifiedBadge from '../components/common/VerifiedBadge';
import {
  Search,
  Filter,
  Volume2,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  FileText,
  MapPin,
  Sparkles,
} from 'lucide-react';

const SchemeExplorerPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  const initialSearch = searchParams.get('q') || '';

  const [schemes, setSchemes] = useState([]);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedState, setSelectedState] = useState('All India');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedSchemeModal, setSelectedSchemeModal] = useState(null);

  useEffect(() => {
    fetchSchemes();
  }, [selectedCategory, selectedState, currentPage]);

  const fetchSchemes = async () => {
    setLoading(true);
    try {
      const res = await schemesAPI.getSchemes({
        category: selectedCategory,
        state: selectedState,
        q: searchTerm,
        page: currentPage,
        limit: 8,
      });
      if (res.data?.schemes) {
        setSchemes(res.data.schemes);
        setTotalPages(res.data.totalPages || 1);
      }
    } catch (err) {
      console.warn('Fetch schemes error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchSchemes();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 font-indic tracking-tight">
          सरकारी योजना शोध दालन (Government Schemes Explorer)
        </h1>
        <p className="text-sm text-slate-600">
          केंद्र आणि राज्य शासनाच्या सर्व सत्यापित लोककल्याणकारी योजनांचे तपशील, पात्रता आणि कागदपत्रांची अधिकृत माहिती.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="योजनेचे नाव, विभाग किंवा लाभ शोधा (उदा. किसान, लाडकी बहीण, घरकुल, पेन्शन...)"
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

        {/* Categories Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => {
              setSelectedCategory('All');
              setCurrentPage(1);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
              selectedCategory === 'All'
                ? 'bg-teal-800 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            सर्व विभाग (All Categories)
          </button>
          {SCHEME_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                selectedCategory === cat.id
                  ? 'bg-teal-800 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat.labelMr}
            </button>
          ))}
        </div>

        {/* State Filter Dropdown */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>राज्य निवडा:</span>
            <select
              value={selectedState}
              onChange={(e) => {
                setSelectedState(e.target.value);
                setCurrentPage(1);
              }}
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
            एकूण सापडलेल्या योजना: {schemes.length}
          </span>
        </div>
      </div>

      {/* Schemes Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-64 rounded-3xl bg-slate-100 animate-pulse" />
          ))}
        </div>
      ) : schemes.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-md mx-auto space-y-4">
          <Search className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800 font-indic">
            कोणतीही योजना सापडली नाही
          </h3>
          <p className="text-xs text-slate-500">
            कृपया वेगळा शब्द टाकून शोधा किंवा सर्व विभाग निवडून पुन्हा प्रयत्न करा.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSelectedState('All India');
              setSearchTerm('');
            }}
            className="px-4 py-2 rounded-xl bg-teal-800 text-white text-xs font-bold"
          >
            फिल्टर्स पूर्ववत करा
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {schemes.map((scheme) => (
            <div
              key={scheme._id || scheme.slug}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-teal-50 text-teal-800 border border-teal-200">
                    {scheme.category}
                  </span>
                  <VerifiedBadge date={scheme.lastVerifiedAt} />
                </div>

                <h3 className="text-xl font-bold text-slate-900 font-indic group-hover:text-teal-900 transition">
                  {scheme.translations?.mr?.name || scheme.name}
                </h3>

                <p className="text-xs text-slate-500 font-semibold">
                  विभाग: {scheme.governmentDepartment}
                </p>

                <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
                  {scheme.translations?.mr?.description || scheme.description}
                </p>

                {/* Key Benefits Snippet */}
                <div className="space-y-1.5 pt-1">
                  <div className="text-xs font-bold text-slate-700">प्रमुख फायदे:</div>
                  <ul className="space-y-1 text-xs text-slate-600">
                    {scheme.benefits?.slice(0, 2).map((b, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{scheme.state}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    to={`/assistant?q=${encodeURIComponent(scheme.name)}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold text-xs transition"
                    title="Ask AI in voice about this scheme"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-saffron" />
                    <span>आवाज सहाय्य</span>
                  </Link>

                  <button
                    onClick={() => setSelectedSchemeModal(scheme)}
                    className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-teal-800 hover:bg-teal-700 text-white font-bold text-xs shadow-sm transition"
                  >
                    <span>सविस्तर पहा</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Scheme Detail Modal */}
      {selectedSchemeModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-teal-50 text-teal-800 border border-teal-200 mb-2 inline-block">
                  {selectedSchemeModal.category}
                </span>
                <h2 className="text-2xl font-black text-slate-900 font-indic">
                  {selectedSchemeModal.translations?.mr?.name || selectedSchemeModal.name}
                </h2>
                <div className="text-xs text-slate-500 font-semibold mt-1">
                  {selectedSchemeModal.governmentDepartment} • लागू: {selectedSchemeModal.state}
                </div>
              </div>
              <button
                onClick={() => setSelectedSchemeModal(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
              <div>
                <h4 className="font-bold text-slate-900 mb-1">योजनेचे स्वरूप (Description):</h4>
                <p>{selectedSchemeModal.description}</p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-1">पात्रतेचे निकष (Eligibility):</h4>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  {selectedSchemeModal.eligibility?.criteriaText}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-1">आवश्यक कागदपत्रे (Required Documents):</h4>
                <ul className="space-y-1.5">
                  {selectedSchemeModal.requiredDocuments?.map((doc, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>
                        <strong>{doc.name}:</strong> {doc.description}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-1">अर्ज कसा करावा (Application Steps):</h4>
                <ol className="list-decimal list-inside space-y-1">
                  {selectedSchemeModal.applicationSteps?.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ol>
              </div>

              {selectedSchemeModal.helpline && (
                <div className="p-3 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200 font-semibold">
                  📞 अधिकृत हेल्पलाईन: {selectedSchemeModal.helpline}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <Link
                to={`/assistant?q=${encodeURIComponent(selectedSchemeModal.name)}`}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-50 text-teal-800 font-bold text-xs"
              >
                <Volume2 className="w-4 h-4 text-saffron" />
                <span>या योजनेबद्दल प्रश्न विचारा</span>
              </Link>

              {selectedSchemeModal.officialUrl && (
                <a
                  href={selectedSchemeModal.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-teal-800 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition"
                >
                  <span>अधिकृत संकेतस्थळाला भेट द्या</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchemeExplorerPage;
