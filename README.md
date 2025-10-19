# MegaPC Admin Dashboard

A modern, minimalistic admin dashboard for managing PC inventory and sales analytics.
here a short video demo:



https://github.com/user-attachments/assets/4b656f4b-1506-48e4-a04d-a7dbbec513c0






##  Features

- **Dashboard**: Overview of sales, revenue, and profit metrics
- **Analytics**: Detailed analytics with interactive charts (daily, weekly, monthly, hourly)
- **Catalogue**: Visual product catalogue with filtering and sorting
- **Products**: Complete product inventory management
- **Sales**: Sales tracking and transaction history
- **Settings**: Application and user settings

##  Tech Stack

### Frontend
- React 18
- TypeScript
- Vite
- React Router
- Recharts (for data visualization)
- Tailwind CSS
- shadcn/ui components
- Lucide React (icons)

### Backend
- FastAPI
- Python 3.8+
- Pandas (data processing)
- Uvicorn (ASGI server)

##  Installation

### Prerequisites
- Node.js 18+ and npm
- Python 3.8+
- pip

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run the backend server:
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at:
- API: http://localhost:8000
- API Docs: http://localhost:8000/docs
- OpenAPI Spec: http://localhost:8000/openapi.json

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

The application will be available at http://localhost:5173

##  Data Files

Place your CSV files in the `backend/data/` directory:
- `megapc_products_updated.csv` - Product inventory data
- `sales_data.csv` - Sales transaction data

##  Project Structure

```
Stockpc/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── routes/
│   │   │       ├── analytics.py
│   │   │       ├── dashboard.py
│   │   │       ├── products.py
│   │   │       └── sales.py
│   │   ├── db/
│   │   │   └── database.py
│   │   ├── models/
│   │   │   ├── product.py
│   │   │   └── sale.py
│   │   ├── services/
│   │   │   ├── analytics_service.py
│   │   │   ├── product_service.py
│   │   │   └── sales_service.py
│   │   ├── utils/
│   │   │   └── csv_loader.py
│   │   └── main.py
│   ├── data/
│   │   ├── megapc_products_updated.csv
│   │   └── sales_data.csv
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── catalogue/
    │   │   ├── charts/
    │   │   ├── dashboard/
    │   │   ├── layout/
    │   │   └── ui/
    │   ├── pages/
    │   │   ├── Analytics.tsx
    │   │   ├── Catalogue.tsx
    │   │   ├── Dashboard.tsx
    │   │   ├── Products.tsx
    │   │   ├── Sales.tsx
    │   │   └── Settings.tsx
    │   ├── services/
    │   │   └── api.ts
    │   ├── types/
    │   │   └── index.ts
    │   ├── App.tsx
    │   └── main.tsx
    └── package.json
```

##  API Endpoints

### Dashboard
- `GET /api/dashboard` - Get dashboard overview data

### Products
- `GET /api/products` - Get all products
- `GET /api/products/search?q={query}` - Search products
- `GET /api/products/brands` - Get all brands
- `GET /api/products/low-stock?threshold={num}` - Get low stock products
- `GET /api/products/stats` - Get product statistics

### Sales
- `GET /api/sales` - Get all sales
- `GET /api/sales/recent?days={num}` - Get recent sales
- `GET /api/sales/summary` - Get sales summary
- `GET /api/sales/today` - Get today's sales
- `GET /api/sales/top-products?limit={num}` - Get top selling products

### Analytics
- `GET /api/analytics/daily?days={num}` - Get daily analytics
- `GET /api/analytics/monthly` - Get monthly analytics
- `GET /api/analytics/weekly` - Get weekly analytics
- `GET /api/analytics/hourly` - Get hourly analytics
- `GET /api/analytics/brands` - Get brand performance
- `GET /api/analytics/gpu` - Get GPU analytics
- `GET /api/analytics/cpu` - Get CPU analytics

##  Design

- Minimalistic black and white theme
- Modern, clean interface
- Responsive design
- Interactive charts and visualizations

##  License

MIT

## 👥 Contributors

- Adam (@AdamBfID)
