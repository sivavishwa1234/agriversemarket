import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Package, Trash2, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import fingerMilletImg from "@/assets/crops/finger-millet.jpg";
import pearlMilletImg from "@/assets/crops/pearl-millet.jpg";
import foxtailMilletImg from "@/assets/crops/foxtail-millet.jpg";
import kodoMilletImg from "@/assets/crops/kodo-millet.jpg";
import sorghumImg from "@/assets/crops/sorghum.jpg";
import sesameImg from "@/assets/crops/sesame.jpg";
import sunflowerImg from "@/assets/crops/sunflower.jpg";
import safflowerImg from "@/assets/crops/safflower.jpg";
import groundnutImg from "@/assets/crops/groundnut.jpg";
import horseGramImg from "@/assets/crops/horse-gram.jpg";
import greenGramImg from "@/assets/crops/green-gram.jpg";
import blackGramImg from "@/assets/crops/black-gram.jpg";
import pigeonPeaImg from "@/assets/crops/pigeon-pea.jpg";
import amaranthImg from "@/assets/crops/amaranth.jpg";
import buckwheatImg from "@/assets/crops/buckwheat.jpg";
import moringaImg from "@/assets/crops/moringa.jpg";
import okraImg from "@/assets/crops/okra.jpg";
import clusterBeanImg from "@/assets/crops/cluster-bean.jpg";
import heritageRiceImg from "@/assets/crops/heritage-rice.jpg";
import kharchiaWheatImg from "@/assets/crops/kharchia-wheat.jpg";

const cropImages: Record<string, string> = {
  "Finger Millet": fingerMilletImg,
  "Pearl Millet": pearlMilletImg,
  "Foxtail Millet": foxtailMilletImg,
  "Kodo Millet": kodoMilletImg,
  "Sorghum": sorghumImg,
  "Sesame": sesameImg,
  "Sunflower": sunflowerImg,
  "Safflower": safflowerImg,
  "Groundnut": groundnutImg,
  "Horse Gram": horseGramImg,
  "Green Gram": greenGramImg,
  "Black Gram": blackGramImg,
  "Pigeon Pea": pigeonPeaImg,
  "Amaranth": amaranthImg,
  "Buckwheat": buckwheatImg,
  "Moringa": moringaImg,
  "Okra": okraImg,
  "Cluster Bean": clusterBeanImg,
  "Heritage Rice": heritageRiceImg,
  "Kharchia Wheat": kharchiaWheatImg,
};

interface Product {
  id: string;
  cropName: string;
  quantity: string;
  price: number;
  description: string;
  category: string;
  farmerName: string;
  image: string;
  dateAdded: string;
  qrCode?: string;
  paymentNumber?: string;
}

const SellProducts = () => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [myProducts, setMyProducts] = useState<Product[]>([]);
  const [farmerName, setFarmerName] = useState("");
  
  const [newProduct, setNewProduct] = useState({
    cropName: "",
    quantity: "",
    price: "",
    description: "",
    category: "Grains",
    customImage: "",
    useCustomProduct: false,
    qrCode: "",
    paymentNumber: ""
  });
  
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  useEffect(() => {
    const username = localStorage.getItem("farmerUsername") || "Farmer";
    setFarmerName(username);
    
    // Load farmer's products from localStorage
    const allProducts = JSON.parse(localStorage.getItem("farmerProducts") || "[]");
    const farmerProducts = allProducts.filter((p: Product) => p.farmerName === username);
    setMyProducts(farmerProducts);
  }, []);

  const handleQRCodeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProduct({ ...newProduct, qrCode: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditQRCodeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editingProduct) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingProduct({ ...editingProduct, qrCode: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProduct = () => {
    if (!newProduct.cropName || !newProduct.quantity || !newProduct.price || !newProduct.paymentNumber) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields including payment number",
        variant: "destructive"
      });
      return;
    }

    if (newProduct.useCustomProduct && !newProduct.customImage) {
      toast({
        title: "Missing Image URL",
        description: "Please provide an image URL for your custom product",
        variant: "destructive"
      });
      return;
    }

    const product: Product = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      cropName: newProduct.cropName,
      quantity: newProduct.quantity,
      price: parseFloat(newProduct.price),
      description: newProduct.description,
      category: newProduct.category,
      farmerName: farmerName,
      image: newProduct.useCustomProduct ? newProduct.customImage : (cropImages[newProduct.cropName] || cropImages["Finger Millet"]),
      dateAdded: new Date().toISOString(),
      qrCode: newProduct.qrCode,
      paymentNumber: newProduct.paymentNumber
    };

    // Save to localStorage
    const allProducts = JSON.parse(localStorage.getItem("farmerProducts") || "[]");
    allProducts.push(product);
    localStorage.setItem("farmerProducts", JSON.stringify(allProducts));
    
    setMyProducts([...myProducts, product]);
    setNewProduct({ cropName: "", quantity: "", price: "", description: "", category: "Grains", customImage: "", useCustomProduct: false, qrCode: "", paymentNumber: "" });
    setIsDialogOpen(false);
    
    toast({
      title: "Product Listed Successfully",
      description: `${product.cropName} is now available for customers to purchase`,
    });
  };

  const handleUpdateProduct = () => {
    if (!editingProduct) return;

    const allProducts = JSON.parse(localStorage.getItem("farmerProducts") || "[]");
    const updatedProducts = allProducts.map((p: Product) => 
      p.id === editingProduct.id ? editingProduct : p
    );
    localStorage.setItem("farmerProducts", JSON.stringify(updatedProducts));
    
    setMyProducts(myProducts.map(p => p.id === editingProduct.id ? editingProduct : p));
    setIsEditDialogOpen(false);
    setEditingProduct(null);
    
    toast({
      title: "Product Updated",
      description: "Product details have been updated successfully",
    });
  };

  const handleRemoveProduct = (productId: string) => {
    const allProducts = JSON.parse(localStorage.getItem("farmerProducts") || "[]");
    const updatedProducts = allProducts.filter((p: Product) => p.id !== productId);
    localStorage.setItem("farmerProducts", JSON.stringify(updatedProducts));
    
    setMyProducts(myProducts.filter(p => p.id !== productId));
    
    toast({
      title: "Product Removed",
      description: "Product has been removed from marketplace",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Sell My Products</h2>
          <p className="text-muted-foreground">List your harvested crops for sale to customers</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 shadow-glow">
              <Plus className="h-4 w-4" />
              List Product for Sale
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>List New Product</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Product Type</Label>
                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant={!newProduct.useCustomProduct ? "default" : "outline"}
                    onClick={() => setNewProduct({ ...newProduct, useCustomProduct: false, customImage: "" })}
                    className="flex-1"
                  >
                    Preset Crops
                  </Button>
                  <Button
                    type="button"
                    variant={newProduct.useCustomProduct ? "default" : "outline"}
                    onClick={() => setNewProduct({ ...newProduct, useCustomProduct: true, cropName: "" })}
                    className="flex-1"
                  >
                    Custom Product
                  </Button>
                </div>
              </div>

              {!newProduct.useCustomProduct ? (
                <div className="space-y-2">
                  <Label htmlFor="cropName">Crop/Product Name *</Label>
                  <Select onValueChange={(value) => setNewProduct({ ...newProduct, cropName: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select crop variety" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(cropImages).map((crop) => (
                        <SelectItem key={crop} value={crop}>{crop}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="customName">Product Name *</Label>
                    <Input
                      id="customName"
                      placeholder="e.g., Organic Apples, Fresh Mangoes"
                      value={newProduct.cropName}
                      onChange={(e) => setNewProduct({ ...newProduct, cropName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="imageUrl">Product Image URL *</Label>
                    <Input
                      id="imageUrl"
                      placeholder="https://example.com/image.jpg"
                      value={newProduct.customImage}
                      onChange={(e) => setNewProduct({ ...newProduct, customImage: e.target.value })}
                    />
                    <p className="text-xs text-muted-foreground">Enter a direct link to your product image</p>
                  </div>
                </>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={newProduct.category} onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Grains">Grains</SelectItem>
                    <SelectItem value="Vegetables">Vegetables</SelectItem>
                    <SelectItem value="Pulses">Pulses</SelectItem>
                    <SelectItem value="Oilseeds">Oilseeds</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity Available *</Label>
                <Input
                  id="quantity"
                  placeholder="e.g., 500 kg, 2 tons"
                  value={newProduct.quantity}
                  onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="price">Price per kg (₹) *</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="e.g., 45.99"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Product Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your product quality, organic certification, etc."
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentNumber">GPay/Paytm Number *</Label>
                <Input
                  id="paymentNumber"
                  placeholder="e.g., 9876543210"
                  value={newProduct.paymentNumber}
                  onChange={(e) => setNewProduct({ ...newProduct, paymentNumber: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="qrCode">Upload QR Code (Optional)</Label>
                <Input
                  id="qrCode"
                  type="file"
                  accept="image/*"
                  onChange={handleQRCodeUpload}
                />
                {newProduct.qrCode && (
                  <div className="mt-2">
                    <img src={newProduct.qrCode} alt="QR Code Preview" className="w-32 h-32 object-contain border rounded" />
                  </div>
                )}
              </div>
              
              <Button onClick={handleAddProduct} className="w-full">
                List Product
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            My Listed Products ({myProducts.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {myProducts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No products listed yet. Start by adding your harvested crops!</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Price/kg</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Date Listed</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {myProducts.map((product) => (
                  <TableRow key={product.id} className="hover:bg-primary/5">
                    <TableCell className="font-medium">{product.cropName}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>{product.quantity}</TableCell>
                    <TableCell className="text-primary font-semibold">₹{product.price}</TableCell>
                    <TableCell>{product.paymentNumber || "N/A"}</TableCell>
                    <TableCell>{new Date(product.dateAdded).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => {
                            setEditingProduct(product);
                            setIsEditDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4 text-primary" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleRemoveProduct(product.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit Product Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          {editingProduct && (
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="editPaymentNumber">GPay/Paytm Number *</Label>
                <Input
                  id="editPaymentNumber"
                  placeholder="e.g., 9876543210"
                  value={editingProduct.paymentNumber || ""}
                  onChange={(e) => setEditingProduct({ ...editingProduct, paymentNumber: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="editQrCode">Upload QR Code</Label>
                <Input
                  id="editQrCode"
                  type="file"
                  accept="image/*"
                  onChange={handleEditQRCodeUpload}
                />
                {editingProduct.qrCode && (
                  <div className="mt-2">
                    <img src={editingProduct.qrCode} alt="QR Code" className="w-32 h-32 object-contain border rounded" />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="editPrice">Price per kg (₹) *</Label>
                <Input
                  id="editPrice"
                  type="number"
                  value={editingProduct.price}
                  onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) || 0 })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="editQuantity">Quantity Available *</Label>
                <Input
                  id="editQuantity"
                  value={editingProduct.quantity}
                  onChange={(e) => setEditingProduct({ ...editingProduct, quantity: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="editDescription">Product Description</Label>
                <Textarea
                  id="editDescription"
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                />
              </div>

              <Button onClick={handleUpdateProduct} className="w-full">
                Update Product
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SellProducts;
