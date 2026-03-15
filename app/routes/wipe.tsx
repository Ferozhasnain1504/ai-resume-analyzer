import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { usePuterStore } from "~/lib/puter";

const WipeApp = () => {
    const { auth, isLoading, error, clearError, fs, ai, kv } = usePuterStore();
    const navigate = useNavigate();
    const [files, setFiles] = useState<FSItem[]>([]);

    const loadFiles = async () => {
        const files = (await fs.readDir("./")) as FSItem[];
        setFiles(files);
    };

    useEffect(() => {
        loadFiles();
    }, []);

    useEffect(() => {
        if (!isLoading && !auth.isAuthenticated) {
            navigate("/auth?next=/wipe");
        }
    }, [isLoading]);

    const handleDelete = async () => {
        files.forEach(async (file) => {
            await fs.delete(file.path);
        });
        await kv.flush();
        loadFiles();
    };

    if (isLoading) {
        return <div className="bg-dark-100 min-h-screen flex items-center justify-center text-white">Loading...</div>;
    }

    if (error) {
        return <div className="bg-dark-100 min-h-screen flex items-center justify-center text-red-500">Error: {error}</div>;
    }

    return (
        <main className="bg-dark-100 min-h-screen relative overflow-hidden flex flex-col items-center pt-20">
            <div className="glass-panel p-8 rounded-3xl flex flex-col gap-6 max-w-2xl w-full mx-4 relative z-10">
                <h1 className="text-3xl font-display font-bold text-white">Wipe App Data</h1>
                <p className="text-gray-400">Authenticated as: <span className="text-neon-cyan">{auth.user?.username}</span></p>
                <div className="text-gray-300">Existing files:</div>
                <div className="flex flex-col gap-4 bg-dark-300/50 p-4 rounded-xl border border-white/5 text-sm">
                    {files.length === 0 ? <p className="text-gray-500 italic">No files found.</p> : files.map((file) => (
                        <div key={file.id} className="flex flex-row gap-4 border-b border-white/5 pb-2 last:border-0">
                            <p className="text-gray-300">{file.name}</p>
                        </div>
                    ))}
                </div>
                <div>
                    <button
                        className="bg-red-900/40 border border-red-500/50 text-red-400 font-bold px-6 py-3 rounded-full cursor-pointer hover:bg-red-900/60 transition-all w-full"
                        onClick={() => handleDelete()}
                    >
                        Wipe App Data
                    </button>
                </div>
            </div>
        </main>
    );
};

export default WipeApp;