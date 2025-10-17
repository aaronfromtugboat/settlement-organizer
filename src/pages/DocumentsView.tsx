import { useDocuments } from '@/hooks/useDocuments'
import { Button } from '@/components/ui/button'
import { FileText, Image, Download, Calendar } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { getDocumentUrl } from '@/hooks/useDocuments'

export function DocumentsView() {
  const { data: documents = [], isLoading } = useDocuments('sample-policy-001')

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading documents...</div>
        </div>
      </div>
    )
  }

  const getFileIcon = (fileType: string) => {
    if (fileType === 'application/pdf') {
      return <FileText className="w-5 h-5 text-red-500" />
    }
    return <Image className="w-5 h-5 text-blue-500" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Payment Documents</h1>
          <p className="text-gray-600 mt-2">
            View and download all payment documentation from your insurance carrier
          </p>
        </div>

        {documents.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-12">
            <div className="flex flex-col items-center justify-center">
              <FileText className="w-12 h-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No documents yet</h3>
              <p className="text-gray-500 text-center mb-6">
                Upload your first payment document to get started
              </p>
              <Button className="bg-emerald-600 hover:bg-emerald-700" asChild>
                <a href="/">Upload Document</a>
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.map((doc) => (
              <div key={doc.id} className="rounded-2xl border border-gray-200 p-4 bg-white shadow-sm cursor-pointer hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  {getFileIcon(doc.file_type)}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{doc.file_name}</div>
                    <div className="text-xs text-gray-500">
                      {formatFileSize(doc.file_size)}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                  <Calendar className="w-3 h-3" />
                  {formatDate(doc.uploaded_at)}
                </div>
                
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    asChild
                  >
                    <a
                      href={getDocumentUrl(doc.id)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View
                    </a>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    asChild
                  >
                    <a
                      href={getDocumentUrl(doc.id)}
                      download={doc.file_name}
                    >
                      <Download className="w-3 h-3" />
                    </a>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Upload CTA */}
        <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="text-sm font-semibold text-emerald-900">Need to add more documents?</div>
              <div className="text-sm text-emerald-900/80">Upload EOBs, payment letters, or photos of checks</div>
            </div>
            <Button className="bg-emerald-600 hover:bg-emerald-700" asChild>
              <a href="/">Upload Documents</a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
