import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Clock, Target, Award, ChevronDown, ChevronUp, CheckCircle, XCircle, RotateCcw, Shield } from 'lucide-react';

export default function ResultsView({ result, onRetake, onSwitchToAdmin }) {
  const [showReview, setShowReview] = useState(false);

  useEffect(() => {
    if (result.percentage >= 70) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [result]);

  const getFeedback = (percentage) => {
    if (percentage >= 90) {
      return {
        title: 'Master Pattern Decoder',
        desc: 'Outstanding logical reasoning and flawless numerical series recognition!',
        color: 'from-amber-400 to-yellow-500',
        badge: 'Top Tier (Elite 5%)',
      };
    }
    if (percentage >= 75) {
      return {
        title: 'Logic Specialist',
        desc: 'Strong analytical accuracy and sharp mathematical series deduction!',
        color: 'from-emerald-400 to-teal-500',
        badge: 'High Proficiency',
      };
    }
    if (percentage >= 50) {
      return {
        title: 'Aptitude Competitor',
        desc: 'Solid overall performance with good fundamental sequence grasp.',
        color: 'from-indigo-400 to-cyan-500',
        badge: 'Competent',
      };
    }
    return {
      title: 'Aptitude Learner',
      desc: 'Keep practicing pattern progressions, differences, and polynomial sequences!',
      color: 'from-rose-400 to-pink-500',
      badge: 'Needs Practice',
    };
  };

  const feedback = getFeedback(result.percentage);

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}m ${s}s`;
  };

  return (
    <div className="w-full max-w-3xl mx-auto my-8 px-4 relative z-10 animate-fadeIn">
      <div className="bg-slate-900/80 backdrop-blur-2xl border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl overflow-hidden relative">
        
        {/* Top Celebration Banner */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 p-0.5 mx-auto mb-4 shadow-xl shadow-indigo-500/30">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Trophy className="w-8 h-8 text-amber-400 animate-bounce" />
            </div>
          </div>

          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2">
            Quiz Completed!
          </h2>
          <p className="text-sm text-slate-400">
            Congratulations <span className="text-indigo-300 font-semibold">{result.name}</span>! Here is your performance breakdown for{' '}
            <span className="text-cyan-300 font-bold">Set {result.set === 'setA' ? 'A' : result.set === 'setB' ? 'B' : 'Custom'}</span>.
          </p>
        </div>

        {/* Feedback Card */}
        <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-semibold mb-2 inline-block">
              {feedback.badge}
            </span>
            <h3 className="text-lg font-bold text-white mb-1">{feedback.title}</h3>
            <p className="text-xs text-slate-400">{feedback.desc}</p>
          </div>
          <div className="text-center sm:text-right shrink-0">
            <div className="text-4xl font-black bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
              {result.percentage}%
            </div>
            <span className="text-xs text-slate-500">Overall Accuracy</span>
          </div>
        </div>

        {/* Performance Metric Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 text-center">
            <Target className="w-5 h-5 text-indigo-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white mb-0.5">
              {result.score} <span className="text-sm text-slate-500">/ {result.total}</span>
            </div>
            <div className="text-xs text-slate-400">Correct Answers</div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 text-center">
            <Award className="w-5 h-5 text-purple-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white mb-0.5">{result.percentage}%</div>
            <div className="text-xs text-slate-400">Score Percentage</div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 text-center">
            <Clock className="w-5 h-5 text-cyan-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white mb-0.5">{formatTime(result.timeSeconds)}</div>
            <div className="text-xs text-slate-400">Completion Time</div>
          </div>
        </div>

        {/* Detailed Question Review Toggle */}
        <div className="mb-8 border border-slate-800 rounded-2xl overflow-hidden bg-slate-950/40">
          <button
            onClick={() => setShowReview(!showReview)}
            className="w-full p-4 text-left flex items-center justify-between font-semibold text-sm text-slate-200 hover:bg-slate-900/60 transition-colors"
          >
            <span>Review Answer Key & Step-by-Step Explanations</span>
            {showReview ? (
              <ChevronUp className="w-4 h-4 text-indigo-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-indigo-400" />
            )}
          </button>

          {showReview && result.answers && (
            <div className="p-4 space-y-4 border-t border-slate-800/80 bg-slate-950/80 max-h-96 overflow-y-auto">
              {result.answers.map((item, index) => (
                <div
                  key={item.id}
                  className={`p-4 rounded-xl border text-xs space-y-2 ${
                    item.isCorrect
                      ? 'bg-emerald-950/20 border-emerald-500/30'
                      : 'bg-rose-950/20 border-rose-500/30'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 font-semibold text-sm">
                    <span className="text-slate-200">
                      Q{index + 1}. {item.questionText}
                    </span>
                    {item.isCorrect ? (
                      <span className="flex items-center gap-1 text-emerald-400 text-xs shrink-0 font-bold">
                        <CheckCircle className="w-3.5 h-3.5" /> Correct
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-rose-400 text-xs shrink-0 font-bold">
                        <XCircle className="w-3.5 h-3.5" /> Incorrect
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-4 text-xs pt-1">
                    <div>
                      <span className="text-slate-400">Your Answer: </span>
                      <span className={item.isCorrect ? 'text-emerald-300 font-bold' : 'text-rose-300 font-bold'}>
                        {item.userAnswer}
                      </span>
                    </div>
                    {!item.isCorrect && (
                      <div>
                        <span className="text-slate-400">Correct Answer: </span>
                        <span className="text-emerald-400 font-bold">{item.correctAnswer}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-800 text-slate-300 leading-relaxed italic">
                    💡 Explanation: {item.explanation}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={onRetake}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors border border-slate-700"
          >
            <RotateCcw className="w-4 h-4 text-indigo-400" />
            <span>Register New Attempt</span>
          </button>

          <button
            onClick={onSwitchToAdmin}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 transition-all"
          >
            <Shield className="w-4 h-4 text-indigo-300" />
            <span>View Live Leaderboard in Admin</span>
          </button>
        </div>
      </div>
    </div>
  );
}
