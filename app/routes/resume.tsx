import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import ATS from '~/components/ATS'
import Details from '~/components/Details'
import Summary from '~/components/Summary'
import { usePuterStore } from '~/lib/puter'

export const meta = () => [{
  title: "CVAI | Review",
  name: "description", content: "Detailed Overview of your resume - CVAI",
}]

const Resume = () => {
  const {auth, isLoading, fs, kv, puterReady} = usePuterStore();
  const { id } = useParams();
  const [imageUrl, setImageUrl] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(()=> {
    if(!isLoading && !auth.isAuthenticated) navigate(`/auth?next=/resume/${id}`);
    }, [isLoading]);

  useEffect(() => {
    if (!puterReady) return;

    let imgObjectUrl: string | null = null;
    let pdfObjectUrl: string | null = null;

    const loadResume = async () => {
      try {
        const resume = await kv.get(`resume:${id}`);
        if (!resume) { 
            console.error('No resume found for', id);
            setErrorStatus('No resume analysis found for this ID.');
            return; 
        }

        const data = JSON.parse(resume);

        try {
            const resumeBlob = await fs.read(data.resumePath);
            if (resumeBlob) {
                const pdfBlob = new Blob([resumeBlob], { type: 'application/pdf' });
                pdfObjectUrl = URL.createObjectURL(pdfBlob);
                setResumeUrl(pdfObjectUrl);
            } else {
                console.error('Failed to read resume blob:', data.resumePath);
            }
        } catch (e) {
            console.error('Error reading resume blob:', e);
        }

        try {
            const imageBlob = await fs.read(data.imagePath);
            if (imageBlob) {
                imgObjectUrl = URL.createObjectURL(imageBlob);
                setImageUrl(imgObjectUrl);
            } else {
                console.error('Failed to read image blob:', data.imagePath);
            }
        } catch (e) {
            console.error('Error reading image blob:', e);
        }

        if (data.feedback && data.feedback !== '') {
            setFeedback(data.feedback);
        } else {
            console.error('No feedback found in data:', data);
            setErrorStatus('Analysis incomplete or corrupted. Please re-upload.');
        }
        
        console.log({ resumeUrl: pdfObjectUrl, imageUrl: imgObjectUrl, feedback: data.feedback });
      } catch (err) {
        console.error('Error loading resume:', err);
        setErrorStatus('Error loading resume data.');
      }
    };

    loadResume();

    return () => {
      if (pdfObjectUrl) URL.revokeObjectURL(pdfObjectUrl);
      if (imgObjectUrl) URL.revokeObjectURL(imgObjectUrl);
    };
  }, [id, fs, kv, puterReady]);

  const downloadPDF = () => {
    if (!feedback) return;

    const scoreColor = (s: number) => s >= 70 ? '#34d399' : s >= 50 ? '#fbbf24' : '#f87171';

    const renderTips = (tips: { type: string; tip: string; explanation?: string }[]) =>
      tips.map(t => `
        <div style="display:flex;gap:10px;padding:10px 14px;border-radius:10px;margin-bottom:8px;background:${t.type === 'good' ? 'rgba(52,211,153,0.08)' : 'rgba(251,191,36,0.08)'};border:1px solid ${t.type === 'good' ? 'rgba(52,211,153,0.3)' : 'rgba(251,191,36,0.3)'}">
          <span style="font-size:14px">${t.type === 'good' ? '✅' : '⚠️'}</span>
          <div>
            <p style="margin:0;font-weight:600;color:${t.type === 'good' ? '#34d399' : '#fbbf24'};font-size:13px">${t.tip}</p>
            ${t.explanation ? `<p style="margin:4px 0 0;color:#9ca3af;font-size:12px">${t.explanation}</p>` : ''}
          </div>
        </div>`).join('');

    const renderSection = (title: string, score: number, tips: any[]) => `
      <div style="margin-bottom:28px">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:14px;padding-bottom:10px;border-bottom:1px solid rgba(255,255,255,0.08)">
          <h3 style="margin:0;font-size:16px;color:#fff">${title}</h3>
          <span style="font-size:13px;font-weight:700;color:${scoreColor(score)}">${score}/100</span>
        </div>
        ${renderTips(tips)}
      </div>`;

    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <title>CVIQ Resume Analysis Report</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; print-color-adjust: exact; -webkit-print-color-adjust: exact; }
    body { font-family: 'Inter', sans-serif; background: #0a0a0b !important; color: #fff; padding: 40px; max-width: 860px; margin: 0 auto; }
    @media print { 
      body { padding: 20px; background: #0a0a0b !important; } 
      @page { margin: 10mm; background: #0a0a0b; }
    }
  </style>
</head>
<body>
  <!-- Header -->
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:40px;padding-bottom:20px;border-bottom:1px solid rgba(255,255,255,0.1)">
    <div>
      <h1 style="font-size:28px;font-weight:900;background:linear-gradient(135deg,#00f0ff,#7000ff);-webkit-background-clip:text;-webkit-text-fill-color:transparent">CVIQ</h1>
      <p style="color:#6b7280;font-size:13px;margin-top:4px">AI Resume Analysis Report</p>
    </div>
    <div style="text-align:right">
      <p style="color:#4b5563;font-size:12px">Generated ${new Date().toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' })}</p>
    </div>
  </div>

  <!-- Overall Score -->
  <div style="background:linear-gradient(135deg,rgba(112,0,255,0.15),rgba(0,240,255,0.1));border:1px solid rgba(255,255,255,0.1);border-radius:20px;padding:28px;margin-bottom:32px;display:flex;align-items:center;gap:24px">
    <div style="text-align:center;min-width:100px">
      <p style="font-size:56px;font-weight:900;color:${scoreColor(feedback.overallScore)};line-height:1">${feedback.overallScore}</p>
      <p style="font-size:13px;color:#6b7280;margin-top:4px">Overall Score</p>
    </div>
    <div>
      <h2 style="font-size:20px;font-weight:700">Your Resume Score</h2>
      <p style="color:#6b7280;font-size:14px;margin-top:6px">This score reflects your resume's performance across ATS compatibility, tone, content, structure and skills.</p>
      <div style="display:flex;flex-wrap:wrap;gap:12px;margin-top:14px">
        ${[
          ['Tone & Style', feedback.toneAndStyle?.score],
          ['Content', feedback.content?.score],
          ['Structure', feedback.structure?.score],
          ['Skills', feedback.skills?.score],
        ].map(([label, score]) => `<span style="padding:4px 12px;border-radius:999px;font-size:12px;font-weight:600;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);color:${scoreColor(Number(score))}">${label}: ${score}/100</span>`).join('')}
      </div>
    </div>
  </div>

  <!-- ATS Section -->
  <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:24px;margin-bottom:28px">
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px">
      <h2 style="font-size:18px;font-weight:700">ATS Score</h2>
      <span style="font-size:20px;font-weight:900;color:${scoreColor(feedback.ATS?.score || 0)}">${feedback.ATS?.score || 0}/100</span>
    </div>
    <p style="color:#6b7280;font-size:13px;margin-bottom:16px">How well your resume performs in Applicant Tracking Systems used by employers.</p>
    ${feedback.ATS?.tips ? renderTips(feedback.ATS.tips) : ''}
  </div>

  <!-- Detailed Sections -->
  <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:24px">
    <h2 style="font-size:18px;font-weight:700;margin-bottom:24px">Detailed Breakdown</h2>
    ${renderSection('Tone & Style', feedback.toneAndStyle?.score, feedback.toneAndStyle?.tips || [])}
    ${renderSection('Content Quality', feedback.content?.score, feedback.content?.tips || [])}
    ${renderSection('Structure & Formatting', feedback.structure?.score, feedback.structure?.tips || [])}
    ${renderSection('Skills', feedback.skills?.score, feedback.skills?.tips || [])}
  </div>

  <!-- Footer -->
  <p style="text-align:center;color:#374151;font-size:11px;margin-top:32px">Generated by CVIQ · AI-Powered Resume Analysis · cviq.app</p>
</body></html>`;

    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(html);
    win.document.close();
    setTimeout(() => { win.print(); }, 500);
  };

  return (
    <main className='!pt-0 bg-dark-100 min-h-screen relative overflow-hidden text-white'>
        {/* Subtle ambient glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-neon-cyan/5 rounded-full blur-[150px] pointer-events-none z-0"></div>
        <nav className='resume-nav relative z-10'>
            <Link to='/' className='back-button'>
                <img src="/icons/back.svg" alt="logo" className='w-2.5 h-2.5 invert opacity-70' />
                <span className='text-gray-200 text-sm font-semibold'>Back to Homepage</span>
            </Link>

            {/* PDF Export Button — only shown when analysis is ready */}
            {feedback && (
              <button
                onClick={downloadPDF}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(112,0,255,0.4)] hover:shadow-[0_0_30px_rgba(112,0,255,0.7)]"
                style={{ background: 'linear-gradient(135deg, #7000ff, #00f0ff)' }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Export PDF
              </button>
            )}
        </nav>
        <div className='flex flex-row w-full max-lg:flex-col-reverse relative z-10'>
            <section className='preview-section sticky top-0'>
                {imageUrl ? (
                    <div className='animate-in fade-in duration-1000 glass-panel max-sm:m-0 w-full max-h-[86vh] flex items-start justify-center p-2 rounded-2xl'>
                        <a href={resumeUrl} target='_blank' rel='noopener noreferrer' className='w-full h-full flex items-start justify-center'>
                            <img
                                src={imageUrl}
                                alt='Resume preview'
                                className='w-full max-h-[86vh] object-contain rounded-xl'
                                title='resume'
                            />
                        </a>
                    </div>
                ) : (
                    <div className='flex items-center justify-center h-full'>
                        <p className='text-gray-400'>
                            {errorStatus ? 'Image preview unavailable' : 'Loading image...'}
                        </p>
                    </div>
                )}
            </section>
            <section className='feedback-section'>
                <h2 className='text-3xl font-display font-bold text-white mb-4'>Resume Review</h2>
                {errorStatus ? (
                    <div className='glass-panel bg-red-900/20 border border-red-500/30 p-8 rounded-3xl w-full text-center'>
                        <p className='text-red-400 text-lg'>{errorStatus}</p>
                        <Link to="/upload" className="inline-block mt-4 bg-dark-300 px-6 py-2 rounded-xl text-white hover:bg-dark-200 transition">Upload New Resume</Link>
                    </div>
                ) : feedback ? (
                    <div className='flex flex-col gap-8 animate-in fade-in duration-1000'>
                        <Summary feedback={feedback}/>
                        <ATS score={feedback.ATS?.score || 0} suggestions ={feedback.ATS.tips || []}/>
                        <Details feedback={feedback} />
                    </div>
                ) : (
                    <img src="/images/resume-scan-2.gif" className='w-full rounded-2xl mix-blend-screen opacity-80'/>
                )}
            </section>
        </div>
    </main>
  )
}

export default Resume