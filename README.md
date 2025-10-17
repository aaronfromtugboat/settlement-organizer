# Settlement Organizer

A modern web application to help policyholders track insurance settlement coverage for total loss claims. Replace complex spreadsheets with an intuitive interface that calculates remaining coverage, tracks payments, and manages documentation.

## Features

- **Policy Overview Dashboard**: View total coverage, payments, and remaining balance at a glance
- **Coverage Breakdown**: Detailed table showing all coverage types with utilization status
- **Payment Timeline**: Chronological tracking of payment checkpoints with date-based organization
- **Calculated Summaries**: Automatic aggregation of coverage categories (debris removal, rebuild costs, etc.)
- **Document Management**: Upload and link payment documentation (EOBs, checks, disbursement letters)
- **Complex Calculations**: Mirrors spreadsheet logic for debris removal totals, extended limits, and total available coverage

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui (Radix UI components)
- **Backend**: Cloudflare Pages Functions
- **Database**: Cloudflare D1 (SQLite)
- **Storage**: Cloudflare R2
- **State Management**: TanStack Query (React Query)

## Development Setup

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Cloudflare account
- Wrangler CLI (`npm install -g wrangler`)

### Local Development

1. **Clone and install dependencies**:
   ```bash
   cd Settlement_Organizer
   npm install
   ```

2. **Login to Cloudflare**:
   ```bash
   wrangler login
   ```

3. **Create D1 Database**:
   ```bash
   wrangler d1 create settlement-organizer-db
   ```
   
   Copy the database ID from the output and update `wrangler.toml`:
   ```toml
   [[d1_databases]]
   binding = "DB"
   database_name = "settlement-organizer-db"
   database_id = "YOUR_DATABASE_ID_HERE"
   ```

4. **Run database migrations**:
   ```bash
   wrangler d1 execute settlement-organizer-db --file=./migrations/001_init_schema.sql
   ```

5. **Create R2 Bucket**:
   ```bash
   wrangler r2 bucket create settlement-organizer-documents
   ```

6. **Start development server**:
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`

## Deployment

### GitHub Repository Setup

1. **Create a new GitHub repository**
2. **Push your code**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Settlement Organizer"
   git remote add origin https://github.com/YOUR_USERNAME/settlement-organizer.git
   git push -u origin main
   ```

### Cloudflare Pages Setup

1. **Log in to Cloudflare Dashboard**
2. **Navigate to Pages** → **Create a project** → **Connect to Git**
3. **Select your repository**: `settlement-organizer`
4. **Configure build settings**:
   - **Framework preset**: None
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: (leave empty)

5. **Add environment bindings** in Cloudflare Pages settings:
   - Go to **Settings** → **Functions** → **Bindings**
   - Add **D1 Database** binding:
     - Variable name: `DB`
     - D1 database: `settlement-organizer-db`
   - Add **R2 Bucket** binding:
     - Variable name: `DOCUMENTS`
     - R2 bucket: `settlement-organizer-documents`

6. **Deploy**: Push to main branch triggers automatic deployment

### Production Database Setup

Run migrations against production database:
```bash
wrangler d1 execute settlement-organizer-db --remote --file=./migrations/001_init_schema.sql
```

## Project Structure

```
Settlement_Organizer/
├── src/
│   ├── components/
│   │   ├── ui/                    # shadcn/ui components
│   │   ├── PolicyOverview.tsx     # Dashboard overview cards
│   │   ├── CoverageTable.tsx      # Coverage details table
│   │   ├── PaymentTimeline.tsx    # Payment history timeline
│   │   └── SummaryPanel.tsx       # Aggregated coverage summary
│   ├── hooks/
│   │   ├── usePolicy.ts           # Policy data hooks
│   │   ├── usePayments.ts         # Payment data hooks
│   │   └── useDocuments.ts        # Document upload hooks
│   ├── lib/
│   │   ├── calculations.ts        # Coverage calculation engine
│   │   ├── utils.ts               # Utility functions
│   │   └── queryClient.ts         # React Query setup
│   ├── types/
│   │   └── schema.ts              # TypeScript types
│   ├── App.tsx                    # Main app component
│   └── main.tsx                   # Entry point
├── functions/
│   └── api/
│       ├── policy.js              # Policy CRUD operations
│       ├── payments.js            # Payment operations
│       └── documents.js           # File upload/download
├── migrations/
│   └── 001_init_schema.sql        # Database schema
├── index.html                     # HTML entry point
├── vite.config.ts                 # Vite configuration
├── tailwind.config.ts             # Tailwind CSS config
└── wrangler.toml                  # Cloudflare configuration
```

## Key Calculations

The application replicates complex spreadsheet calculations:

- **Debris Removal Total**: Sum of dwelling, other structures, and personal property debris limits
- **Rebuild Dwelling**: Dwelling limit + building codes coverage + extended dwelling limits
- **Rebuild Other Structures**: Other structures + extended limits
- **Personal Property**: Personal property + personal property options
- **Total Available**: Aggregate of all remaining coverages if fully exhausted

## Usage

1. **View Policy**: Dashboard shows policy overview with key metrics
2. **Track Coverage**: Coverage table displays all limits, payments, and remaining amounts
3. **Add Payments**: Create payment checkpoints with date and coverage allocation
4. **Upload Documents**: Attach payment evidence (EOBs, checks) to specific payments
5. **Monitor Progress**: Summary panel shows calculated totals across coverage categories

## Contributing

This is a specialized insurance tracking tool. For feature requests or bug reports, please open an issue.

## License

ISC

