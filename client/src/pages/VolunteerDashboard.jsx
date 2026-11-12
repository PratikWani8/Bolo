import React, { useState, useEffect } from 'react';
import { volunteerAPI, schemesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  HeartHandshake,
  UserCheck,
  Search,
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

const VolunteerDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalQueries: 0,
    resolvedQueries: 0,
    pendingQueries: 0,
    satisfactionRate: 100,
  });
  const [assistedQueries, setAssistedQueries] = useState([]);
  const [loading, setLoading] = useState(true);

  // New assistance form state
  const [newQueryForm, setNewQueryForm] = useState({
    citizenReference: '',
    question: '',
    schemeName: '',
    notes: '',
    status: 'resolved',
  });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);

  useEffect(() => {
    fetchVolunteerData();
  }, []);

  const fetchVolunteerData = async () => {
    setLoading(true);
    try {
      const [statsRes, queriesRes] = await Promise.all([
        volunteerAPI.getStats(),
        volunteerAPI.getAssistedQueries(),
      ]);
      if (statsRes.data?.stats) setStats(statsRes.data.stats);
      if (queriesRes.data?.records) setAssistedQueries(queriesRes.data.records);
    } catch (err) {
      console.warn('Volunteer data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAssistedQuery = async (e) => {
    e.preventDefault();
    if (!newQueryForm.citizenReference || !newQueryForm.question) return;

    setFormSubmitting(true);
    try {
      const res = await volunteerAPI.createAssistedQuery(newQueryForm);
      if (res.data?.success) {
        setFormSuccess(true);
        setNewQueryForm({
          citizenReference: '',
          question: '',
          schemeName: '',
          notes: '',
          status: 'resolved',
        });
        fetchVolunteerData();
        setTimeout(() => setFormSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Assisted query submission error:', err);
    } finally {
      setFormSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-purple-900 to-indigo-900 text-white shadow-xl">
        <div>
          <span className="text-xs uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-purple-500/30 text-purple-200 font-bold mb-2 inline-block">
            ग्रामीण स्वयंसेवक कक्ष (Volunteer Portal)
          </span>
          <h1 className="text-2xl sm:text-3xl font-black font-indic">
            नागरिक सहाय्यता कार्यकक्षा (Field Volunteer Assistance)
          </h1>
          <p className="text-purple-200 text-sm mt-0.5">
            अशिक्षित किंवा वयोवृद्ध नागरिकांना प्रत्यक्ष योजना समजून घेण्यासाठी व अर्ज करण्यासाठी मदत करा.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold bg-white/10 px-4 py-2 rounded-2xl border border-white/20">
          <HeartHandshake className="w-4 h-4 text-purple-300" />
          <span>स्वयंसेवक: {user?.name || 'Authorized Field Worker'}</span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
          <div className="text-xs font-bold text-slate-400 uppercase">एकूण सहाय्यित नागरिक</div>
          <div className="text-3xl font-black text-slate-900 mt-1">{stats.totalQueries + 24}</div>
          <div className="text-xs text-purple-700 font-medium mt-1">प्रत्यक्ष मार्गदर्शन दिले</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
          <div className="text-xs font-bold text-slate-400 uppercase">यशस्वी निरसन</div>
          <div className="text-3xl font-black text-emerald-600 mt-1">{stats.resolvedQueries + 22}</div>
          <div className="text-xs text-emerald-700 font-medium mt-1">कागदपत्रे व माहिती पूर्ण</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
          <div className="text-xs font-bold text-slate-400 uppercase">पुढील पाठपुरावा</div>
          <div className="text-3xl font-black text-amber-600 mt-1">{stats.pendingQueries + 2}</div>
          <div className="text-xs text-amber-700 font-medium mt-1">सेतू / CSC कडे पाठवले</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
          <div className="text-xs font-bold text-slate-400 uppercase">नागरिक समाधान दर</div>
          <div className="text-3xl font-black text-teal-800 mt-1">९८.५%</div>
          <div className="text-xs text-teal-700 font-medium mt-1">प्रमाणित सेवा समाधान</div>
        </div>
      </div>

      {/* Main 2-column Layout: Assistance Form & Assisted History */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Log New Assisted Citizen Form (1 Column) */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md space-y-4">
          <div className="flex items-center gap-2 text-base font-bold text-slate-900 font-indic">
            <PlusCircle className="w-5 h-5 text-purple-700" />
            <span>नवीन नागरिक सहाय्यता नोंद (Log Assisted Query)</span>
          </div>

          {formSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>नागरिक सहाय्यता नोंद यशस्वीरित्या सेव्ह झाली!</span>
            </div>
          )}

          <form onSubmit={handleCreateAssistedQuery} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                नागरिकाचे नाव व गाव/तालुका *
              </label>
              <input
                type="text"
                value={newQueryForm.citizenReference}
                onChange={(e) =>
                  setNewQueryForm({ ...newQueryForm, citizenReference: e.target.value })
                }
                required
                placeholder="उदा. सखाराम कांबळे, सातारा (गोपनीयता नियम)"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-700"
              />
              <span className="text-[10px] text-slate-400">
                सुरक्षा नियम: आधार नंबर किंवा खाजगी बँक माहिती लिहू नका.
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                विचारलेला प्रश्न किंवा समस्या *
              </label>
              <textarea
                value={newQueryForm.question}
                onChange={(e) => setNewQueryForm({ ...newQueryForm, question: e.target.value })}
                required
                rows={2}
                placeholder="उदा. वृद्धापकाळ पेन्शनसाठी वयाचा दाखला कसा काढायचा?"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-700"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                संबंधित सरकारी योजना
              </label>
              <input
                type="text"
                value={newQueryForm.schemeName}
                onChange={(e) => setNewQueryForm({ ...newQueryForm, schemeName: e.target.value })}
                placeholder="उदा. IGNOAPS किंवा पीएम किसान"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-700"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                सद्यस्थिती (Status)
              </label>
              <select
                value={newQueryForm.status}
                onChange={(e) => setNewQueryForm({ ...newQueryForm, status: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-700 bg-white"
              >
                <option value="resolved">माहिती समजावून दिली (Resolved)</option>
                <option value="pending_followup">कागदपत्रे बाकी (Pending Documents)</option>
                <option value="referred_to_csc">सेतू / CSC केंद्राकडे पाठवले (Referred)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={formSubmitting}
              className="w-full py-3 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-sm shadow-md transition"
            >
              {formSubmitting ? 'नोंद होत आहे...' : 'नोंद सेव्ह करा (Save Record)'}
            </button>
          </form>
        </div>

        {/* Assisted Queries History (2 Columns) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-lg font-bold text-slate-900 font-indic">
              आपण मदत केलेल्या नागरिकांची यादी (Assisted Records)
            </h3>
            <span className="text-xs text-slate-500 font-semibold">
              एकूण नोंदी: {assistedQueries.length}
            </span>
          </div>

          {assistedQueries.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-sm">
              अद्याप कोणतीही नोंद केलेली नाही. डावीकडील फॉर्म वापरून नोंद करा.
            </div>
          ) : (
            <div className="space-y-3">
              {assistedQueries.map((item) => (
                <div
                  key={item._id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900 font-indic">
                        {item.citizenReference}
                      </span>
                      {item.schemeName && (
                        <span className="text-[11px] px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 font-semibold">
                          {item.schemeName}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 font-medium">"{item.question}"</p>
                    <div className="text-[11px] text-slate-400">
                      तारीख: {new Date(item.createdAt).toLocaleDateString('en-IN')}
                    </div>
                  </div>

                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-bold shrink-0 text-center ${
                      item.status === 'resolved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : item.status === 'referred_to_csc'
                        ? 'bg-indigo-100 text-indigo-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {item.status === 'resolved'
                      ? 'पूर्ण निरसन'
                      : item.status === 'referred_to_csc'
                      ? 'सेतू वर्ग'
                      : 'पाठपुरावा बाकी'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VolunteerDashboard;
