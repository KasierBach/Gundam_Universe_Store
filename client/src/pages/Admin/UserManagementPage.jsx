import { useEffect, useState } from 'react'
import { Users, Shield, UserCheck } from 'lucide-react'
import adminService from '../../services/adminService'

const UserManagementPage = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await adminService.getUsers()
        setUsers(data)
      } finally {
        setLoading(false)
      }
    }

    loadUsers()
  }, [])

  return (
    <div className="pt-24 pb-12 px-4 max-w-7xl mx-auto min-h-screen">
      <div className="mb-10">
        <h1 className="text-3xl font-orbitron text-white uppercase tracking-tighter">Pilot Authorization</h1>
        <p className="text-gundam-text-muted font-rajdhani uppercase tracking-[0.3em] text-xs mt-2">Monitor accounts and roles</p>
      </div>

      <div className="bg-gundam-dark-surface/40 border border-gundam-border rounded-xl overflow-hidden">
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 px-6 py-4 border-b border-white/5 text-[10px] font-orbitron uppercase tracking-widest text-gundam-text-muted">
          <span>Pilot</span>
          <span>Role</span>
          <span>Status</span>
          <span>Joined</span>
        </div>

        {loading ? (
          <div className="p-10 text-center text-gundam-cyan font-orbitron text-xs uppercase tracking-widest">Syncing pilot registry...</div>
        ) : users.map((user) => (
          <div key={user._id} className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 px-6 py-5 border-b border-white/5 items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gundam-cyan/10 border border-gundam-cyan/20 flex items-center justify-center">
                <Users size={16} className="text-gundam-cyan" />
              </div>
              <div>
                <p className="text-white font-semibold">{user.displayName}</p>
                <p className="text-xs text-gundam-text-muted">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-gundam-cyan text-sm uppercase">
              <Shield size={14} />
              <span>{user.role}</span>
            </div>
            <div className={`inline-flex items-center gap-2 text-xs uppercase font-orbitron ${user.isActive ? 'text-gundam-emerald' : 'text-gundam-red'}`}>
              <UserCheck size={14} />
              <span>{user.isActive ? 'Active' : 'Disabled'}</span>
            </div>
            <div className="text-sm text-gundam-text-secondary">{new Date(user.createdAt).toLocaleDateString()}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default UserManagementPage
