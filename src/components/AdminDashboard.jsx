import React, { useEffect, useState } from 'react';
import { BookOpen, Download, Edit2, Key, Layers, Plus, Search, Shield, Trash2, Trophy, Users, X } from 'lucide-react';
import { api } from '../services/api';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('leaderboard');
  const [activeSet, setActiveSet] = useState('setA');
  const [results, setResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [questionsObj, setQuestionsObj] = useState({});
  const [adminError, setAdminError] = useState('');
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [qText, setQText] = useState('');
  const [qAnswer, setQAnswer] = useState('');
  const [qExplanation, setQExplanation] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const loadDashboard = async () => {
    try {
      const data = await api.getDashboard();
      setActiveSet(data.activeSet);
      setResults(data.results);
      setQuestionsObj(data.questions);
      setAdminError('');
    } catch (err) {
      setAdminError(err.message);
    }
  };

  useEffect(() => {
    loadDashboard();
    const timer = setInterval(loadDashboard, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleSetActive = async (newSet) => {
    try {
      const data = await api.setActiveSet(newSet);
      setActiveSet(data.activeSet);
      setAdminError('');
    } catch (err) {
      setAdminError(err.message);
    }
  };

  const handleClearSingleAttempt = async (email, setKey) => {
    if (!window.confirm(`Clear attempt for '${email}' on ${setKey === 'setA' ? 'Set A' : 'Set B'}? They will be allowed to retake the quiz.`)) return;
    try {
      const data = await api.clearAttempt(email, setKey);
      setResults(data.results);
      setAdminError('');
    } catch (err) {
      setAdminError(err.message);
    }
  };

  const handleDeleteReport = async (resultId, email) => {
    if (!window.confirm(`Permanently delete this report for '${email}' from the leaderboard? This cannot be undone.`)) return;
    try {
      const data = await api.deleteResult(resultId);
      setResults(data.results);
      setAdminError('');
    } catch (err) {
      setAdminError(err.message);
    }
  };

  const handleClearAllResults = async () => {
    if (!window.confirm('Are you sure you want to clear ALL student leaderboard results? This action cannot be undone.')) return;
    try {
      const data = await api.clearResults();
      setResults(data.results);
      setAdminError('');
    } catch (err) {
      setAdminError(err.message);
    }
  };

  const handleExportCSV = () => {
    if (results.length === 0) {
      alert('No leaderboard results to export.');
      return;
    }

    const headers = ['Student Name', 'Roll/Email ID', 'Active Set Attempted', 'Score', 'Total Questions', 'Percentage (%)', 'Time Taken (s)', 'Submitted At', 'Timed Out'];
    const rows = results.map((r) => [
      `"${r.name.replace(/"/g, '""')}"`,
      `"${r.email.replace(/"/g, '""')}"`,
      `"${r.set === 'setA' ? 'Set A' : r.set === 'setB' ? 'Set B' : 'Custom'}"`,
      r.score,
      r.total,
      `${r.percentage}%`,
      r.timeSeconds || 0,
      `"${new Date(r.submittedAt || r.date).toLocaleString().replace(/"/g, '""')}"`,
      r.timedOut ? 'Yes' : 'No'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `Treasure_Hunt_Pattern_Leaderboard_${activeSet}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenAddQuestion = (setKey) => {
    setEditingQuestion({ setKey, id: null });
    setQText('');
    setQAnswer('');
    setQExplanation('');
    setIsAdding(true);
  };

  const handleOpenEditQuestion = (setKey, q) => {
    setEditingQuestion({ setKey, id: q.id });
    setQText(q.text);
    setQAnswer(q.answer);
    setQExplanation(q.explanation || '');
    setIsAdding(false);
  };

  const handleSaveQuestion = async (e) => {
    e.preventDefault();
    if (!qText.trim() || !qAnswer.trim()) {
      alert('Please fill in the question prompt and expected answer key.');
      return;
    }

    const setKey = editingQuestion.setKey;
    const currentList = [...(questionsObj[setKey] || [])];
    if (isAdding) {
      const newId = currentList.length > 0 ? Math.max(...currentList.map((q) => q.id)) + 1 : 1;
      currentList.push({
        id: newId,
        text: qText.trim(),
        answer: qAnswer.trim(),
        explanation: qExplanation.trim() || 'Mathematical pattern rule applied.'
      });
    } else {
      const index = currentList.findIndex((q) => q.id === editingQuestion.id);
      if (index !== -1) {
        currentList[index] = {
          ...currentList[index],
          text: qText.trim(),
          answer: qAnswer.trim(),
          explanation: qExplanation.trim()
        };
      }
    }

    const updatedObj = { ...questionsObj, [setKey]: currentList };
    try {
      const data = await api.saveQuestions(updatedObj);
      setQuestionsObj(data.questions);
      setEditingQuestion(null);
      setAdminError('');
    } catch (err) {
      setAdminError(err.message);
    }
  };

  const handleDeleteQuestion = async (setKey, qId) => {
    if (!window.confirm('Delete this question?')) return;
    const updatedObj = {
      ...questionsObj,
      [setKey]: (questionsObj[setKey] || []).filter((q) => q.id !== qId)
    };
    try {
      const data = await api.saveQuestions(updatedObj);
      setQuestionsObj(data.questions);
      setAdminError('');
    } catch (err) {
      setAdminError(err.message);
    }
  };

  const filteredResults = results.filter((r) =>
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTime = (secs) => {
    if (!secs) return '0s';
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return mins > 0 ? `${mins}m ${s}s` : `${s}s`;
  };

  return (
    <div className="w-full max-w-6xl mx-auto my-6 px-4 relative z-10 animate-fadeIn space-y-6">
      <div className="bg-slate-900/80 backdrop-blur-2xl border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white">Admin Control Center</h2>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono border border-amber-500/30">
                Server Secured
              </span>
            </div>
            <p className="text-xs text-slate-400">Authoritative scoring, attempt locking, and question management.</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
          <span className="text-xs font-semibold text-slate-400 px-3 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-cyan-400" /> Active Set:
          </span>
          {['setA', 'setB'].map((sKey) => {
            const isActive = activeSet === sKey;
            const label = sKey === 'setA' ? 'Set A' : 'Set B';
            return (
              <button
                key={sKey}
                onClick={() => handleSetActive(sKey)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30 ring-1 ring-indigo-400'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                {isActive && <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />}
                {label} ({(questionsObj[sKey] || []).length} Qs)
              </button>
            );
          })}
        </div>
      </div>

      {adminError && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
          {adminError}
        </div>
      )}

      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('leaderboard')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
            activeTab === 'leaderboard'
              ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Trophy className="w-4 h-4 text-amber-400" />
          <span>Leaderboard ({results.length})</span>
        </button>
        {['setA', 'setB'].map((setKey) => (
          <button
            key={setKey}
            onClick={() => setActiveTab(setKey)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === setKey
                ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <span>Manage {setKey === 'setA' ? 'Set A' : 'Set B'}</span>
          </button>
        ))}
      </div>

      {activeTab === 'leaderboard' && (
        <div className="bg-slate-900/80 backdrop-blur-2xl border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="relative flex-1 max-w-xs">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search student or roll/email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 text-slate-200 text-xs rounded-xl py-2.5 pl-9 pr-4 outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <button onClick={handleExportCSV} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 font-semibold text-xs transition-colors">
                <Download className="w-4 h-4" />
                <span>Export CSV</span>
              </button>
              <button onClick={handleClearAllResults} disabled={results.length === 0} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 font-semibold text-xs transition-colors disabled:opacity-40">
                <Trash2 className="w-4 h-4" />
                <span>Clear All</span>
              </button>
            </div>
          </div>

          {filteredResults.length === 0 ? (
            <div className="py-12 text-center bg-slate-950/60 rounded-2xl border border-slate-800/80">
              <Users className="w-10 h-10 text-slate-600 mx-auto mb-2" />
              <p className="text-slate-300 text-sm font-semibold">No student submissions recorded yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/60">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-900/90 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                    <th className="py-3.5 px-4">Student Name</th>
                    <th className="py-3.5 px-4">College Email ID</th>
                    <th className="py-3.5 px-4">Set</th>
                    <th className="py-3.5 px-4">Score</th>
                    <th className="py-3.5 px-4">Accuracy</th>
                    <th className="py-3.5 px-4">Time</th>
                    <th className="py-3.5 px-4">Submitted</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-200">
                  {filteredResults.map((r, i) => (
                    <tr key={r.id || i} className="hover:bg-slate-900/50 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-white">
                        <span className="inline-flex mr-2 w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-300 items-center justify-center text-[10px] font-mono">{i + 1}</span>
                        {r.name}
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 font-mono">{r.email}</td>
                      <td className="py-3.5 px-4">{r.set === 'setA' ? 'Set A' : 'Set B'}</td>
                      <td className="py-3.5 px-4 font-bold text-white">{r.score} <span className="text-slate-500 font-normal">/ {r.total}</span></td>
                      <td className="py-3.5 px-4">
                        <span className={`font-bold ${r.percentage >= 80 ? 'text-emerald-400' : r.percentage >= 60 ? 'text-indigo-400' : 'text-rose-400'}`}>
                          {r.percentage}%
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 font-mono">{formatTime(r.timeSeconds)}</td>
                      <td className="py-3.5 px-4 text-slate-500">{new Date(r.submittedAt || r.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center gap-1.5 justify-end">
                          <button onClick={() => handleClearSingleAttempt(r.email, r.set)} className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-medium transition-colors whitespace-nowrap">
                            Allow Retake
                          </button>
                          <button onClick={() => handleDeleteReport(r.id, r.email)} className="px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[11px] font-medium transition-colors whitespace-nowrap flex items-center gap-1">
                            <Trash2 className="w-3 h-3" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {(activeTab === 'setA' || activeTab === 'setB') && (
        <div className="bg-slate-900/80 backdrop-blur-2xl border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">{activeTab === 'setA' ? 'Set A' : 'Set B'} Questions and Answer Keys</h3>
              <p className="text-xs text-slate-400">These answers stay server-side and are never sent to student quiz screens.</p>
            </div>

            <button onClick={() => handleOpenAddQuestion(activeTab)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 transition-all">
              <Plus className="w-4 h-4" />
              <span>Add Question</span>
            </button>
          </div>

          <div className="space-y-3">
            {(questionsObj[activeTab] || []).map((q, idx) => (
              <div key={q.id} className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-slate-700 transition-colors">
                <div className="flex items-start gap-3 flex-1">
                  <span className="w-7 h-7 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs flex items-center justify-center shrink-0 border border-slate-700">{idx + 1}</span>
                  <div>
                    <h4 className="text-sm font-semibold text-white mb-1">{q.text}</h4>
                    <div className="flex flex-wrap items-center gap-3 text-xs">
                      <span className="text-emerald-400 font-bold font-mono bg-emerald-950/40 border border-emerald-500/30 px-2.5 py-0.5 rounded-md flex items-center gap-1">
                        <Key className="w-3 h-3" /> Answer Key: {q.answer}
                      </span>
                      <span className="text-slate-400 italic">Explanation: {q.explanation}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center">
                  <button onClick={() => handleOpenEditQuestion(activeTab, q)} className="p-2 rounded-lg bg-slate-800 hover:bg-indigo-600/20 text-slate-300 hover:text-indigo-300 border border-slate-700 transition-colors" title="Edit question">
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleDeleteQuestion(activeTab, q.id)} className="p-2 rounded-lg bg-slate-800 hover:bg-rose-600/20 text-slate-300 hover:text-rose-300 border border-slate-700 transition-colors" title="Delete question">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {editingQuestion && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">
                {isAdding ? 'Add Question' : 'Edit Question'} ({editingQuestion.setKey === 'setA' ? 'Set A' : 'Set B'})
              </h3>
              <button onClick={() => setEditingQuestion(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveQuestion} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Question Prompt</label>
                <input type="text" required value={qText} onChange={(e) => setQText(e.target.value)} className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 text-slate-200 text-xs rounded-xl p-3 outline-none" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Expected Answer Key</label>
                <input type="text" required value={qAnswer} onChange={(e) => setQAnswer(e.target.value)} className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 text-emerald-300 font-mono text-xs font-bold rounded-xl p-3 outline-none" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Explanation</label>
                <textarea rows={3} value={qExplanation} onChange={(e) => setQExplanation(e.target.value)} className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 text-slate-200 text-xs rounded-xl p-3 outline-none" />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button type="button" onClick={() => setEditingQuestion(null)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg">Save Question Key</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
