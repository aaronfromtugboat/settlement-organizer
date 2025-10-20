import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/queryClient'
import { Router, Route } from 'wouter'
import { Navigation } from '@/components/Navigation'
import { Home } from '@/pages/Home'
import { PaymentsView } from '@/pages/PaymentsView'
import { DocumentsView } from '@/pages/DocumentsView'
import { CoveragePaymentsView } from '@/pages/CoveragePaymentsView'
import { AllCoveragesView } from '@/pages/AllCoveragesView'
import { PersonalPropertyView } from '@/pages/PersonalPropertyView'
import { RebuildView } from '@/pages/RebuildView'

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen">
          <Navigation />
          <Route path="/" component={Home} />
          <Route path="/all-coverages" component={AllCoveragesView} />
          <Route path="/rebuild" component={RebuildView} />
          <Route path="/personal-property" component={PersonalPropertyView} />
          <Route path="/payments" component={PaymentsView} />
          <Route path="/payments/:coverage" component={({ params }) => 
            <CoveragePaymentsView coverageType={params.coverage as any} />
          } />
          <Route path="/documents" component={DocumentsView} />
        </div>
      </Router>
    </QueryClientProvider>
  )
}

export default App

