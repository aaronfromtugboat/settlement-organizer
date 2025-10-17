import { useState, useCallback } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Upload, File, Image, AlertCircle, CheckCircle } from 'lucide-react'
import { useUploadDocument } from '@/hooks/useDocuments'

interface DocumentUploadProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface UploadFile {
  file: File
  id: string
  status: 'pending' | 'uploading' | 'success' | 'error'
  progress: number
  error?: string
}

const ALLOWED_TYPES = [
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/jpg'
]

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export function DocumentUpload({ open, onOpenChange }: DocumentUploadProps) {
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const uploadDocument = useUploadDocument()

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return 'Only PDF, PNG, and JPG files are allowed'
    }
    if (file.size > MAX_FILE_SIZE) {
      return 'File size must be less than 10MB'
    }
    return null
  }

  const addFiles = useCallback((files: File[]) => {
    const validFiles: UploadFile[] = []
    const errors: string[] = []

    Array.from(files).forEach((file) => {
      const error = validateFile(file)
      if (error) {
        errors.push(`${file.name}: ${error}`)
      } else {
        validFiles.push({
          file,
          id: Math.random().toString(36).substr(2, 9),
          status: 'pending',
          progress: 0
        })
      }
    })

    setUploadFiles(prev => [...prev, ...validFiles])
    
    if (errors.length > 0) {
      alert(`Some files were rejected:\n${errors.join('\n')}`)
    }
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const files = Array.from(e.dataTransfer.files)
    addFiles(files)
  }, [addFiles])

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    addFiles(files)
  }, [addFiles])

  const uploadFile = async (uploadFile: UploadFile) => {
    setUploadFiles(prev => prev.map(f => 
      f.id === uploadFile.id ? { ...f, status: 'uploading', progress: 0 } : f
    ))

    try {
      await uploadDocument.mutateAsync({
        file: uploadFile.file,
        policyId: 'sample-policy-001', // TODO: Get from context/params
      })

      setUploadFiles(prev => prev.map(f => 
        f.id === uploadFile.id ? { ...f, status: 'success', progress: 100 } : f
      ))
    } catch (error) {
      setUploadFiles(prev => prev.map(f => 
        f.id === uploadFile.id ? { 
          ...f, 
          status: 'error', 
          error: error instanceof Error ? error.message : 'Upload failed' 
        } : f
      ))
    }
  }

  const handleUploadAll = async () => {
    const pendingFiles = uploadFiles.filter(f => f.status === 'pending')
    for (const file of pendingFiles) {
      await uploadFile(file)
    }
  }

  const removeFile = (id: string) => {
    setUploadFiles(prev => prev.filter(f => f.id !== id))
  }

  const handleClose = () => {
    setUploadFiles([])
    onOpenChange(false)
  }

  const getFileIcon = (file: File) => {
    if (file.type === 'application/pdf') {
      return <File className="w-5 h-5 text-red-500" />
    }
    return <Image className="w-5 h-5 text-blue-500" />
  }

  const getStatusIcon = (status: UploadFile['status']) => {
    switch (status) {
      case 'uploading':
        return <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      case 'success':
        return <CheckCircle className="w-4 h-4 text-emerald-500" />
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />
      default:
        return null
    }
  }

  const pendingCount = uploadFiles.filter(f => f.status === 'pending').length
  const successCount = uploadFiles.filter(f => f.status === 'success').length
  const errorCount = uploadFiles.filter(f => f.status === 'error').length

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Payment Documents</DialogTitle>
          <DialogDescription>
            Upload EOBs, payment letters, or photos of checks from your insurance carrier.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Upload Zone */}
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              isDragOver 
                ? 'border-emerald-500 bg-emerald-50' 
                : 'border-gray-300 hover:border-emerald-400'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
            <p className="text-sm text-gray-600 mb-2">
              Drag and drop files here, or click to select
            </p>
            <input
              type="file"
              multiple
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={handleFileInput}
              className="hidden"
              id="file-upload"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              Select Files
            </Button>
            <p className="text-xs text-gray-500 mt-2">
              PDF, PNG, JPG up to 10MB each
            </p>
          </div>

          {/* File List */}
          {uploadFiles.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Files to Upload</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {uploadFiles.map((uploadFile) => (
                  <div
                    key={uploadFile.id}
                    className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg"
                  >
                    {getFileIcon(uploadFile.file)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {uploadFile.file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(uploadFile.file.size / 1024 / 1024).toFixed(1)} MB
                      </p>
                      {uploadFile.status === 'uploading' && (
                        <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                          <div
                            className="bg-emerald-500 h-1 rounded-full transition-all"
                            style={{ width: `${uploadFile.progress}%` }}
                          />
                        </div>
                      )}
                      {uploadFile.error && (
                        <p className="text-xs text-red-500 mt-1">{uploadFile.error}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(uploadFile.status)}
                      {uploadFile.status === 'pending' && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeFile(uploadFile.id)}
                        >
                          ×
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload Summary */}
          {uploadFiles.length > 0 && (
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="text-sm text-gray-600">
                {successCount > 0 && <span className="text-emerald-600">{successCount} uploaded</span>}
                {pendingCount > 0 && <span className="text-gray-600">{pendingCount} pending</span>}
                {errorCount > 0 && <span className="text-red-600">{errorCount} failed</span>}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleClose}>
                  {successCount > 0 ? 'Done' : 'Cancel'}
                </Button>
                {pendingCount > 0 && (
                  <Button onClick={handleUploadAll} disabled={uploadDocument.isPending}>
                    Upload All
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
