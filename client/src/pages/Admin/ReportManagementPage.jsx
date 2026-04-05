import { useEffect, useState } from 'react'
import reportService from '../../services/reportService'
import { useI18n } from '../../i18n/I18nProvider'

const REPORT_STATUSES = ['pending', 'reviewed', 'dismissed']

const ReportManagementPage = () => {
  const { locale } = useI18n()
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState(null)
  const [resolutionNotes, setResolutionNotes] = useState({})
  const copy = locale === 'vi'
    ? {
      title: 'Báo cáo vi phạm',
      subtitle: 'Rà soát khiếu nại và tín hiệu moderation từ sàn trao đổi',
      loading: 'Đang quét danh sách vi phạm...',
      headers: ['Lý do', 'Người báo cáo', 'Mục tiêu', 'Chi tiết', 'Hướng xử lý', 'Trạng thái'],
      unknownPilot: 'Phi công chưa xác định',
      noSignal: 'Chưa có liên hệ',
      notePlaceholder: 'Ghi chú moderator, bằng chứng, hướng xử lý...',
    }
    : {
      title: 'Violation Reports',
      subtitle: 'Review complaints and moderation signals from the trade hub',
      loading: 'Scanning violation grid...',
      headers: ['Reason', 'Reporter', 'Target', 'Details', 'Resolution', 'Status'],
      unknownPilot: 'Unknown Pilot',
      noSignal: 'No signal',
      notePlaceholder: 'Moderator note, evidence summary, action taken...',
    }

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
      await reportService.updateStatus(reportId, {
        status,
        resolutionNote: resolutionNotes[reportId] || '',
      })
      await loadReports()
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div className="pt-24 pb-12 px-4 max-w-7xl mx-auto min-h-screen">
      <div className="mb-10">
        <h1 className="text-3xl font-orbitron text-white uppercase tracking-tighter">{copy.title}</h1>
        <p className="text-gundam-text-muted font-rajdhani uppercase tracking-[0.3em] text-xs mt-2">{copy.subtitle}</p>
      </div>

      <div className="glass-card border-gundam-border/30 p-6 overflow-x-auto">
        {loading ? (
          <div className="p-10 text-center text-gundam-cyan font-orbitron text-xs uppercase tracking-widest">{copy.loading}</div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gundam-border/20 text-[10px] font-orbitron uppercase tracking-widest text-gundam-text-muted">
                {copy.headers.map((header) => (
                  <th key={header} className="pb-4">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report._id} className="border-b border-gundam-border/10 align-top">
                  <td className="py-4 text-white font-orbitron uppercase tracking-tight">{report.reason}</td>
                  <td className="py-4">
                    <div className="text-white">{report.reporter?.displayName || copy.unknownPilot}</div>
                    <div className="text-xs text-gundam-text-muted">{report.reporter?.email || copy.noSignal}</div>
                  </td>
                  <td className="py-4 text-gundam-cyan text-sm">{report.targetType} / {String(report.targetId).slice(-8)}</td>
                  <td className="py-4 text-gundam-text-secondary text-sm max-w-md">{report.details}</td>
                  <td className="py-4">
                    <textarea
                      rows="3"
                      value={resolutionNotes[report._id] ?? report.resolutionNote ?? ''}
                      onChange={(event) => setResolutionNotes((current) => ({
                        ...current,
                        [report._id]: event.target.value,
                      }))}
                      className="min-w-[220px] rounded-lg border border-gundam-border/20 bg-black/30 px-3 py-2 text-sm text-white focus:outline-none focus:border-gundam-cyan"
                      placeholder={copy.notePlaceholder}
                    />
                  </td>
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
