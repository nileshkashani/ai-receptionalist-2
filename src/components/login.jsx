import { useState } from "react"
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth"
import { auth, googleProvider } from "../firebase"
import { useNavigate } from "react-router-dom"

export default function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const navigate = useNavigate()

    const handleEmailLogin = async e => {
        e.preventDefault()
        setLoading(true)
        setError("")
        try {
            const resp = await signInWithEmailAndPassword(auth, email, password).
                then((res) => { localStorage.setItem("uName", res.user.displayName); navigate('/main') });
            console.log(resp)
        } catch (err) {
            setError(err.message)
        }
        setLoading(false)
    }

    const handleGoogleLogin = async () => {
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
                    Welcome back
                </h1>

                <form onSubmit={handleEmailLogin} className="space-y-4">
                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full px-4 py-3 rounded-lg bg-[#0f0f0f] border border-[#2a2a2a] focus:outline-none focus:border-[#10a37f]"
                        onChange={e => setEmail(e.target.value)}
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full px-4 py-3 rounded-lg bg-[#0f0f0f] border border-[#2a2a2a] focus:outline-none focus:border-[#10a37f]"
                        onChange={e => setPassword(e.target.value)}
                    />

                    {error && (
                        <p className="text-sm text-red-400">{error}</p>
                    )}

                    <button
                        disabled={loading}
                        className="w-full py-3 rounded-lg bg-[#10a37f] hover:bg-[#0e8e6d] transition font-medium"
                    >
                        {loading ? "Signing in..." : "Login"}
                    </button>
                </form>

                <div className="my-6 flex items-center gap-3">
                    <div className="flex-1 h-px bg-[#2a2a2a]" />
                    <span className="text-sm text-gray-400">or</span>
                    <div className="flex-1 h-px bg-[#2a2a2a]" />
                </div>

                <button
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="w-full py-3 rounded-lg border border-[#2a2a2a] hover:bg-[#1f1f1f] transition flex items-center justify-center gap-3"
                >
                    <img
                        src="https://www.svgrepo.com/show/475656/google-color.svg"
                        className="w-5 h-5"
                    />
                    Continue with Google
                </button>
                <p className="mt-4 text-sm text-center text-gray-400">
                    New to Shaani.ai ?{" "}
                    <span
                        onClick={() => navigate("/signup")}
                        className="text-white cursor-pointer hover:underline"
                    >
                        SignUp
                    </span>
                </p>
            </div>
        </div>
    )
}
