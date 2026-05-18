import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white font-sans">
      <main className="flex flex-col items-center justify-center px-6 py-20 text-center">
        <div className="mb-8">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-blue-500/30">
            <span className="text-3xl font-bold">CP</span>
          </div>
        </div>

        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Welcome to the future from CPGC
        </h1>

        <p className="text-lg md:text-xl text-slate-300 max-w-2xl mb-12 leading-relaxed">
          Building tomorrow&apos;s solutions with cutting-edge AI-native technology.
          The future is here, and it&apos;s being shaped right now.
        </p>

        <div className="flex flex-wrap gap-4 justify-center">
          <a
            href="https://nextjs.org"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 bg-white text-slate-900 font-semibold rounded-full hover:bg-slate-100 transition-colors"
          >
            <Image src="/next.svg" alt="Next.js" width={20} height={20} className="dark:invert" />
            Next.js
          </a>
          <a
            href="https://tailwindcss.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 bg-slate-700 text-white font-semibold rounded-full hover:bg-slate-600 transition-colors"
          >
            Tailwind CSS
          </a>
          <a
            href="https://vercel.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 bg-slate-700 text-white font-semibold rounded-full hover:bg-slate-600 transition-colors"
          >
            <Image src="/vercel.svg" alt="Vercel" width={20} height={20} />
            Vercel
          </a>
        </div>

        <div className="mt-16 text-slate-500 text-sm">
          Powered by AI • Built with Next.js & Tailwind CSS
        </div>
      </main>
    </div>
  );
}