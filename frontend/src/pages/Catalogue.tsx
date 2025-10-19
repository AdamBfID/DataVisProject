import { useState, useEffect } from 'react';
import { ProductCard } from '../components/catalogue/ProductCard';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import { api } from '../services/api';

type Product = {
  product_name: string;
  brand: string;
  series: string;
  model: string;
  screen_size: number;
  screen_resolution: string;
  screen_type: string;
  cpu: string;
  gpu: string;
  ram: string;
  storage: string;
  os: string;
  price: number;
  image_url: string;
  product_url: string;
  tva_percentage: number;
  stock_quantity: number;
  buying_price: number;
  price_with_tva: number;
  profit_margin: number;
};

export function Catalogue() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [selectedGpu, setSelectedGpu] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');
  const [brands, setBrands] = useState<string[]>([]);
  const [gpus, setGpus] = useState<string[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await api.getProducts();
        setProducts(data);
        setFilteredProducts(data);

        // Extract unique brands and GPUs
        const uniqueBrands = Array.from(new Set(data.map((p: Product) => p.brand)));
        const uniqueGpus = Array.from(new Set(data.map((p: Product) => p.gpu)));
        setBrands(uniqueBrands);
        setGpus(uniqueGpus);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    let filtered = [...products];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.cpu.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.gpu.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Brand filter
    if (selectedBrand !== 'all') {
      filtered = filtered.filter((p) => p.brand === selectedBrand);
    }

    // GPU filter
    if (selectedGpu !== 'all') {
      filtered = filtered.filter((p) => p.gpu === selectedGpu);
    }

    // Sort
    switch (sortBy) {
      case 'name':
        filtered.sort((a, b) => a.product_name.localeCompare(b.product_name));
        break;
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'stock':
        filtered.sort((a, b) => b.stock_quantity - a.stock_quantity);
        break;
      case 'margin':
        filtered.sort((a, b) => b.profit_margin - a.profit_margin);
        break;
    }

    setFilteredProducts(filtered);
  }, [searchTerm, selectedBrand, selectedGpu, sortBy, products]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Product Catalogue</h1>
        <p className="text-gray-500">Browse all available products</p>
      </div>

      {/* Filters */}
      <div className="space-y-4">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search products..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline">
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Filters
          </Button>
        </div>

        <div className="flex flex-wrap gap-3">
          <Select value={selectedBrand} onValueChange={setSelectedBrand}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Brands" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Brands</SelectItem>
              {brands.map((brand) => (
                <SelectItem key={brand} value={brand}>
                  {brand}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedGpu} onValueChange={setSelectedGpu}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All GPUs" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All GPUs</SelectItem>
              {gpus.map((gpu) => (
                <SelectItem key={gpu} value={gpu}>
                  {gpu}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name (A-Z)</SelectItem>
              <SelectItem value="price-asc">Price (Low to High)</SelectItem>
              <SelectItem value="price-desc">Price (High to Low)</SelectItem>
              <SelectItem value="stock">Stock Quantity</SelectItem>
              <SelectItem value="margin">Profit Margin</SelectItem>
            </SelectContent>
          </Select>

          <div className="ml-auto flex items-center text-sm text-gray-600">
            <Filter className="mr-2 h-4 w-4" />
            {filteredProducts.length} products found
          </div>
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="flex h-64 items-center justify-center text-gray-500">
          No products found matching your criteria
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product, index) => (
            <ProductCard
              key={index}
              product={product}
              onViewDetails={() => {
                window.open(product.product_url, '_blank');
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}