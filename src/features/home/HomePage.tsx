import { useAppSelector } from '@/app/hooks'

const HomePage = () => {
  const user = useAppSelector((state) => state.auth.user)

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-900/5 px-4 py-16">
      <div className="w-full max-w-xl rounded-2xl bg-white p-10 text-center shadow-lg shadow-slate-900/10">
        <h1 className="text-3xl font-semibold text-slate-900">Welcome aboard!</h1>
        <p className="mt-4 text-slate-600">
          {user
            ? `You're all set, ${user.username}. Explore the app and personalize your experience.`
            : 'You are all set. Explore the app and personalize your experience.'}
        </p>
      </div>
    </div>
  )
}

export default HomePage


