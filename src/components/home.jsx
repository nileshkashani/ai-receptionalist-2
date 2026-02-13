import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 to-zinc-900 text-white flex items-center justify-center px-6">
      <div className="max-w-3xl w-full text-center space-y-8">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
          Your AI Receptionist,
          <br />
          <span className="text-zinc-400">Always Available</span>
        </h1>

        <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
          Handle calls, answer questions, and automate conversations with an
          intelligent AI receptionist built for modern businesses.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => navigate("/signup")}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white text-black font-medium hover:bg-zinc-200 transition"
          >
            Get Started
          </button>

          <button
            onClick={() => navigate("/login")}
            className="w-full sm:w-auto px-6 py-3 rounded-xl border border-zinc-700 text-white hover:bg-zinc-800 transition"
          >
            Login
          </button>

          <button
            onClick={() => navigate("/main")}
            className="w-full sm:w-auto px-6 py-3 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
          >
            Start without login
          </button>
        </div>

        <div className="pt-6 text-sm text-zinc-500">
          Powered by AI · Voice & Chat · 24×7 Availability
        </div>
      </div>
    </div>
  );
}
