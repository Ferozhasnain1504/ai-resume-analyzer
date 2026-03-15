import { Link } from 'react-router';
import ScoreCircle from '~/components/ScoreCircle';
import { useEffect, useState } from 'react';
import { usePuterStore } from '~/lib/puter';

const ResumeCard = ({resume : {id,companyName, jobTitle, feedback, imagePath  }} : {resume : Resume}) => { // destructuring the resume as props and type of resume is Resume
  const {fs, puterReady} = usePuterStore();
  const [resumeUrl, setResumeUrl] = useState('');
  useEffect( () => {
      if(!puterReady) return;
      
      const loadResume = async () => { 
        try {
          const blob = await fs.read(imagePath);
          if(!blob) return;
          let url = URL.createObjectURL(blob);
          setResumeUrl(url);
        } catch(e) {
          console.error("Failed to load image preview on card", e);
        }
      }
      loadResume();
    }, [imagePath, fs, puterReady]);
  return (
    <Link to={`/resume/${id}`} className='resume-card animate-in fade-in duration-1000 group'>
        <div className="resume-card-header mb-4 relative z-10 font-sans">
            <div className='flex flex-col gap-2'>
                {companyName && <h2 className='text-white font-bold break-words tracking-wide group-hover:text-neon-cyan transition-colors text-xl'>{companyName}</h2>}
                {jobTitle && <h3 className='text-md break-words text-gray-400 font-light'>{jobTitle}</h3>}
                {!companyName && !jobTitle && <h2 className='text-white font-bold tracking-wide group-hover:text-neon-cyan transition-colors text-xl'>Resume</h2>}
            </div>
            {/* Score Circle */}
            <div className='flex-shrink-0 bg-dark-200/50 p-2 rounded-full border border-white/5 backdrop-blur-md shadow-[0_0_15px_rgba(112,0,255,0.2)] group-hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all'>
                <ScoreCircle score = {feedback.overallScore} />
            </div>
        </div>

        {resumeUrl && (
          <div className="gradient-border animate-in fade-in duration-1000 relative overflow-hidden group-hover:border-neon-cyan/40 transition-colors">
            {/* Subtle glow behind the image */}
            <div className="absolute inset-0 bg-gradient-to-t from-dark-200 via-transparent to-transparent z-10 pointer-events-none"></div>
            
            <div className="w-full h-full relative z-0">
              <img 
                src={resumeUrl}
                alt="resume preview"
                className='w-full h-[350px] max-sm:h-[200px] object-cover object-top opacity-90 group-hover:opacity-100 transition-opacity filter group-hover:brightness-110'
              />
            </div>
        </div>)}
    </Link>
  )
}

export default ResumeCard