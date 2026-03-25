import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Cart = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [cartItems, setCartItems] = useState<any[]>([]);

  // Load cart from localStorage
  const loadCart = () => {
    const cart = JSON.parse(localStorage.getItem("customerCart") || "[]");
    setCartItems(cart);
  };

  useEffect(() => {
    loadCart();
    
    // Auto-refresh cart every 2 seconds
    const interval = setInterval(() => {
      loadCart();
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

  const updateQuantity = (id: number | string, newQuantity: number) => {
    if (newQuantity < 1) return;
    if (newQuantity > 10) {
      toast({
        title: "Quantity Limit Reached",
        description: "Maximum 10 units per product allowed",
        variant: "destructive"
      });
      return;
    }
    
    const updatedCart = cartItems.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedCart);
    localStorage.setItem("customerCart", JSON.stringify(updatedCart));
  };

  const removeItem = (id: number | string) => {
    const updatedCart = cartItems.filter(item => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem("customerCart", JSON.stringify(updatedCart));
    toast({
      title: "Item Removed",
      description: "Product has been removed from cart",
    });
  };

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Shopping Cart</h1>
        <p className="text-muted-foreground">Review your items before checkout</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cart Items ({cartItems.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cartItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <span className="font-medium">{item.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>₹{item.price}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        -
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div>
            <p className="text-2xl font-bold">Total: ₹{total.toFixed(2)}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate("/customer-dashboard/products")}>
              Continue Shopping
            </Button>
            <Button onClick={() => navigate("/customer-dashboard/payment")}>
              Proceed to Payment
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Cart;
