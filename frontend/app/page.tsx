import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-blue-200 to-blue-500">
    <h1 className="mb-5 text-4xl font-bold text-white"> Welcome to Your Library Database</h1>
    <p className="mb-5 text-lg text-white">Please Login or Signup to Continue</p>
    <div className ="flex space-x-4">
        <Link href="/login" className="px-4 py-2 bg-blue-700 text-white rounded-md transition hover:bg-blue-800">
         <button>Login</button>
        </Link>
        <Link href="/signup" className="px-4 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800">
            Signup
        </Link>
    </div>
</div>
  );
}

