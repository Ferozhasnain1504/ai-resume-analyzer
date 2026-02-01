import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import ATS from '~/components/ATS'
import Details from '~/components/Details'
import Summary from '~/components/Summary'
import { usePuterStore } from '~/lib/puter'

export const meta = () => {[
  { title: "CVAI | Review" },
  {name : "description", content: "Detailed Overview of your resume - CVAI" },
]}

const Resume = () => {
  const {auth, isLoading, fs, kv} = usePuterStore();
  const { id } = useParams();
  const [imageUrl, setImageUrl] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const navigate = useNavigate();

  useEffect(()=> {
    if(!isLoading && !auth.isAuthenticated) navigate(`/auth?next=/resume/${id}`);
    }, [isLoading]);

  useEffect(() => {
    let imgObjectUrl: string | null = null;
    let pdfObjectUrl: string | null = null;

    const loadResume = async () => {
      try {
        const resume = await kv.get(`resume:${id}`);
        if (!resume) { console.error('No resume found for', id); return; }

        const data = JSON.parse(resume);

        const resumeBlob = await fs.read(data.resumePath);
        if (resumeBlob) {
          const pdfBlob = new Blob([resumeBlob], { type: 'application/pdf' });
          pdfObjectUrl = URL.createObjectURL(pdfBlob);
          setResumeUrl(pdfObjectUrl);
        } else {
          console.error('Failed to read resume blob:', data.resumePath);
        }

        const imageBlob = await fs.read(data.imagePath);
        if (imageBlob) {
          imgObjectUrl = URL.createObjectURL(imageBlob);
          setImageUrl(imgObjectUrl);
        } else {
          console.error('Failed to read image blob:', data.imagePath);
        }

        setFeedback(data.feedback);
        console.log({ resumeUrl: pdfObjectUrl, imageUrl: imgObjectUrl, feedback: data.feedback });
      } catch (err) {
        console.error('Error loading resume:', err);
      }
    };

    loadResume();

    return () => {
      if (pdfObjectUrl) URL.revokeObjectURL(pdfObjectUrl);
      if (imgObjectUrl) URL.revokeObjectURL(imgObjectUrl);
    };
  }, [id, fs, kv]);
  return (
    <main className='!pt-0'>
        <nav className='resume-nav'>
            <Link to='/' className='back-button'>
                <img src="/icons/back.svg" alt="logo" className='w-2.5 h-2.5' />
                <span className='text-gray-800 text-sm font-semibold'>Back to Homepage</span>
            </Link>
        </nav>
        <div className='flex flex-row w-full max-lg:flex-col-reverse'>
            <section className='preview-section bg-[url("/images/bg-small.svg")] bg-cover sticky top-0'>
                {imageUrl ? (
                    <div className='animate-in fade-in duration-1000 gradient-border max-sm:m-0 w-full max-h-[86vh] flex items-start justify-center p-2'>
                        <a href={resumeUrl} target='_blank' rel='noopener noreferrer' className='w-full h-full flex items-start justify-center'>
                            <img
                                src={imageUrl}
                                alt='Resume preview'
                                className='w-full max-h-[86vh] object-contain rounded-2xl shadow-lg'
                                title='resume'
                            />
                        </a>
                    </div>
                ) : (
                    <p className='text-gray-500'>No resume image available</p>
                )}
            </section>
            <section className='feedback-section'>
                <h2 className='text-3xl !text-black font-bold'>Resume Review</h2>
                {feedback ? (
                    <div className='flex flex-col gap-8 animate-in fade-in duration-1000'>
                        <Summary feedback={feedback}/>
                        <ATS score={feedback.ATS?.score || 0} suggestions ={feedback.ATS.tips || []}/>
                        <Details feedback={feedback} />
                    </div>
                ) : (
                    <img src="/images/resume-scan-2.gif" className='w-full'/>
                )}
            </section>
        </div>
    </main>
  )
}

export default Resume