import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  weight: string;
  image: string;
  category: string;
}

interface SiteContent {
  id: number;
  section: string;
  title: string;
  subtitle: string;
  content: string;
}

const PRODUCTS_API = 'https://functions.poehali.dev/1eb652a5-856d-4f01-8e9a-61d5146799ed';
const CONTENT_API = 'https://functions.poehali.dev/e1d76fb2-668a-41de-89e4-902b96e41dfb';

export default function Admin() {
  const [products, setProducts] = useState<Product[]>([]);
  const [contents, setContents] = useState<SiteContent[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingContent, setEditingContent] = useState<SiteContent | null>(null);
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadProducts();
    loadContents();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await fetch(PRODUCTS_API);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить товары",
        variant: "destructive"
      });
    }
  };

  const loadContents = async () => {
    try {
      const response = await fetch(CONTENT_API);
      const data = await response.json();
      setContents(data);
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить контент",
        variant: "destructive"
      });
    }
  };

  const saveProduct = async (product: Partial<Product>) => {
    try {
      const method = product.id ? 'PUT' : 'POST';
      const response = await fetch(PRODUCTS_API, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
      });

      if (response.ok) {
        toast({
          title: "Успешно",
          description: product.id ? "Товар обновлён" : "Товар добавлен"
        });
        loadProducts();
        setIsProductDialogOpen(false);
        setEditingProduct(null);
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить товар",
        variant: "destructive"
      });
    }
  };

  const saveContent = async (content: Partial<SiteContent>) => {
    try {
      const response = await fetch(CONTENT_API, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content)
      });

      if (response.ok) {
        toast({
          title: "Успешно",
          description: "Контент обновлён"
        });
        loadContents();
        setEditingContent(null);
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить контент",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-secondary text-secondary-foreground">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="text-2xl">🧀</div>
            <h1 className="text-2xl font-bold text-primary">SOBKO Admin</h1>
          </div>
          <Button variant="ghost" onClick={() => window.location.href = '/'}>
            <Icon name="Home" size={20} className="mr-2" />
            На сайт
          </Button>
        </div>
      </header>

      <div className="container py-8">
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="products">Товары</TabsTrigger>
            <TabsTrigger value="content">Контент</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold">Управление товарами</h2>
              <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => setEditingProduct(null)}>
                    <Icon name="Plus" size={18} className="mr-2" />
                    Добавить товар
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>
                      {editingProduct ? 'Редактировать товар' : 'Новый товар'}
                    </DialogTitle>
                  </DialogHeader>
                  <ProductForm
                    product={editingProduct}
                    onSave={saveProduct}
                    onCancel={() => {
                      setIsProductDialogOpen(false);
                      setEditingProduct(null);
                    }}
                  />
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map(product => (
                <Card key={product.id} className="overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{product.description}</p>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-primary font-bold">{product.price} ₽</span>
                      <span className="text-sm">{product.weight}</span>
                    </div>
                    <Button 
                      className="w-full" 
                      variant="outline"
                      onClick={() => {
                        setEditingProduct(product);
                        setIsProductDialogOpen(true);
                      }}
                    >
                      <Icon name="Edit" size={16} className="mr-2" />
                      Редактировать
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="content" className="space-y-4">
            <h2 className="text-3xl font-bold mb-6">Управление контентом сайта</h2>
            
            <div className="space-y-4">
              {contents.map(content => (
                <Card key={content.id}>
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span className="capitalize">{content.section}</span>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setEditingContent(content)}
                      >
                        <Icon name="Edit" size={16} className="mr-2" />
                        Редактировать
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm font-semibold">Заголовок:</span>
                        <p>{content.title}</p>
                      </div>
                      {content.subtitle && (
                        <div>
                          <span className="text-sm font-semibold">Подзаголовок:</span>
                          <p>{content.subtitle}</p>
                        </div>
                      )}
                      {content.content && (
                        <div>
                          <span className="text-sm font-semibold">Контент:</span>
                          <p className="text-sm text-muted-foreground">{content.content}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {editingContent && (
              <Dialog open={!!editingContent} onOpenChange={() => setEditingContent(null)}>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Редактировать секцию: {editingContent.section}</DialogTitle>
                  </DialogHeader>
                  <ContentForm
                    content={editingContent}
                    onSave={saveContent}
                    onCancel={() => setEditingContent(null)}
                  />
                </DialogContent>
              </Dialog>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function ProductForm({ 
  product, 
  onSave, 
  onCancel 
}: { 
  product: Product | null;
  onSave: (product: Partial<Product>) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    id: product?.id || 0,
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || 0,
    weight: product?.weight || '',
    image: product?.image || '',
    category: product?.category || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Название</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={e => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Описание</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={e => setFormData({ ...formData, description: e.target.value })}
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Цена (₽)</Label>
          <Input
            id="price"
            type="number"
            value={formData.price}
            onChange={e => setFormData({ ...formData, price: parseInt(e.target.value) })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="weight">Вес</Label>
          <Input
            id="weight"
            value={formData.weight}
            onChange={e => setFormData({ ...formData, weight: e.target.value })}
            placeholder="200г"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">URL изображения</Label>
        <Input
          id="image"
          value={formData.image}
          onChange={e => setFormData({ ...formData, image: e.target.value })}
          placeholder="https://..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Категория</Label>
        <Input
          id="category"
          value={formData.category}
          onChange={e => setFormData({ ...formData, category: e.target.value })}
          placeholder="soft, hard, blue..."
        />
      </div>

      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Отмена
        </Button>
        <Button type="submit">
          Сохранить
        </Button>
      </div>
    </form>
  );
}

function ContentForm({ 
  content, 
  onSave, 
  onCancel 
}: { 
  content: SiteContent;
  onSave: (content: Partial<SiteContent>) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    section: content.section,
    title: content.title,
    subtitle: content.subtitle,
    content: content.content
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Заголовок</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={e => setFormData({ ...formData, title: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="subtitle">Подзаголовок</Label>
        <Input
          id="subtitle"
          value={formData.subtitle}
          onChange={e => setFormData({ ...formData, subtitle: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Контент</Label>
        <Textarea
          id="content"
          value={formData.content}
          onChange={e => setFormData({ ...formData, content: e.target.value })}
          rows={6}
        />
      </div>

      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Отмена
        </Button>
        <Button type="submit">
          Сохранить
        </Button>
      </div>
    </form>
  );
}
