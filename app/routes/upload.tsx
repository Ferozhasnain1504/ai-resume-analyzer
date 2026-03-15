import React, { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router';
import FileUploader from '~/components/FileUploader';
import Navbar from '~/components/Navbar'
import { usePuterStore } from '~/lib/puter';
import { convertPdfToImage } from '~/lib/pdf2img';
import { generateUUID } from '~/lib/utils';
import { prepareInstructions } from '../../constants';

const Upload = () => {
  const { auth, isLoading, fs, ai, kv} = usePuterStore();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const handleFileSelect = (file: File | null) => {
    setFile(file);
  }

  const handleAnalyze = async ({companyName, jobTitle, jobDescription, file} : {companyName : string, jobTitle : string, jobDescription : string, file: File}) => {
    setIsProcessing(true);
    setStatusText('Uploading your resume...');
    const uploadedFile = await fs.upload(file);

    if(!uploadedFile){
        return setStatusText('Failed to upload file');
    }

    setStatusText('Converting to image...');
    const imageFile = await convertPdfToImage(file);
    if(!imageFile.file){
        return setStatusText('Failed to convert PDF to image');
    }

    setStatusText('Uploading image...');
    const uploadedImage = await fs.upload(imageFile.file);
    if(!uploadedImage){
        return setStatusText('Failed to upload image');
    }

    setStatusText('Preparing data...');

    const uuid = generateUUID();
    const data = {
        id : uuid,
        resumePath : uploadedFile.path,
        imagePath : uploadedImage.path,
        companyName, jobTitle, jobDescription,
        feedback : '',
    }

    await kv.set(`resume:${uuid}`, JSON.stringify(data));
    setStatusText('Analyzing resume...');

    const feedback = await ai.feedback(
        uploadedFile.path,
        prepareInstructions({jobTitle, jobDescription})
    );

    if(!feedback) {return setStatusText('Error : Failed to analyze resume');}

    const feedbackText = typeof feedback.message.content === 'string'? feedback.message.content : feedback.message.content[0].text;
    
    data.feedback = JSON.parse(feedbackText);
    await kv.set(`resume:${uuid}`, JSON.stringify(data));
    setStatusText('Analysis complete, redirecting...');

    navigate(`/resume/${uuid}`);
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget.closest('form');
    if (!form) return;
    const formData = new FormData(form);
    
    const companyName = formData.get('company-name') as string;
    const jobTitle = formData.get('job-title') as string;
    const jobDescription = formData.get('job-description') as string;

    if(!file) return;

    handleAnalyze({companyName, jobTitle, jobDescription, file});

  };

  return ( 
      <main className="bg-dark-100 min-h-screen relative overflow-hidden">
        {/* Subtle glowing ambient light behind the main content */}
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-neon-cyan/5 rounded-full blur-[150px] pointer-events-none z-0"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-neon-violet/5 rounded-full blur-[150px] pointer-events-none z-0"></div>

        <Navbar />

        <section className="main-section">
             <div className='page-heading py-16 z-10 mx-auto w-full max-w-4xl'>
                <h1>Smart feedback for your dream job</h1>
                {isProcessing ? (
                    <>
                        <h2>{statusText}</h2>
                        {/* Ensure GIF works well on dark mode, or keep it. For now keeping it. */}
                        <img src="/images/resume-scan.gif" className='w-full rounded-2xl border border-white/10 mix-blend-screen opacity-80'/>
                    </>
                ) : (
                    <h2>Upload your resume to get started</h2>
                )}
                {!isProcessing && (
                    <form id="upload-form" onSubmit = {handleSubmit} className='flex flex-col gap-6 mt-8 w-full glass-panel p-8 rounded-3xl'>
                        <div className="form-div">
                            <label htmlFor="company-name">Company Name</label>
                            <input type="text" name="company-name" placeholder="Company Name" id="company-name" required />
                        </div>
                        <div className="form-div">
                            <label htmlFor="job-title">Job Title</label>
                            <input type="text" name="job-title" placeholder="Job Title" id="job-title" required />
                        </div>
                        <div className="form-div">
                            <label htmlFor="job-description">Job Description</label>
                            <textarea rows={5} name="job-description" placeholder="Paste the job description here..." id="job-description" required />
                        </div>
                        <div className="form-div">
                            <label htmlFor="uploader">Upload Resume</label>
                            <FileUploader onFileSelect={handleFileSelect} />
                        </div>

                        <button className='primary-button mt-4' type='submit'>
                            Analyze Resume
                        </button>
                    </form>
                )}
             </div>
        </section>
      </main>
    );
}

export default Upload