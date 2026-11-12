import React, { useState, useEffect } from 'react';
import { adminAPI, schemesAPI, knowledgeAPI, helplinesAPI } from '../services/api';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import {
  Shield,
  Users,
  Mic,
  BookOpen,
  FileCheck,
  AlertTriangle,
  Upload,
  PlusCircle,
  Trash2,
  ExternalLink,
  CheckCircle2,
  TrendingUp,
  RefreshCw,
} from 'lucide-react';

const COLORS = ['#0C4A60', '#E06A1B', '#059669', '#7C3AED', '#2563EB', '#D97706'];

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('analytics'); // analytics, schemes, documents, helplines, unanswered, users
  const [analytics, setAnalytics] = useState(null);
  const [schemes, setSchemes] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [helplines, setHelplines] = useState([]);
  const [unanswered, setUnanswered] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);

  // New scheme form state
  const [newSchemeModal, setNewSchemeModal] = useState(false);
  const [schemeForm, setSchemeForm] = useState({
    name: '',
    description: '',
    category: 'Agriculture',
    benefits: '',
    eligibilityCriteria: '',
    officialUrl: '',
    state: 'All India',
    governmentDepartment: '',
    helpline: '',
  });

  // Document upload state
  const [docUploadModal, setDocUploadModal] = useState(false);
  const [docFile, setDocFile] = useState(null);
  const [docForm, setDocForm] = useState({
    title: '',
    sourceUrl: '',
    department: '',
    schemeName: '',
    language: 'mr',
  });
  const [uploadingDoc, setUploadingDoc] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [anRes, scRes, docRes, hlRes, unRes, usRes] = await Promise.all([
        adminAPI.getAnalytics(),
        schemesAPI.getSchemes({ limit: 50 }),
        knowledgeAPI.getDocuments(),
        helplinesAPI.getHelplines({}),
        adminAPI.getUnansweredQueries(),
        adminAPI.getUsers(),
      ]);

      if (anRes.data?.analytics) setAnalytics(anRes.data.analytics);
      if (scRes.data?.schemes) setSchemes(scRes.data.schemes);
      if (docRes.data?.documents) setDocuments(docRes.data.documents);
      if (hlRes.data?.helplines) setHelplines(hlRes.data.helplines);
      if (unRes.data?.queries) setUnanswered(unRes.data.queries);
      if (usRes.data?.users) setUsersList(usRes.data.users);
    } catch (err) {
      console.warn('Admin load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateScheme = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: schemeForm.name,
        description: schemeForm.description,
        category: schemeForm.category,
        benefits: schemeForm.benefits.split('\n').filter(Boolean),
        eligibility: {
          criteriaText: schemeForm.eligibilityCriteria,
        },
        officialUrl: schemeForm.officialUrl,
        state: schemeForm.state,
        governmentDepartment: schemeForm.governmentDepartment,
        helpline: schemeForm.helpline,
        requiredDocuments: [
          { name: 'Aadhaar Card', description: 'Mandatory identification', mandatory: true },
        ],
        applicationSteps: ['Apply online at the official portal.'],
      };
      await schemesAPI.createScheme(payload);
      setNewSchemeModal(false);
      loadDashboardData();
    } catch (err) {
      alert('Error creating scheme: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteScheme = async (id) => {
    if (window.confirm('Are you sure you want to delete this scheme?')) {
      await schemesAPI.deleteScheme(id);
      loadDashboardData();
    }
  };

  const handleUploadDocument = async (e) => {
    e.preventDefault();
    if (!docFile) return alert('Please select a PDF document to upload');

    setUploadingDoc(true);
    try {
      const formData = new FormData();
      formData.append('file', docFile);
      formData.append('title', docForm.title);
      formData.append('sourceUrl', docForm.sourceUrl);
      formData.append('department', docForm.department);
      formData.append('schemeName', docForm.schemeName);
      formData.append('language', docForm.language);

      await knowledgeAPI.uploadDocument(formData);
      setDocUploadModal(false);
      setDocFile(null);
      loadDashboardData();
    } catch (err) {
      alert('Upload error: ' + (err.response?.data?.message || err.message));
    } finally {
      setUploadingDoc(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 text-white shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-teal-800 text-saffron flex items-center justify-center font-bold">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black font-indic">
              BOLO प्रशासक नियंत्रण कक्ष (Admin Management)
            </h1>
            <p className="text-slate-400 text-xs">
              National AI Public Service Monitoring, Scheme Governance & RAG Knowledge Management
            </p>
          </div>
        </div>

        <button
          onClick={loadDashboardData}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>रिफ्रेश डेटा</span>
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-slate-200 pb-2">
        {[
          { id: 'analytics', label: '📊 सांख्यिकी व चार्ट्स (Analytics)' },
          { id: 'schemes', label: '📜 सरकारी योजना व्यवस्थापन (Schemes)' },
          { id: 'documents', label: '📑 RAG कागदपत्रे व OCR (Knowledge Base)' },
          { id: 'helplines', label: '📞 हेल्पलाईन व्यवस्थापन (Helplines)' },
          { id: 'unanswered', label: '⚠️ अनुत्तरीत प्रश्न लॉग (Unanswered)' },
          { id: 'users', label: '👥 वापरकर्ते (Users)' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition ${
              activeTab === tab.id
                ? 'bg-teal-900 text-white shadow-md'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Analytics & Recharts */}
      {activeTab === 'analytics' && analytics && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Top Metrics Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
              <div className="text-xs font-bold text-slate-400 uppercase">एकूण नोंदणीकृत नागरिक</div>
              <div className="text-3xl font-black text-slate-900 mt-1">
                {analytics.summary.totalRegisteredUsers}
              </div>
              <div className="text-xs text-teal-800 font-semibold mt-1">
                सक्रिय नागरिक: {analytics.summary.activeCitizensThisMonth}
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
              <div className="text-xs font-bold text-slate-400 uppercase">एकूण आवाज चौकशी (Voice)</div>
              <div className="text-3xl font-black text-saffron mt-1">
                {analytics.summary.totalVoiceQueries}
              </div>
              <div className="text-xs text-saffron-800 font-semibold mt-1">
                सरासरी अचूकता: {analytics.summary.avgAccuracyRate}
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
              <div className="text-xs font-bold text-slate-400 uppercase">सत्यापित सरकारी योजना</div>
              <div className="text-3xl font-black text-emerald-600 mt-1">
                {analytics.summary.totalSchemes}
              </div>
              <div className="text-xs text-emerald-800 font-semibold mt-1">
                RAG इंडेक्स डॉक्युमेंट्स: {analytics.summary.knowledgeSourcesIndexed}
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
              <div className="text-xs font-bold text-slate-400 uppercase">सत्यापित हेल्पलाईन</div>
              <div className="text-3xl font-black text-purple-700 mt-1">
                {analytics.summary.totalHelplines}
              </div>
              <div className="text-xs text-purple-800 font-semibold mt-1">२४x७ शासकीय संपर्क</div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Weekly Query Trends Bar Chart */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900 font-indic">
                साप्ताहिक आवाज व मजकूर चौकशी ट्रेंड (Weekly Inquiries)
              </h3>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.queryTrends}>
                    <XAxis dataKey="day" stroke="#64748B" fontSize={12} />
                    <YAxis stroke="#64748B" fontSize={12} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="voiceQueries" name="आवाज चौकशी (Voice)" fill="#0C4A60" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="textQueries" name="मजकूर चौकशी (Text)" fill="#E06A1B" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Language Distribution Pie Chart */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900 font-indic">
                वापरलेल्या भाषांचे प्रमाण (Language Usage Breakdown)
              </h3>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analytics.languageUsage}
                      cx="50%"
                      cy="50%"
                      outerRadius={95}
                      dataKey="queries"
                      nameKey="name"
                      label
                    >
                      {analytics.languageUsage.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Top Searched Schemes Table */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 font-indic">
              सर्वात जास्त विचारल्या गेलेल्या सरकारी योजना (Top Inquired Schemes)
            </h3>
            <div className="space-y-2">
              {analytics.topSchemes.map((s, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-teal-800 text-white text-xs font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <div>
                      <div className="font-bold text-sm text-slate-900">{s.name}</div>
                      <div className="text-xs text-slate-500">{s.category}</div>
                    </div>
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                    {s.searches} नागरिक चौकशी
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Schemes Management CRUD */}
      {activeTab === 'schemes' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 font-indic">
              सरकारी योजना यादी ({schemes.length} योजना)
            </h3>
            <button
              onClick={() => setNewSchemeModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-teal-800 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>नवीन योजना जोडा (Add Scheme)</span>
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
                  <tr>
                    <th className="p-4">योजनेचे नाव</th>
                    <th className="p-4">विभाग</th>
                    <th className="p-4">लागू राज्य</th>
                    <th className="p-4">अधिकृत पोर्टल</th>
                    <th className="p-4 text-right">कृती (Actions)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {schemes.map((s) => (
                    <tr key={s._id || s.slug} className="hover:bg-slate-50/80">
                      <td className="p-4 font-bold text-slate-900 max-w-xs">{s.name}</td>
                      <td className="p-4 text-slate-600">{s.category}</td>
                      <td className="p-4 text-slate-600">{s.state}</td>
                      <td className="p-4">
                        <a
                          href={s.officialUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-teal-800 hover:underline flex items-center gap-1 font-mono text-[11px]"
                        >
                          <span>{s.officialUrl}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleDeleteScheme(s._id || s.slug)}
                          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition"
                          title="Delete Scheme"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: RAG Documents & Knowledge Base */}
      {activeTab === 'documents' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 font-indic">
                RAG Knowledge Store & OCR परिपत्रके
              </h3>
              <p className="text-xs text-slate-500">
                AI या सत्यापित शासकीय PDF दस्तऐवजांच्या चंक्सवर आधारित उत्तरे देते.
              </p>
            </div>
            <button
              onClick={() => setDocUploadModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-teal-800 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition"
            >
              <Upload className="w-4 h-4" />
              <span>नवीन शासकीय PDF अपलोड करा</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.map((doc) => (
              <div
                key={doc._id}
                className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      ✓ Indexed in Vector Store
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {doc.chunkCount || 20} Chunks
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 leading-snug">{doc.title}</h4>
                  <div className="text-xs text-slate-500 font-medium">
                    विभाग: {doc.department}
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-3">
                    {doc.extractedSummary || 'Indexed official government document circular.'}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <a
                    href={doc.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-teal-800 hover:underline flex items-center gap-1 font-semibold"
                  >
                    <span>स्त्रोत लिंक</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <span className="text-slate-400 font-mono text-[10px]">
                    {new Date(doc.lastVerifiedAt).toLocaleDateString('en-IN')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Helplines */}
      {activeTab === 'helplines' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 font-indic">
              सत्यापित हेल्पलाईन क्रमांक ({helplines.length})
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {helplines.map((hl) => (
              <div key={hl._id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500">{hl.state}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800">
                    {hl.isTollFree ? 'Toll-Free' : 'Standard'}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-slate-900">{hl.serviceName}</h4>
                <div className="text-xs text-slate-500">{hl.department}</div>
                <div className="text-sm font-bold text-teal-800 font-mono pt-1">
                  📞 {hl.phoneNumber}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Unanswered Questions Log */}
      {activeTab === 'unanswered' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <h3 className="text-lg font-bold text-slate-900 font-indic">
            कमी खात्री असलेले प्रश्न (Unanswered / Review Log)
          </h3>
          <p className="text-xs text-slate-500">
            ज्या प्रश्नांना RAG मध्ये ०.६५ पेक्षा कमी खात्री मिळाली ते प्रश्न येथे नोंदवले जातात. प्रशासक यावर नवीन GR किंवा परिपत्रक अपलोड करू शकतात.
          </p>

          <div className="space-y-3">
            {unanswered.map((u) => (
              <div
                key={u._id}
                className="bg-white p-4 rounded-2xl border border-amber-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span className="font-bold text-sm text-slate-900 font-indic">
                      "{u.query}"
                    </span>
                  </div>
                  <div className="text-xs text-slate-500">
                    भाषा: {u.language.toUpperCase()} • खात्री स्कोअर: {(u.confidence * 100).toFixed(0)}%
                  </div>
                </div>
                <span className="text-xs px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-bold shrink-0">
                  {u.suggestedScheme || 'पुनरावलोकन आवश्यक'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 6: Users */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm animate-in fade-in duration-200">
          <div className="p-4 border-b border-slate-100 font-bold text-slate-900">
            नोंदणीकृत वापरकर्ते ({usersList.length})
          </div>
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
              <tr>
                <th className="p-4">नाव</th>
                <th className="p-4">ईमेल</th>
                <th className="p-4">भूमिका (Role)</th>
                <th className="p-4">भाषा</th>
                <th className="p-4">राज्य</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {usersList.map((u) => (
                <tr key={u._id || u.email}>
                  <td className="p-4 font-bold text-slate-900">{u.name}</td>
                  <td className="p-4 text-slate-600">{u.email}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        u.role === 'admin'
                          ? 'bg-teal-100 text-teal-800'
                          : u.role === 'volunteer'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="p-4 uppercase text-slate-600">{u.preferredLanguage}</td>
                  <td className="p-4 text-slate-600">{u.state || 'Maharashtra'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Scheme Modal */}
      {newSchemeModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
            <h3 className="text-xl font-bold text-slate-900 font-indic">नवीन सरकारी योजना प्रकाशित करा</h3>
            <form onSubmit={handleCreateScheme} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">योजनेचे नाव *</label>
                <input
                  type="text"
                  required
                  value={schemeForm.name}
                  onChange={(e) => setSchemeForm({ ...schemeForm, name: e.target.value })}
                  placeholder="उदा. प्रधानमंत्री मातृ वंदना योजना"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">विभाग (Category) *</label>
                <select
                  value={schemeForm.category}
                  onChange={(e) => setSchemeForm({ ...schemeForm, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white"
                >
                  <option value="Agriculture">Agriculture</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Women Empowerment">Women Empowerment</option>
                  <option value="Housing">Housing</option>
                  <option value="Financial Assistance">Financial Assistance</option>
                  <option value="Social Welfare">Social Welfare</option>
                  <option value="Employment">Employment</option>
                  <option value="Education">Education</option>
                  <option value="Rural Development">Rural Development</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">वर्णन (Description) *</label>
                <textarea
                  required
                  rows={2}
                  value={schemeForm.description}
                  onChange={(e) => setSchemeForm({ ...schemeForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">मिळणारे फायदे (दर ओळीवर एक फायदा)</label>
                <textarea
                  rows={2}
                  value={schemeForm.benefits}
                  onChange={(e) => setSchemeForm({ ...schemeForm, benefits: e.target.value })}
                  placeholder="उदा. ₹५,००० थेट बँक खात्यात"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">पात्रता निकष *</label>
                <textarea
                  required
                  rows={2}
                  value={schemeForm.eligibilityCriteria}
                  onChange={(e) => setSchemeForm({ ...schemeForm, eligibilityCriteria: e.target.value })}
                  placeholder="पात्रतेचे नियम स्पष्ट लिहा"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">शासकीय विभाग *</label>
                  <input
                    type="text"
                    required
                    value={schemeForm.governmentDepartment}
                    onChange={(e) => setSchemeForm({ ...schemeForm, governmentDepartment: e.target.value })}
                    placeholder="उदा. महिला व बाल विकास मंत्रालय"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">अधिकृत URL *</label>
                  <input
                    type="url"
                    required
                    value={schemeForm.officialUrl}
                    onChange={(e) => setSchemeForm({ ...schemeForm, officialUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setNewSchemeModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 text-xs font-bold hover:bg-slate-100"
                >
                  रद्द करा
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-800 text-white text-xs font-bold shadow-md hover:bg-teal-700"
                >
                  योजना प्रकाशित करा
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Upload Document Modal */}
      {docUploadModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
            <h3 className="text-xl font-bold text-slate-900 font-indic">RAG साठी शासकीय PDF अपलोड करा</h3>
            <form onSubmit={handleUploadDocument} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">दस्तऐवज शीर्षक *</label>
                <input
                  type="text"
                  required
                  value={docForm.title}
                  onChange={(e) => setDocForm({ ...docForm, title: e.target.value })}
                  placeholder="उदा. PM-KISAN Operational Guidelines 2026"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">शासकीय विभाग *</label>
                <input
                  type="text"
                  required
                  value={docForm.department}
                  onChange={(e) => setDocForm({ ...docForm, department: e.target.value })}
                  placeholder="उदा. कृषी आणि शेतकरी कल्याण मंत्रालय"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">अधिकृत स्रोत URL *</label>
                <input
                  type="url"
                  required
                  value={docForm.sourceUrl}
                  onChange={(e) => setDocForm({ ...docForm, sourceUrl: e.target.value })}
                  placeholder="https://pmkisan.gov.in/guidelines.pdf"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">PDF फाईल निवडा *</label>
                <input
                  type="file"
                  required
                  accept=".pdf,.txt,.doc,.docx"
                  onChange={(e) => setDocFile(e.target.files[0])}
                  className="w-full text-xs text-slate-600 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-teal-50 file:text-teal-800 hover:file:bg-teal-100"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setDocUploadModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 text-xs font-bold hover:bg-slate-100"
                >
                  रद्द करा
                </button>
                <button
                  type="submit"
                  disabled={uploadingDoc}
                  className="px-5 py-2 rounded-xl bg-teal-800 text-white text-xs font-bold shadow-md hover:bg-teal-700"
                >
                  {uploadingDoc ? 'प्रक्रिया सुरू आहे...' : 'अपलोड व RAG इंडेक्स करा'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
