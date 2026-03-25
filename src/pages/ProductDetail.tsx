import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Sprout, ArrowLeft, ShoppingCart, Star } from "lucide-react";
import { toast } from "sonner";

const ProductDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0);
  const [product, setProduct] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    const farmerProducts = JSON.parse(localStorage.getItem("farmerProducts") || "[]");
    const allProducts = farmerProducts.map((p: any) => ({
      id: p.id,
      name: p.cropName,
      price: p.price,
      category: p.category,
      seller: p.farmerName,
      image: p.image,
      stock: "In Stock",
      quantity: p.quantity,
      description: p.description || `Fresh ${p.cropName} from ${p.farmerName}. Quantity available: ${p.quantity}. High quality produce.`,
      paymentNumber: p.paymentNumber,
      qrCode: p.qrCode,
    }));

    const foundProduct = allProducts.find((p: any) => p.id.toString() === id);
    if (foundProduct) {
      setProduct({
        ...foundProduct,
        specifications: [
          { label: "Quantity Available", value: foundProduct.quantity || "N/A" },
          { label: "Seller", value: foundProduct.seller },
          { label: "Category", value: foundProduct.category },
          { label: "Stock Status", value: foundProduct.stock },
          { label: "Payment Number", value: foundProduct.paymentNumber || "N/A" },
        ],
      });
    }

    // Load real reviews from localStorage
    const allReviews = JSON.parse(localStorage.getItem("productReviews") || "[]");
    const productReviews = allReviews.filter((r: any) => r.productId === id);
    setReviews(productReviews);
  }, [id]);

  const handleSubmitFeedback = () => {
    if (!feedback.trim()) {
      toast.error("Please enter your feedback");
      return;
    }
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    const customerName = localStorage.getItem("customerUsername") || "Customer";
    const newReview = {
      productId: id,
      author: customerName,
      rating,
      comment: feedback,
      date: new Date().toISOString().split("T")[0],
    };

    const allReviews = JSON.parse(localStorage.getItem("productReviews") || "[]");
    allReviews.push(newReview);
    localStorage.setItem("productReviews", JSON.stringify(allReviews));

    setReviews([...reviews, newReview]);
    setFeedback("");
    setRating(0);
    toast.success("Thank you for your feedback!");
  };

  const handleAddToCart = () => {
    if (!product) return;
    const cart = JSON.parse(localStorage.getItem("customerCart") || "[]");
    const existingItem = cart.find((item: any) => item.id === product.id);
    if (existingItem) {
      if (existingItem.quantity >= 10) {
        toast.error("Maximum 10 units per product allowed");
        return;
      }
      existingItem.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    localStorage.setItem("customerCart", JSON.stringify(cart));
    toast.success(`${product.name} added to cart!`);
  };

  const handleBuyNow = () => {
    if (!product) return;
    // Add to cart then go to payment
    const cart = JSON.parse(localStorage.getItem("customerCart") || "[]");
    const existingItem = cart.find((item: any) => item.id === product.id);
    if (!existingItem) {
      cart.push({ ...product, quantity: 1 });
    }
    localStorage.setItem("customerCart", JSON.stringify(cart));
    navigate("/customer-dashboard/payment");
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Product not found or no longer available</p>
          <Button onClick={() => navigate("/customer-dashboard/products")}>Back to Products</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sprout className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">Agriverse Market</span>
          </div>
          <Button variant="outline" onClick={() => navigate("/customer-dashboard/products")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Shop
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <div>
            <Card className="shadow-soft">
              <CardContent className="p-6">
                <div className="w-full h-96 overflow-hidden rounded-lg mb-6">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                </div>
                <div className="text-center">
                  <Badge className="mb-4">{product.stock}</Badge>
                  <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
                  <p className="text-muted-foreground mb-4">{product.category}</p>
                  <p className="text-5xl font-bold text-primary">₹{product.price}</p>
                </div>
                {product.qrCode && (
                  <div className="mt-4 flex justify-center">
                    <img src={product.qrCode} alt="Payment QR" className="w-32 h-32 object-contain border rounded" />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="shadow-soft">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">Product Description</h2>
                <p className="text-muted-foreground leading-relaxed">{product.description}</p>
              </CardContent>
            </Card>

            <Card className="shadow-soft">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">Product Details</h2>
                <dl className="space-y-3">
                  {product.specifications.map((spec: any, index: number) => (
                    <div key={index} className="flex justify-between border-b pb-2">
                      <dt className="font-medium">{spec.label}:</dt>
                      <dd className="text-muted-foreground">{spec.value}</dd>
                    </div>
                  ))}
                </dl>
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button className="flex-1" size="lg" onClick={handleBuyNow}>
                Buy Now
              </Button>
              <Button className="flex-1" variant="outline" size="lg" onClick={handleAddToCart}>
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart
              </Button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <Card className="shadow-soft mb-8">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-6">Customer Reviews ({reviews.length})</h2>
            {reviews.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No reviews yet. Be the first to review this product!</p>
            ) : (
              <div className="space-y-6">
                {reviews.map((review, index) => (
                  <div key={index} className="border-b pb-4 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold">{review.author}</p>
                      <div className="flex gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`h-4 w-4 ${i < review.rating ? "fill-secondary text-secondary" : "text-muted-foreground"}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-muted-foreground text-sm mb-2">{review.comment}</p>
                    <p className="text-xs text-muted-foreground">{review.date}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Add Review */}
        <Card className="shadow-soft">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-4">Add Your Review</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-2">Your Rating</p>
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-6 w-6 cursor-pointer transition-colors ${i < rating ? "fill-secondary text-secondary" : "text-muted-foreground hover:text-secondary"}`}
                      onClick={() => setRating(i + 1)}
                    />
                  ))}
                </div>
              </div>
              <Textarea
                placeholder="Share your experience with this product..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={5}
              />
              <Button onClick={handleSubmitFeedback}>Submit Review</Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ProductDetail;
