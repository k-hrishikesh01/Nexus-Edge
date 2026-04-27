import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AlertCircle, CheckCircle, Flame, Server, Activity, Briefcase } from 'lucide-react';

function App() {
  const [profile, setProfile] = useState({
    name: "",
    rollNumber: "",
    branch: "CS",
    year: 1,
    currentCgpa: 0,
    totalSubjects: 1
  });

  const [subjects, setSubjects] = useState([
    { id: uuidv4(), subjectName: "", previousMarks: 0, targetStudyHours: 0 }
  ]);

  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // LOGIC RULE: Adjust subjects array when totalSubjects changes
  useEffect(() => {
    setSubjects(prev => {
      const diff = profile.totalSubjects - prev.length;
      if (diff > 0) {
        // Append new empty objects
        const newSubjects = Array.from({ length: diff }).map(() => ({
          id: uuidv4(), subjectName: "", previousMarks: 0, targetStudyHours: 0
        }));
        return [...prev, ...newSubjects];
      } else if (diff < 0) {
        // Truncate array, preserving the first n elements
        return prev.slice(0, profile.totalSubjects);
      }
      return prev;
    });
  }, [profile.totalSubjects]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: name === 'year' || name === 'totalSubjects' ? parseInt(value) || 0 
              : name === 'currentCgpa' ? parseFloat(value) || 0 
              : value
    }));
  };

  const handleSubjectChange = (id, field, value) => {
    setSubjects(prev => prev.map(sub => {
      if (sub.id === id) {
        return { 
          ...sub, 
          [field]: field === 'subjectName' ? value : parseFloat(value) || 0 
        };
      }
      return sub;
    }));
  };

  const handlePredict = async () => {
    setIsLoading(true);
    setError(null);
    setResults(null);

    const payload = {
      student_name: profile.name,
      roll_number: profile.rollNumber,
      branch: profile.branch,
      year: profile.year,
      current_cgpa: profile.currentCgpa,
      subjects: subjects.map(s => ({
        subject_name: s.subjectName || "Unnamed Subject",
        previous_marks: s.previousMarks,
        target_study_hours: s.targetStudyHours
      }))
    };

    try {
      const response = await axios.post('https://nexus-edge-pjrm.onrender.com', payload);
      setResults(response.data.results);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "An error occurred while communicating with the AI Engine. Is the FastAPI server running on port 8000?");
    } finally {
      setIsLoading(false);
    }
  };

  const getRiskStyles = (category) => {
    switch (category) {
      case "Critical": return "border-red-500 bg-red-500/10 text-red-400";
      case "Needs Improvement": return "border-orange-500 bg-orange-500/10 text-orange-400";
      case "Good but can do better": return "border-blue-500 bg-blue-500/10 text-blue-400";
      case "No problem zone": return "border-emerald-500 bg-emerald-500/10 text-emerald-400";
      default: return "border-gray-500 bg-gray-500/10 text-gray-400";
    }
  };

  const getRiskIcon = (category) => {
    switch (category) {
      case "Critical": return <AlertCircle className="w-6 h-6 text-red-400" />;
      case "Needs Improvement": return <Activity className="w-6 h-6 text-orange-400" />;
      case "Good but can do better": return <Briefcase className="w-6 h-6 text-blue-400" />;
      case "No problem zone": return <CheckCircle className="w-6 h-6 text-emerald-400" />;
      default: return null;
    }
  };

  // Prepare chart data format
  const chartData = results?.map(res => {
    const originalSub = subjects.find(s => s.subjectName === res.subject_name || (res.subject_name === "Unnamed Subject" && s.subjectName === ""));
    return {
      name: res.subject_name.substring(0, 10), // Truncate long names for chart
      full_name: res.subject_name,
      previous_marks: originalSub ? originalSub.previousMarks : 0,
      predicted_marks: res.predicted_marks
    };
  });

  return (
    <div className="bg-slate-950 text-white min-h-screen font-sans p-4 md:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8 flex justify-between items-center bg-white/5 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
            <Server className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Nexus Edge AI</h1>
            <p className="text-sm text-slate-400 font-medium">Enterprise Marks Prediction System</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Component 1: Profile Panel (Left Sidebar) */}
        <div className="md:col-span-4 flex flex-col gap-6">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl p-6">
            <h2 className="text-xl font-bold mb-6 border-b border-white/10 pb-2 flex items-center gap-2">
               User Profile
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Student Name</label>
                <input 
                  type="text" name="name" value={profile.name} onChange={handleProfileChange}
                  className="w-full bg-slate-900/50 border border-white/10 rounded-md p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                  placeholder="e.g. Alex Mercer"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Roll Number</label>
                  <input 
                    type="text" name="rollNumber" value={profile.rollNumber} onChange={handleProfileChange}
                    className="w-full bg-slate-900/50 border border-white/10 rounded-md p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    placeholder="e.g. CS2024-001"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Branch</label>
                  <select 
                    name="branch" value={profile.branch} onChange={handleProfileChange}
                    className="w-full bg-slate-900/50 border border-white/10 rounded-md p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  >
                    <option value="CS">Computer Science</option>
                    <option value="IT">Information Tech</option>
                    <option value="EC">Electronics</option>
                    <option value="ME">Mechanical</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Year</label>
                  <input 
                    type="number" name="year" value={profile.year} onChange={handleProfileChange} min="1" max="4"
                    className="w-full bg-slate-900/50 border border-white/10 rounded-md p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Current CGPA</label>
                  <input 
                    type="number" name="currentCgpa" value={profile.currentCgpa} onChange={handleProfileChange} step="0.1" min="0" max="10"
                    className="w-full bg-slate-900/50 border border-white/10 rounded-md p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-slate-300">Total Subjects</label>
                  <span className="bg-indigo-500/20 text-indigo-300 font-bold px-3 py-1 rounded-full text-xs">
                    {profile.totalSubjects}
                  </span>
                </div>
                <input 
                  type="range" name="totalSubjects" value={profile.totalSubjects} onChange={handleProfileChange}
                  min="1" max="10" 
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Component 2: Dynamic Subject Grid (Right Main Area) */}
        <div className="md:col-span-8 flex flex-col gap-6">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl p-6">
            <h2 className="text-xl font-bold mb-6 border-b border-white/10 pb-2 flex items-center justify-between">
              <span>Academic Data Stream</span>
              <Activity className="text-indigo-400 w-5 h-5" />
            </h2>
            
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {subjects.map((sub, index) => (
                <div key={sub.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-slate-900/40 p-4 rounded-lg border border-white/5 hover:border-indigo-500/30 transition-colors">
                  <div className="md:col-span-1 flex items-center justify-center font-bold text-slate-500">
                    #{index + 1}
                  </div>
                  <div className="md:col-span-5">
                    <label className="block text-xs font-medium text-slate-400 mb-1 uppercase tracking-widest">Subject Name</label>
                    <input 
                      type="text" value={sub.subjectName} 
                      onChange={(e) => handleSubjectChange(sub.id, 'subjectName', e.target.value)}
                      className="w-full bg-slate-800/80 border border-white/5 rounded-md p-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all"
                      placeholder="e.g. Data Structures"
                    />
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-xs font-medium text-slate-400 mb-1 uppercase tracking-widest">Prev. Marks (0-100)</label>
                    <input 
                      type="number" value={sub.previousMarks} 
                      onChange={(e) => handleSubjectChange(sub.id, 'previousMarks', e.target.value)} min="0" max="100"
                      className="w-full bg-slate-800/80 border border-white/5 rounded-md p-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all"
                    />
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-xs font-medium text-slate-400 mb-1 uppercase tracking-widest">Target Hours (0-40)</label>
                    <input 
                      type="number" value={sub.targetStudyHours} 
                      onChange={(e) => handleSubjectChange(sub.id, 'targetStudyHours', e.target.value)} min="0" max="40"
                      className="w-full bg-slate-800/80 border border-white/5 rounded-md p-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all"
                    />
                  </div>
                </div>
              ))}
            </div>

            {error && (
              <div className="mt-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm flex items-center gap-3">
                <AlertCircle className="shrink-0 w-5 h-5" />
                <p>{error}</p>
              </div>
            )}

            <div className="mt-8">
              <button 
                onClick={handlePredict}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-lg font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_30px_rgba(99,102,241,0.6)] transition-all flex justify-center items-center gap-3"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing AI Inference...
                  </>
                ) : (
                  <>
                    <Flame className="w-6 h-6" />
                    Run AI Prediction Model
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Component 3: Results & Visualization */}
      {results && (
        <div className="max-w-7xl mx-auto mt-8 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl p-8 mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="mb-8 border-b border-white/10 pb-6">
            <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">Inference Analysis Overview</h2>
            <p className="text-slate-400 mt-2 font-medium">Predicted trajectories based on historical performance and resource allocation.</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Visual 1: Chart */}
            <div className="bg-slate-900/60 p-6 rounded-xl border border-white/5">
              <h3 className="text-lg font-bold mb-6 text-slate-200">Performance Delta Visualization</h3>
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={12} domain={[0, 100]} tickLine={false} axisLine={false} />
                    <Tooltip 
                      cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                      contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                    <Bar dataKey="previous_marks" name="Previous Marks" fill="#64748b" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="predicted_marks" name="Predicted Marks" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Visual 2: Status Cards */}
            <div>
              <h3 className="text-lg font-bold mb-6 text-slate-200">Subject Risk Assessment</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {results.map((res, i) => (
                  <div key={i} className={`p-5 rounded-xl border backdrop-blur-sm transition-all hover:scale-[1.02] ${getRiskStyles(res.risk_category)}`}>
                    <div className="flex justify-between items-start mb-3">
                      <div className="font-semibold text-lg truncate max-w-[80%]" title={res.subject_name}>
                        {res.subject_name}
                      </div>
                      {getRiskIcon(res.risk_category)}
                    </div>
                    <div className="flex items-end gap-2 mb-3">
                      <span className="text-3xl font-black">{res.predicted_marks.toFixed(1)}</span>
                      <span className="text-sm pb-1 opacity-70">/ 100</span>
                    </div>
                    <div className="inline-block px-3 py-1 bg-black/20 rounded-full text-xs font-bold tracking-wide uppercase">
                      {res.risk_category}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}} />
    </div>
  );
}

export default App;
