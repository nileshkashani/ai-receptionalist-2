import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  createUserWithEmailAndPassword,
  signInWithPopup
} from "firebase/auth"
import { auth, googleProvider } from "../firebase"

export default function Signup() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleEmailSignup = async e => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      await createUserWithEmailAndPassword(auth, email, password).
      then((res) => { localStorage.setItem("uName", res.user.displayName); navigate('/main') });
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }

  const handleGoogleSignup = async () => {
    setLoading(true)
    setError("")
    try {
      await signInWithPopup(auth, googleProvider).
      then((res) => { localStorage.setItem("uName", res.user.displayName); navigate('/main') });
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f0f0f] text-white">
      <div className="w-full max-w-md bg-[#171717] rounded-2xl p-8 shadow-xl">
        <h1 className="text-2xl font-semibold text-center mb-6">
          Create your account
        </h1>

        <form onSubmit={handleEmailSignup} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-3 rounded-lg bg-[#0f0f0f] border border-[#2a2a2a] focus:outline-none focus:border-[#10a37f]"
            onChange={e => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password (min 6 characters)"
            className="w-full px-4 py-3 rounded-lg bg-[#0f0f0f] border border-[#2a2a2a] focus:outline-none focus:border-[#10a37f]"
            onChange={e => setPassword(e.target.value)}
            required
          />

          {error && (
            <p className="text-sm text-red-400">{error}</p>
          )}

          <button
            disabled={loading}
            className="w-full py-3 rounded-lg bg-[#10a37f] hover:bg-[#0e8e6d] transition font-medium disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Sign up"}
          </button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="flex-1 h-px bg-[#2a2a2a]" />
          <span className="text-sm text-gray-400">or</span>
          <div className="flex-1 h-px bg-[#2a2a2a]" />
        </div>

        <button
          onClick={handleGoogleSignup}
          disabled={loading}
          className="w-full py-3 rounded-lg border border-[#2a2a2a] hover:bg-[#1f1f1f] transition flex items-center justify-center gap-3 disabled:opacity-50"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            className="w-5 h-5"
          />
          Continue with Google
        </button>
         <p className="mt-4 text-sm text-center text-gray-400">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-white cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  )
}
