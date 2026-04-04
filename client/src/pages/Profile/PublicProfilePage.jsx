import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { User, MapPin, Phone, Shield } from 'lucide-react'
import userService from '../../services/userService'

const PublicProfilePage = () => {
  const { id } = useParams()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await userService.getPublicProfile(id)
        setProfile(data)
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [id])

  if (loading) {
    return <div className="pt-32 text-center text-gundam-cyan font-orbitron text-xs uppercase tracking-widest">Loading pilot dossier...</div>
  }

  if (!profile) {
    return <div className="pt-32 text-center text-gundam-red font-orbitron text-xs uppercase tracking-widest">Pilot data not found.</div>
  }

  return (
    <div className="pt-24 pb-12 px-4 max-w-4xl mx-auto min-h-screen">
      <div className="glass-card p-8 border-gundam-border/40">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="w-28 h-28 rounded-2xl border border-gundam-cyan/30 bg-gundam-bg-tertiary flex items-center justify-center overflow-hidden">
            {profile.avatar?.url ? (
              <img src={profile.avatar.url} alt={profile.displayName} className="w-full h-full object-cover" />
            ) : (
              <User size={40} className="text-gundam-cyan" />
            )}
          </div>

          <div className="flex-1">
            <h1 className="text-3xl font-orbitron text-white uppercase tracking-tight">{profile.displayName}</h1>
            <div className="flex flex-wrap gap-4 mt-4 text-sm text-gundam-text-secondary">
              <span className="inline-flex items-center gap-2"><Shield size={16} className="text-gundam-cyan" /> {profile.role}</span>
              <span className="inline-flex items-center gap-2"><MapPin size={16} className="text-gundam-cyan" /> {profile.address?.city || 'Unknown sector'}</span>
              <span className="inline-flex items-center gap-2"><Phone size={16} className="text-gundam-cyan" /> {profile.phone || 'No comm link'}</span>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <StatCard label="Reputation" value={`${profile.reputation?.score || 0}%`} />
              <StatCard label="Ratings" value={profile.reputation?.totalRatings || 0} />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Link to="/trade" className="text-gundam-cyan font-orbitron text-xs uppercase tracking-widest hover:underline">Back to trade hub</Link>
      </div>
    </div>
  )
}

const StatCard = ({ label, value }) => (
  <div className="bg-gundam-bg-tertiary/60 border border-white/5 rounded-xl p-4">
    <p className="text-[10px] font-orbitron uppercase tracking-widest text-gundam-text-muted">{label}</p>
    <p className="mt-2 text-2xl font-orbitron text-white">{value}</p>
  </div>
)

export default PublicProfilePage
