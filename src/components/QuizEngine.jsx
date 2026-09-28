import React, { useCallback, useEffect, useState } from 'react';
import { AlertTriangle, ArrowRight, Clock, Send } from 'lucide-react';
import { api } from '../services/api';

export default function QuizEngine({ user, onComplete }) {
  const [questions] = useState(user.questions || []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [answersMap, setAnswersMap] = useState({});
  const [remainingSeconds, setRemainingSeconds] = useState(() => {
    const expiresAt = new Date(user.expiresAt).getTime();
    return Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const currentQ = questions[currentIndex];

  useEffect(() => {
    const timer = setInterval(() => {
      const expiresAt = new Date(user.expiresAt).getTime();
      setRemainingSeconds(Math.max(0, Math.floor((expiresAt - Date.now()) / 1000)));
    }, 1000);
    return () => clearInterval(timer);
  }, [user.expiresAt]);

  const submitQuiz = useCallback(async (answers) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setSubmitError('');
    try {
      const result = await api.submitAttempt({
        attemptId: user.attemptId,
        email: user.user.email,
        set: user.set,
        answers,
      });
      onComplete(result);
    } catch (err) {
      setSubmitError(err.message);
      setIsSubmitting(false);
    }
  }, [isSubmitting, onComplete, user.attemptId, user.set, user.user.email]);

  useEffect(() => {
    if (remainingSeconds === 0 && !isSubmitting) {
      submitQuiz(answersMap);
    }
  }, [remainingSeconds, isSubmitting, answersMap, submitQuiz]);

  const handleSubmitAnswer = (e) => {
    if (e) e.preventDefault();
    if (!userInput.trim() || isAnswered || !currentQ) return;

    setIsAnswered(true);
    setAnswersMap((prev) => ({
      ...prev,
      [currentQ.id]: userInput.trim(),
    }));
  };

  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
      setUserInput('');
      setIsAnswered(false);
    } else {
      submitQuiz(answersMap);
    }
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  if (!questions || questions.length === 0) {
    return (
      <div className="w-full max-w-xl mx-auto my-12 text-center p-8 bg-slate-900/80 rounded-3xl border border-slate-800">
        <div className="w-8 h-8 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-slate-300 text-sm">Loading secure exam questions...</p>
      </div>
    );
  }

  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);

  return (
    <div className="w-full max-w-3xl mx-auto my-6 px-4 relative z-10 animate-fadeIn">
      {remainingSeconds === 0 && (
        <div className="mb-4 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Your time is up. Submitting your saved answers now.</span>
        </div>
      )}

      <div className="bg-slate-900/80 backdrop-blur-2xl border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-indigo-400 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20">
              Question {currentIndex + 1} of {questions.length}
            </span>
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
              Set {user.set === 'setA' ? 'A' : user.set === 'setB' ? 'B' : 'Custom'}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5 text-slate-300 bg-slate-950/60 px-3 py-1.5 rounded-xl border border-slate-800">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-mono font-bold text-cyan-300">{formatTime(remainingSeconds)}</span>
            </div>

            <div className="flex items-center gap-1.5 text-slate-300 bg-slate-950/60 px-3 py-1.5 rounded-xl border border-slate-800">
              <span className="text-slate-400">Answered:</span>
              <span className="font-bold text-emerald-400">{Object.keys(answersMap).length}</span>
            </div>
          </div>
        </div>

        <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden mb-8 border border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 transition-all duration-500 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="mb-8">
          <h3 className="text-lg md:text-xl font-bold text-white leading-relaxed mb-2">
            {currentQ.text}
          </h3>
          <p className="text-xs text-cyan-400/90 font-medium">
            Fill-in-the-Blank: Type your exact numeric or text answer below.
          </p>
        </div>

        <form onSubmit={handleSubmitAnswer} className="mb-8 space-y-4">
          <div className="relative">
            <input
              type="text"
              disabled={isAnswered || isSubmitting || remainingSeconds === 0}
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Enter answer"
              className={`w-full bg-slate-950/90 border text-lg md:text-xl font-bold rounded-2xl py-4 px-5 transition-all outline-none ${
                isAnswered
                  ? 'border-emerald-500/80 bg-emerald-950/30 text-emerald-200 ring-2 ring-emerald-500/30'
                  : 'border-indigo-500/50 focus:border-indigo-400 text-white focus:ring-2 focus:ring-indigo-500/20 placeholder:text-slate-600 placeholder:font-normal'
              }`}
            />

            {!isAnswered && (
              <button
                type="submit"
                disabled={!userInput.trim() || isSubmitting || remainingSeconds === 0}
                className={`absolute right-3 top-3 bottom-3 px-5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all ${
                  userInput.trim()
                    ? 'bg-gradient-to-r from-indigo-600 to-cyan-500 text-white shadow-lg shadow-indigo-600/30 hover:scale-105'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                <span>Save</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </form>

        {isAnswered && (
          <div className="mb-8 p-5 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 text-indigo-100 animate-slideUp space-y-3">
            <div className="font-bold text-xs text-indigo-300 uppercase tracking-wider">Answer Saved</div>
            <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-slate-400 block mb-0.5">Your Submission:</span>
              <span className="font-mono font-bold text-sm text-emerald-300">{userInput}</span>
            </div>
            <p className="text-sm text-slate-200 leading-relaxed font-sans pt-1">
              Correctness is calculated only after final submission.
            </p>
          </div>
        )}

        {submitError && (
          <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
            {submitError}
          </div>
        )}

        <div className="flex items-center justify-end">
          {isAnswered && (
            <button
              onClick={handleNext}
              disabled={isSubmitting}
              className="px-6 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white shadow-xl shadow-indigo-600/30 flex items-center gap-2 transition-all transform active:scale-95 disabled:opacity-60"
            >
              <span>{isSubmitting ? 'Submitting...' : currentIndex + 1 < questions.length ? 'Next Question' : 'Submit Final Answers'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
