import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import LogoutButton from "@/features/auth/components/LogoutButton";
import {
  CalendarIcon,
  HeartIcon,
  MailIcon,
  Music4Icon,
  PlusIcon,
  UserIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { logout } from "@/features/auth/authSlice";
import { resetOnboarding } from "@/features/onboarding/onboardingSlice";

const formatCardNumber = (cardNumber: string) => {
  const digits = cardNumber.replace(/\s/g, "");
  if (!digits) return null;

  const lastFour = digits.slice(-4);
  return `•••• •••• •••• ${lastFour}`;
};

const HomePage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const { profile, favoriteSongs, payment } = useAppSelector(
    (state) => state.onboarding
  );

  const handleAddAccount = useCallback(() => {
    if (typeof window !== "undefined") {
      window.localStorage.clear();
    }
    dispatch(logout());
    dispatch(resetOnboarding());
    navigate("/login", { replace: true });
  }, [dispatch, navigate]);

  const displayName = profile.name || user?.username || "there";
  const formattedCardNumber = useMemo(
    () => formatCardNumber(payment.cardNumber),
    [payment.cardNumber]
  );
  const filteredSongs = favoriteSongs.filter((song) => Boolean(song.trim()));

  return (
    <div className="flex h-screen justify-center bg-linear-to-br from-slate-900/5 via-white to-primary/5 px-4 py-4">
      <div className="flex flex-col h-full w-full max-w-5xl gap-4">
        <header className="flex shrink-0 flex-wrap items-center gap-4 rounded-3xl border border-white/60 bg-white/75 px-5 py-4 shadow-lg shadow-slate-900/5 backdrop-blur">
          <div>
            {profile.profilePicture && (
              <img
                src={profile.profilePicture}
                alt={`${displayName}'s profile`}
                className="size-12 rounded-full object-contain ring-2 ring-primary/20"
              />
            )}
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Account status
            </p>
            <p className="text-sm font-medium text-slate-700">
              Logged in as {displayName}
            </p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-wide"
              onClick={handleAddAccount}
            >
              <PlusIcon className="size-4" />
              Add another account
            </Button>
            <LogoutButton variant="outline" />
          </div>
        </header>

        <div className="flex flex-col h-full  gap-4 overflow-hidden">
          <section className="   gap-4">
            <article className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-lg shadow-slate-900/10 backdrop-blur">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                    Welcome back
                  </p>
                  <h1 className="mt-1 text-xl font-semibold text-slate-900">
                    Hey {displayName}, you are all set!
                  </h1>
                  <p className="mt-2 max-w-md text-xs text-slate-500">
                    Your personal details and preferences are saved. Everything
                    you need is right here.
                  </p>
                </div>
                {profile.profilePicture && (
                  <img
                    src={profile.profilePicture}
                    alt={`${displayName}'s profile`}
                    className="size-12 rounded-full object-contain ring-2 ring-primary/20"
                  />
                )}
              </div>

              <dl className="flex flex-col gap-3 text-xs text-slate-600 sm:grid-cols-3">
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 rounded-full p-2">
                    <UserIcon className="size-6" />
                  </div>
                  <div>
                    <dt className="text-[0.6rem] font-semibold uppercase tracking-wide text-slate-500">
                      Full name
                    </dt>
                    <dd className="mt-1 text-sm font-medium text-slate-800">
                      {profile.name || "Not provided"}
                    </dd>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 rounded-full p-2">
                    <MailIcon className="size-6" />
                  </div>
                  <div>
                    <dt className="text-[0.6rem] font-semibold uppercase tracking-wide text-slate-500">
                      Email
                    </dt>
                    <dd className="mt-1 text-sm font-medium text-slate-800">
                      {profile.email || "Not provided"}
                    </dd>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 rounded-full p-2">
                    <CalendarIcon className="size-6" />
                  </div>
                  <div>
                    <dt className="text-[0.6rem] font-semibold uppercase tracking-wide text-slate-500">
                      Age
                    </dt>
                    <dd className="mt-1 text-sm font-medium text-slate-800">
                      {profile.age || "Not provided"}
                    </dd>
                  </div>
                </div>
              </dl>
            </article>
          </section>

          <section className="grid grid-cols-2 gap-4">
            <article className="flex flex-col rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-lg shadow-slate-900/10 backdrop-blur">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                    Favorite songs
                  </p>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Your top picks
                  </h2>
                  <p className="text-[0.65rem] text-slate-500">
                    Update these anytime to fine-tune recommendations.
                  </p>
                </div>
           
              <div>
                <span className="flex items-center gap-2 bg-primary/10 rounded-full p-2">
                    <Music4Icon className="size-6" />
                  </span>
                </div>
              </div>

              {filteredSongs.length > 0 ? (
                <ul className="mt-4 flex flex-col flex-1 grid-cols-1 gap-2 max-h-96  overflow-auto text-xs sm:grid-cols-2">
                  {filteredSongs.map((song) => (
                    <li
                      key={song}
                      className="flex min-h-[44px] items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-3 py-2 text-slate-700"
                    >
                      <span className="font-medium leading-tight">{song}</span>
                      <span className="text-[0.55rem] uppercase tracking-wide text-slate-400">
                        {/* add heart svg icon here */}
                        <HeartIcon className="size-4" />
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="mt-4 flex flex-1 items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-3 py-4 text-xs text-slate-500">
                  No songs yet—add a few to see them here.
                </div>
              )}
            </article>

            <article className="flex flex-col rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-lg shadow-slate-900/10 backdrop-blur">
              <div className="flex flex-col gap-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                  Payment details
                </p>
                <h2 className="text-lg font-semibold text-slate-900">
                  Billing preferences
                </h2>
              </div>

              {formattedCardNumber ? (
                <>
                  <div className="flex w-full flex-1">
                    <div className="mt-4 flex w-full flex-1 flex-col justify-between rounded-3xl bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.2),rgba(255,255,255,0)_60%),linear-gradient(135deg,#1f2937,#0f172a_60%,#4c1d95)] p-6 text-slate-100 shadow-xl shadow-primary/20">
                      <div className="flex items-center justify-between text-[0.55rem] uppercase tracking-[0.35em] text-slate-300">
                        <span>Primary card</span>
                        <span>Virtual</span>
                      </div>
                      <p className="mt-6 text-lg font-semibold tracking-[0.3em] text-white">
                        {formattedCardNumber}
                      </p>
                      <div className="mt-6 flex items-end justify-between text-[0.6rem] uppercase tracking-wide text-slate-300">
                        <div>
                          <p className="text-[0.55rem] font-semibold text-slate-400">
                            Card holder
                          </p>
                          <p className="mt-1 text-sm font-semibold text-white">
                            {profile.name || displayName}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[0.55rem] font-semibold text-slate-400">
                            Expires
                          </p>
                          <p className="mt-1 text-sm font-semibold text-white">
                            {payment.expiryDate || "—"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="mt-4 flex flex-1 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-3 py-6 text-xs text-slate-500">
                  <p>No card on file yet.</p>
                </div>
              )}
            </article>
          </section>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
