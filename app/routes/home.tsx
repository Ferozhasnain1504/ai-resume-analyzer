import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import ResumeCard from "~/components/ResumeCard";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { usePuterStore } from "~/lib/puter";

// Declare custom element for TypeScript
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'spline-viewer': any;
    }
  }
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "CVIQ" },
    { name: "description", content: "Smarter insights. Sharper resumes" },
  ];
}

export default function Home() {
  const {auth, kv} = usePuterStore(); 
  const navigate = useNavigate();

  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(false);
  
  // Removed isolated Spline script injector
  useEffect(() => {
    if(!auth.isAuthenticated) navigate('/auth?next=/');
  }, [auth.isAuthenticated]);
  useEffect(() => {
    const loadingResumes = async () => {
      setLoadingResumes(true);

      const resumes = (await kv.list('resume:*', true)) as KVItem[];

      const parsedResume = resumes?.map((resume) => (
        JSON.parse(resume.value) as Resume
      ))

      console.log("parsedResumes", parsedResume);

      setResumes(parsedResume || []);
      setLoadingResumes(false);
    }
    loadingResumes();
  },[]);

  return (
    <main className="relative bg-transparent min-h-screen overflow-hidden">
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />

        <section className="flex-grow flex items-center min-h-[calc(100vh-80px)]">
          {/* Left column — centered on mobile, left-aligned on desktop */}
          <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start justify-center px-6 lg:pl-40 lg:pr-16 py-20 gap-8 relative">
            
            <div className="relative flex flex-col items-center lg:items-start gap-5 text-center lg:text-left">

              {/* Dark ambient glow behind text — no hard edges */}
              <div className="absolute -inset-10 -z-10 bg-black/60 blur-3xl rounded-full" />

              {/* Badge */}
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 backdrop-blur-md rounded-full px-4 py-1.5">
                <span className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse" />
                <span className="text-xs font-medium tracking-widest uppercase text-neon-cyan">AI-Powered Resume Analysis</span>
              </div>

              {/* Heading — smaller on mobile to avoid overflow */}
              <h1 className="text-white max-w-xl text-[2.6rem] sm:text-5xl lg:text-6xl xl:text-7xl font-semibold font-display leading-tight tracking-tight">
                Intelligence that <br className="hidden sm:block" />
                makes your <br/>
                <span className="font-serif italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan via-purple-300 to-neon-violet">
                  resumes viral
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-gray-400 text-base sm:text-lg max-w-sm lg:max-w-md font-light tracking-wide leading-relaxed">
                Instant AI feedback for Influencers, Creators and Professionals — get hired faster.
              </p>

              {/* CTA Button */}
              <div className="flex flex-col sm:flex-row items-center gap-4 mt-2">
                <Link
                  to="/upload"
                  className="group flex items-center gap-3 text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(112,0,255,0.5)] hover:shadow-[0_0_60px_rgba(112,0,255,0.8)]"
                  style={{ background: 'linear-gradient(135deg, #7000ff, #00f0ff)' }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-0.5 transition-transform"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                  Scan Your Resume
                </Link>
              </div>
            </div>
          </div>

          {/* Right column — transparent passthrough for 3D model */}
          <div className="hidden lg:block lg:w-1/2 h-full pointer-events-none" />
        </section>

        {/* Resume cards section */}
        <div className="w-full max-w-7xl mx-auto px-6 pb-24">
          {loadingResumes && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-12 h-12 border-4 border-neon-cyan border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          {!loadingResumes && resumes.length > 0 && (
            <div className="resumes-section mt-12 bg-dark-200/20 p-8 rounded-[40px] border border-white/5 backdrop-blur-xl">
              <h2 className="text-white w-full text-center mb-8 font-display text-2xl">Your Scanned Resumes</h2>
              <div className="flex flex-wrap gap-8 justify-center w-full">
                {resumes.map((resume) => (
                  <ResumeCard key={resume.id} resume={resume} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
