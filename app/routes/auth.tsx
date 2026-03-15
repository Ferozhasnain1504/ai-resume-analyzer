import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { usePuterStore } from "~/lib/puter"

export const meta = () => {[
  { title: "CVAI | Auth" },
  {name : "description", content: "Log into your account - CVAI" },
]}

const Auth = () => {
  const { isLoading, auth } = usePuterStore(); 
  const location = useLocation();
  const next = location.search.split('next=')[1];
  const navigate = useNavigate();
  
  useEffect(()=> {
    if(auth.isAuthenticated) navigate(next);
  }, [auth.isAuthenticated,next]);

  return (
    <main className="bg-dark-100 min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Optional subtler background elements to match the dark theme */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-neon-violet/10 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="relative z-10 w-full max-w-md mx-auto p-4">
        <section className="flex flex-col gap-8 bg-dark-200/40 border border-white/10 backdrop-blur-xl shadow-[0_0_40px_rgba(112,0,255,0.15)] rounded-3xl p-10">
          <div className="flex flex-col items-center text-center gap-2">
            <h1>Welcome</h1>
            <h2>Log In to Continue Your Job Journey</h2>
          </div>
          <div>
            {isLoading ? (
              <button  className="auth-button w-full animate-pulse text-xl">
                <p>Signing you in...</p>
              </button>
            ): (
              <>
              {auth.isAuthenticated ? (
                <button className="auth-button w-full text-xl" onClick={auth.signOut}> 
                  <p>Log Out</p>
                </button>
              ) : (
                <button className="auth-button w-full text-xl" onClick={auth.signIn}>
                  <p>Log In</p>
                </button>
              )}
              </>
            )}
          </div>
        </section>
      </div>
    </main>
  )
}

export default Auth  