import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Order } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Download, Check } from 'lucide-react';
import JSZip from 'jszip';
import { formatCurrency, formatDate } from '@/lib/utils';

const DownloadOrderHistory = () => {
  const [downloading, setDownloading] = useState(false);
  const [completed, setCompleted] = useState(false);

  const { data: orders } = useQuery<Order[]>({
    queryKey: ['/api/orders'],
  });

  const handleDownload = async () => {
    if (!orders) return;
    
    setDownloading(true);
    setCompleted(false);
    
    try {
      const zip = new JSZip();
      
      // Create a folder for orders
      const ordersFolder = zip.folder('coffee-shop-orders');
      
      // Add a summary file
      const summaryContent = [
        'Coffee Shop Order History',
        '=======================',
        '',
        'Generated on: ' + new Date().toLocaleString(),
        '',
        'Orders Summary:',
        `Total Orders: ${orders.length}`,
        '',
      ].join('\n');
      
      ordersFolder?.file('summary.txt', summaryContent);
      
      // Create a complete order list file
      const orderListContent = [
        'Complete Order History',
        '====================',
        '',
        ...orders.map(order => [
          `Order ID: ${order.id}`,
          `Date: ${order.created_at ? formatDate(order.created_at) : 'N/A'}`,
          `Customer Name: ${order.customer_name}`,
          `Customer Email: ${order.customer_email || 'N/A'}`,
          `Customer Phone: ${order.customer_phone || 'N/A'}`,
          `Pickup Location: ${order.pickup_location_id ? `Store #${order.pickup_location_id}` : 'N/A'}`,
          `Pickup Time: ${order.pickup_time ? formatDate(order.pickup_time) : 'N/A'}`,
          `Status: ${order.status}`,
          `Total: ${formatCurrency(order.total)}`,
          '-------------------------------------------',
          ''
        ].join('\n')),
      ].join('\n');
      
      ordersFolder?.file('order-history.txt', orderListContent);
      
      // Add individual order files
      orders.forEach(order => {
        const orderContent = [
          `Order #${order.id}`,
          '='.repeat(`Order #${order.id}`.length),
          '',
          `Date: ${order.created_at ? formatDate(order.created_at) : 'N/A'}`,
          `Status: ${order.status}`,
          '',
          'Customer Information:',
          `Name: ${order.customer_name}`,
          `Email: ${order.customer_email || 'N/A'}`,
          `Phone: ${order.customer_phone || 'N/A'}`,
          '',
          'Pickup Details:',
          `Location: ${order.pickup_location_id ? `Store #${order.pickup_location_id}` : 'N/A'}`,
          `Time: ${order.pickup_time ? formatDate(order.pickup_time) : 'N/A'}`,
          '',
          `Total: ${formatCurrency(order.total)}`,
        ].join('\n');
        
        ordersFolder?.file(`order-${order.id}.txt`, orderContent);
      });
      
      // JSON export for technical users
      ordersFolder?.file(
        'orders.json', 
        JSON.stringify(orders, null, 2)
      );
      
      // Generate the zip file
      const content = await zip.generateAsync({ type: 'blob' });
      
      // Create download link
      const url = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'coffee-shop-orders.zip';
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
      disabled={downloading || !orders || orders.length === 0}
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
          {downloading ? 'Preparing...' : 'Download Orders'}
        </>
      )}
    </Button>
  );
};

export default DownloadOrderHistory;