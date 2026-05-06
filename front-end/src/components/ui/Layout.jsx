import Navbar from './Navbar'

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-950">
      <Navbar />
      <main className="flex-1 p-8 text-white overflow-y-auto">
        {children}
      </main>
    </div>
  )
}