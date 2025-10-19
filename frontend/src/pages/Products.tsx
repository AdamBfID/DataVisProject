import { DataTable } from '../components/dashboard/DataTable';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Search, Plus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { api } from '../services/api';

type Product = {
  product_name: string;
  brand: string;
  cpu: string;
  gpu: string;
  price: number;
  stock_quantity: number;
  profit_margin: number;
};

export function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await api.getProducts();
        setProducts(data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleSearch = async () => {
    if (searchTerm.trim()) {
      try {
        const results = await api.searchProducts(searchTerm);
        setProducts(results);
      } catch (error) {
        console.error('Search failed:', error);
      }
    } else {
      // Reload all products if search is empty
      const data = await api.getProducts();
      setProducts(data);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-gray-500">Manage your product inventory</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      <div className="relative w-96 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search products..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <Button onClick={handleSearch}>Search</Button>
      </div>

      <DataTable
        title="All Products"
        columns={[
          { key: 'product_name', header: 'Product Name' },
          { key: 'brand', header: 'Brand' },
          { key: 'cpu', header: 'CPU' },
          { key: 'gpu', header: 'GPU' },
          {
            key: 'price',
            header: 'Price',
            render: (value) => `${value.toLocaleString()} DT`,
          },
          {
            key: 'stock_quantity',
            header: 'Stock',
            render: (value) => (
              <Badge variant={value === 0 ? 'destructive' : value < 10 ? 'secondary' : 'default'}>
                {value} units
              </Badge>
            ),
          },
          {
            key: 'profit_margin',
            header: 'Margin',
            render: (value) => `${value.toFixed(2)}%`,
          },
        ]}
        data={products}
      />
    </div>
  );
}