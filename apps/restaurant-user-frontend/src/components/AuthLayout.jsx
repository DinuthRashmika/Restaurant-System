export default function AuthLayout({ leftContent, children }) {
  return (
    <div className="min-h-screen bg-[#d9d9d9]">
      <div className="mx-auto grid min-h-screen max-w-[1400px] grid-cols-1 overflow-hidden lg:grid-cols-2">
        <div className="relative hidden lg:flex bg-[linear-gradient(rgba(210,84,16,0.86),rgba(210,84,16,0.86)),url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1600&auto=format&fit=crop')] bg-cover bg-center p-12 text-white">
          <div className="mt-auto mb-auto max-w-md">
            {leftContent}
          </div>
        </div>

        <div className="flex items-center justify-center px-6 py-8">
          <div className="w-full max-w-[520px] rounded-[28px] bg-white/90 p-8 shadow-xl backdrop-blur">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}