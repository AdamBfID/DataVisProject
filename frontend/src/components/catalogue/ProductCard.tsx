import { Card, CardContent, CardFooter } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { ShoppingCart, Eye } from 'lucide-react';

interface ProductCardProps {
  product: {
    product_name: string;
    brand: string;
    price: number;
    price_with_tva: number;
    stock_quantity: number;
    profit_margin: number;
    image_url: string;
    cpu: string;
    gpu: string;
    ram: string;
    storage: string;
  };
  onViewDetails?: () => void;
}

export function ProductCard({ product, onViewDetails }: ProductCardProps) {
  const isOutOfStock = product.stock_quantity === 0;
  const isLowStock = product.stock_quantity > 0 && product.stock_quantity < 10;

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img
          src={product.image_url}
          alt={product.product_name}
          className="h-full w-full object-cover transition-transform hover:scale-105"
          onError={(e) => {
            e.currentTarget.src = 'https://via.placeholder.com/400x400?text=No+Image';
          }}
        />
        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
            <Badge variant="destructive" className="text-lg">
              Out of Stock
            </Badge>
          </div>
        )}
        {isLowStock && (
          <Badge variant="secondary" className="absolute right-2 top-2">
            Low Stock: {product.stock_quantity}
          </Badge>
        )}
      </div>
      
      <CardContent className="p-4">
        <div className="mb-2">
          <Badge variant="outline" className="mb-2">
            {product.brand}
          </Badge>
          <h3 className="line-clamp-2 text-sm font-semibold leading-tight">
            {product.product_name}
          </h3>
        </div>

        <div className="space-y-1 text-xs text-gray-600">
          <div className="flex items-center justify-between">
            <span>CPU:</span>
            <span className="font-medium text-gray-900">{product.cpu}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>GPU:</span>
            <span className="font-medium text-gray-900">{product.gpu}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>RAM:</span>
            <span className="font-medium text-gray-900">{product.ram}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Storage:</span>
            <span className="font-medium text-gray-900">{product.storage}</span>
          </div>
        </div>

        <div className="mt-4 border-t pt-3">
          <div className="flex items-baseline justify-between">
            <div>
              <p className="text-xs text-gray-500">Price (HT)</p>
              <p className="text-lg font-bold">{product.price.toLocaleString()} DT</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Price (TTC)</p>
              <p className="text-sm font-semibold text-gray-700">
                {product.price_with_tva.toLocaleString()} DT
              </p>
            </div>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-gray-500">Margin:</span>
            <span className="font-semibold text-green-600">
              {product.profit_margin.toFixed(2)}%
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex gap-2 border-t bg-gray-50 p-3">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={onViewDetails}
        >
          <Eye className="mr-2 h-4 w-4" />
          Details
        </Button>
        <Button
          size="sm"
          className="flex-1"
          disabled={isOutOfStock}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          {isOutOfStock ? 'Unavailable' : 'Add to Cart'}
        </Button>
      </CardFooter>
    </Card>
  );
}