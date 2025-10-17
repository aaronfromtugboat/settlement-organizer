import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { DocumentUpload } from '@/components/DocumentUpload'
import { Upload, CreditCard, FileText } from 'lucide-react'
import InsuranceSettlementReport from '@/components/InsuranceSettlementReport'

export function Home() {
  const [uploadOpen, setUploadOpen] = useState(false)

  return (
    <>
      <InsuranceSettlementReport />
      
      {/* Action Buttons */}
      <div className="mx-auto max-w-6xl px-6 pb-8">
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => setUploadOpen(true)}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700"
            size="lg"
          >
            <Upload className="w-5 h-5" />
            Upload Payment Document
          </Button>
          
          <Button
            asChild
            variant="outline"
            size="lg"
            className="flex items-center gap-2"
          >
            <a href="/payments">
              <CreditCard className="w-5 h-5" />
              View All Payments
            </a>
          </Button>
          
          <Button
            asChild
            variant="outline"
            size="lg"
            className="flex items-center gap-2"
          >
            <a href="/documents">
              <FileText className="w-5 h-5" />
              View Documents
            </a>
          </Button>
        </div>
      </div>

      <DocumentUpload open={uploadOpen} onOpenChange={setUploadOpen} />
    </>
  )
}
