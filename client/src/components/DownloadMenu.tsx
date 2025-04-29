import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Product, Category } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Download, Check } from 'lucide-react';
import JSZip from 'jszip';
import { formatCurrency } from '@/lib/utils';

const DownloadMenu = () => {
  const [downloading, setDownloading] = useState(false);
  const [completed, setCompleted] = useState(false);

  const { data: products } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });

  const { data: categories } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  const handleDownload = async () => {
    if (!products || !categories) return;
    
    setDownloading(true);
    setCompleted(false);
    
    try {
      const zip = new JSZip();
      
      // Create a folder for menu items
      const menuFolder = zip.folder('coffee-shop-menu');
      
      // Add a summary file
      const summaryContent = [
        'Coffee Shop Menu',
        '==============',
        '',
        'Generated on: ' + new Date().toLocaleString(),
        '',
        'Categories:',
        ...categories.map(category => `- ${category.name}`),
        '',
        'Products Summary:',
        `Total Products: ${products.length}`,
        '',
      ].join('\n');
      
      menuFolder?.file('summary.txt', summaryContent);
      
      // Create individual category files
      categories.forEach(category => {
        const categoryProducts = products.filter(p => p.category_id === category.id);
        const categoryContent = [
          `Category: ${category.name}`,
          '='.repeat(category.name.length + 10),
          category.description || '',
          '',
          'Products:',
          '',
          ...categoryProducts.map(product => [
            `${product.name} - ${formatCurrency(product.price)}`,
            `${product.description || 'No description'}`,
            `Featured: ${product.featured ? 'Yes' : 'No'}`,
            `Available: ${product.available ? 'Yes' : 'No'}`,
            ''
          ].join('\n')),
        ].join('\n');
        
        menuFolder?.file(`category-${category.id}-${category.name}.txt`, categoryContent);
      });
      
      // Create a complete product list file
      const productListContent = [
        'Complete Product List',
        '===================',
        '',
        ...products.map(product => [
          `Product ID: ${product.id}`,
          `Name: ${product.name}`,
          `Price: ${formatCurrency(product.price)}`,
          `Category: ${categories.find(c => c.id === product.category_id)?.name || 'Unknown'}`,
          `Description: ${product.description || 'No description'}`,
          `Featured: ${product.featured ? 'Yes' : 'No'}`,
          `Available: ${product.available ? 'Yes' : 'No'}`,
          ''
        ].join('\n')),
      ].join('\n');
      
      menuFolder?.file('product-list.txt', productListContent);
      
      // JSON export for technical users
      menuFolder?.file(
        'products.json', 
        JSON.stringify(products, null, 2)
      );
      
      menuFolder?.file(
        'categories.json', 
        JSON.stringify(categories, null, 2)
      );
      
      // Generate the zip file
      const content = await zip.generateAsync({ type: 'blob' });
      
      // Create download link
      const url = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'coffee-shop-menu.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 100);
      
      setCompleted(true);
    } catch (error) {
      console.error('Error creating zip file:', error);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Button 
      onClick={handleDownload}
      disabled={downloading || !products || !categories}
      className="ml-2"
      variant={completed ? "outline" : "default"}
    >
      {completed ? (
        <>
          <Check className="h-4 w-4 mr-2" />
          Downloaded
        </>
      ) : (
        <>
          <Download className="h-4 w-4 mr-2" />
          {downloading ? 'Preparing...' : 'Download Menu'}
        </>
      )}
    </Button>
  );
};

export default DownloadMenu;