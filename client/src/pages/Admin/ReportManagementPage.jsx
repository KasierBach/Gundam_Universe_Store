import { useEffect, useState } from 'react'
import reportService from '../../services/reportService'

const REPORT_STATUSES = ['pending', 'reviewed', 'dismissed']

const ReportManagementPage = () => {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState(null)

  const loadReports = async () => {
    try {
      const data = await reportService.getReports()
      setReports(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadReports()
  }, [])

  const handleStatusChange = async (reportId, status) => {
    try {
      setUpdatingId(reportId)
      await reportService.updateStatus(reportId, { status })
      await loadReports()
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div className="pt-24 pb-12 px-4 max-w-7xl mx-auto min-h-screen">
      <div className="mb-10">
        <h1 className="text-3xl font-orbitron text-white uppercase tracking-tighter">Violation Reports</h1>
        <p className="text-gundam-text-muted font-rajdhani uppercase tracking-[0.3em] text-xs mt-2">Review complaints and moderation signals from the trade hub</p>
      </div>

      <div className="glass-card border-gundam-border/30 p-6 overflow-x-auto">
        {loading ? (
          <div className="p-10 text-center text-gundam-cyan font-orbitron text-xs uppercase tracking-widest">Scanning violation grid...</div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gundam-border/20 text-[10px] font-orbitron uppercase tracking-widest text-gundam-text-muted">
                <th className="pb-4">Reason</th>
                <th className="pb-4">Reporter</th>
                <th className="pb-4">Target</th>
                <th className="pb-4">Details</th>
                <th className="pb-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report._id} className="border-b border-gundam-border/10 align-top">
                  <td className="py-4 text-white font-orbitron uppercase tracking-tight">{report.reason}</td>
                  <td className="py-4">
                    <div className="text-white">{report.reporter?.displayName || 'Unknown Pilot'}</div>
                    <div className="text-xs text-gundam-text-muted">{report.reporter?.email || 'No signal'}</div>
                  </td>
                  <td className="py-4 text-gundam-cyan text-sm">{report.targetType} / {String(report.targetId).slice(-8)}</td>
                  <td className="py-4 text-gundam-text-secondary text-sm max-w-md">{report.details}</td>
                  <td className="py-4">
                    <select
                      value={report.status}
                      disabled={updatingId === report._id}
                      onChange={(event) => handleStatusChange(report._id, event.target.value)}
                      className="bg-black/40 border border-gundam-border/30 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-gundam-cyan"
                    >
                      {REPORT_STATUSES.map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default ReportManagementPage
