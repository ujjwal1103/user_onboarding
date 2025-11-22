import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { Button } from '@/components/ui/button'
import { completeStep, goToStep, setFavoriteSongs } from '@/features/onboarding/onboardingSlice'
import { Trash2 } from 'lucide-react'

const TOP_SONGS = [
  'Blinding Lights – The Weeknd',
  'Shape of You – Ed Sheeran',
  'Levitating – Dua Lipa',
  'As It Was – Harry Styles',
  'drivers license – Olivia Rodrigo',
  'Uptown Funk – Mark Ronson ft. Bruno Mars',
  'Bad Guy – Billie Eilish',
  'Rolling in the Deep – Adele',
] as const

const MAX_CUSTOM_SONGS = 10

const FavoriteSongsPage = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const storedSongs = useAppSelector((state) => state.onboarding.favoriteSongs)

  const [customSongInputs, setCustomSongInputs] = useState<string[]>(() => {
    const customSongs = storedSongs.filter(
      (song) => !TOP_SONGS.some((topSong) => topSong === song),
    )
    return customSongs.length > 0 ? customSongs : ['']
  })
  const [error, setError] = useState<string | null>(null)

  const handleCustomSongChange = (index: number, value: string) => {
    setError(null)
    setCustomSongInputs((previous) => {
      const next = [...previous]
      next[index] = value
      return next
    })
  }

  const addCustomSongField = () => {
    if (customSongInputs.length >= MAX_CUSTOM_SONGS) {
      setError(`You can add up to ${MAX_CUSTOM_SONGS} custom songs.`)
      return
    }
    setCustomSongInputs((previous) => [...previous, ''])
  }

  const removeCustomSong = (index: number) => {
    setCustomSongInputs((previous) => {
      const next = previous.filter((_, position) => position !== index)
      return next.length > 0 ? next : ['']
    })
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const customSongs = customSongInputs
      .map((song) => song.trim())
      .filter(Boolean)
      .filter((song, index, array) => array.indexOf(song) === index)

    const songs = customSongs.filter(Boolean)

    if (songs.length === 0) {
      setError('Pick at least one song to continue.')
      return
    }

    setError(null)
    dispatch(setFavoriteSongs(songs))
    dispatch(completeStep(2))
    dispatch(goToStep(3))
    navigate('/onboarding/step-3')
  }

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h2 className="text-xl font-semibold text-slate-900">Favorite Songs</h2>
        <p className="text-sm text-slate-600">
          Tell us what you love listening to so we can recommend tracks.
        </p>
      </header>

      <form className="space-y-8" onSubmit={handleSubmit}>
        <section className="space-y-4">
          <header className="space-y-1">
            <p className="text-sm text-slate-600">
              Add up to {MAX_CUSTOM_SONGS} custom songs in case we missed your favorites.
            </p>
          </header>

          <div className="space-y-3">
            {customSongInputs.map((value, index) => (
              <div key={`song-${index}`} className="flex gap-3">
                <input
                  type="text"
                  value={value}
                  onChange={(event) => handleCustomSongChange(index, event.target.value)}
                  placeholder="Song title – Artist"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => removeCustomSong(index)}
       
                >
                  <Trash2 />
                </Button>
              </div>
            ))}

            {customSongInputs.length < MAX_CUSTOM_SONGS && (
              <Button type="button" variant="outline" onClick={addCustomSongField}>
                Add another song
              </Button>
            )}
          </div>
        </section>

        {error && <p className="text-sm text-rose-500">{error}</p>}

        <footer className="flex justify-between">
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              dispatch(goToStep(1))
              navigate('/onboarding/step-1')
            }}
          >
            Back
          </Button>
          <Button type="submit">Continue to payment</Button>
        </footer>
      </form>
    </div>
  )
}

export default FavoriteSongsPage


