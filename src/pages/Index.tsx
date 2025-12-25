import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
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

interface CartItem extends Product {
  quantity: number;
}

const products: Product[] = [
  {
    id: 1,
    name: 'Камамбер',
    description: 'Мягкий сыр с нежной плесневой корочкой',
    price: 890,
    weight: '200г',
    image: 'https://cdn.poehali.dev/projects/40e54eb3-e9e5-456d-b5ae-d343fa5b8727/files/7f6e72ed-ae7e-482f-b041-f7c06c6954f4.jpg',
    category: 'soft'
  },
  {
    id: 2,
    name: 'Пармезан выдержанный',
    description: 'Твёрдый сыр 24 месяца выдержки',
    price: 1290,
    weight: '250г',
    image: 'https://cdn.poehali.dev/projects/40e54eb3-e9e5-456d-b5ae-d343fa5b8727/files/f8435276-2ccb-4f41-a4fc-10d5e5788bad.jpg',
    category: 'hard'
  },
  {
    id: 3,
    name: 'Моцарелла буффало',
    description: 'Свежий сыр из молока буйволиц',
    price: 750,
    weight: '150г',
    image: 'https://cdn.poehali.dev/projects/40e54eb3-e9e5-456d-b5ae-d343fa5b8727/files/a2bc09bb-62ec-46b0-bc5f-0fbd4d3e9542.jpg',
    category: 'soft'
  },
  {
    id: 4,
    name: 'Рокфор',
    description: 'Сыр с благородной голубой плесенью',
    price: 990,
    weight: '180г',
    image: 'https://cdn.poehali.dev/projects/40e54eb3-e9e5-456d-b5ae-d343fa5b8727/files/7f6e72ed-ae7e-482f-b041-f7c06c6954f4.jpg',
    category: 'blue'
  },
  {
    id: 5,
    name: 'Гауда',
    description: 'Полутвёрдый сыр с ореховым вкусом',
    price: 690,
    weight: '200г',
    image: 'https://cdn.poehali.dev/projects/40e54eb3-e9e5-456d-b5ae-d343fa5b8727/files/f8435276-2ccb-4f41-a4fc-10d5e5788bad.jpg',
    category: 'semi-hard'
  },
  {
    id: 6,
    name: 'Бри',
    description: 'Французский сыр с мягкой текстурой',
    price: 850,
    weight: '200г',
    image: 'https://cdn.poehali.dev/projects/40e54eb3-e9e5-456d-b5ae-d343fa5b8727/files/a2bc09bb-62ec-46b0-bc5f-0fbd4d3e9542.jpg',
    category: 'soft'
  }
];

export default function Index() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const { toast } = useToast();

  const addToCart = (product: Product) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    toast({
      title: "Добавлено в корзину",
      description: `${product.name} добавлен в вашу корзину`,
    });
  };

  const removeFromCart = (id: number) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity === 0) {
      removeFromCart(id);
    } else {
      setCart(cart.map(item => 
        item.id === id ? { ...item, quantity } : item
      ));
    }
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="text-2xl">🧀</div>
            <h1 className="text-2xl font-bold text-primary">SOBKO</h1>
          </div>
          
          <nav className="hidden md:flex items-center gap-6">
            <a href="#home" className="text-sm font-medium hover:text-primary transition-colors">Главная</a>
            <a href="#catalog" className="text-sm font-medium hover:text-primary transition-colors">Каталог</a>
            <a href="#about" className="text-sm font-medium hover:text-primary transition-colors">О нас</a>
            <a href="#contacts" className="text-sm font-medium hover:text-primary transition-colors">Контакты</a>
          </nav>

          <div className="flex items-center gap-4">
            <Dialog open={isAuthOpen} onOpenChange={setIsAuthOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Icon name="User" size={20} />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-2xl">
                    {authMode === 'login' ? 'Вход' : 'Регистрация'}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="your@email.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Пароль</Label>
                    <Input id="password" type="password" />
                  </div>
                  {authMode === 'register' && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="name">Имя</Label>
                        <Input id="name" placeholder="Ваше имя" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Телефон</Label>
                        <Input id="phone" placeholder="+7 (___) ___-__-__" />
                      </div>
                    </>
                  )}
                  <Button className="w-full">
                    {authMode === 'login' ? 'Войти' : 'Зарегистрироваться'}
                  </Button>
                  <button
                    onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                    className="w-full text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {authMode === 'login' ? 'Нет аккаунта? Зарегистрируйтесь' : 'Уже есть аккаунт? Войдите'}
                  </button>
                </div>
              </DialogContent>
            </Dialog>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Icon name="ShoppingCart" size={20} />
                  {cartCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                      {cartCount}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-lg">
                <SheetHeader>
                  <SheetTitle className="text-2xl">Корзина</SheetTitle>
                </SheetHeader>
                <div className="mt-8 space-y-4">
                  {cart.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">Корзина пуста</p>
                  ) : (
                    <>
                      <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                        {cart.map(item => (
                          <Card key={item.id}>
                            <CardContent className="p-4">
                              <div className="flex gap-4">
                                <img 
                                  src={item.image} 
                                  alt={item.name}
                                  className="w-20 h-20 object-cover rounded"
                                />
                                <div className="flex-1">
                                  <h4 className="font-semibold">{item.name}</h4>
                                  <p className="text-sm text-muted-foreground">{item.weight}</p>
                                  <p className="text-primary font-semibold mt-1">{item.price} ₽</p>
                                  <div className="flex items-center gap-2 mt-2">
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    >
                                      <Icon name="Minus" size={14} />
                                    </Button>
                                    <span className="w-8 text-center">{item.quantity}</span>
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    >
                                      <Icon name="Plus" size={14} />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => removeFromCart(item.id)}
                                      className="ml-auto"
                                    >
                                      <Icon name="Trash2" size={14} />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                      
                      <div className="border-t pt-4 space-y-4">
                        <div className="flex justify-between text-lg font-semibold">
                          <span>Итого:</span>
                          <span className="text-primary">{totalPrice} ₽</span>
                        </div>
                        
                        {totalPrice < 2500 && (
                          <p className="text-sm text-muted-foreground">
                            Бесплатная доставка от 2500 ₽
                          </p>
                        )}

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button className="w-full" size="lg">
                              Оформить заказ
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-lg">
                            <DialogHeader>
                              <DialogTitle className="text-2xl">Оформление заказа</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-6">
                              <div className="space-y-4">
                                <div className="space-y-2">
                                  <Label>Способ доставки</Label>
                                  <RadioGroup defaultValue="pickup">
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem value="pickup" id="pickup" />
                                      <Label htmlFor="pickup">Самовывоз</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem value="delivery" id="delivery" />
                                      <Label htmlFor="delivery">
                                        Доставка по г. Пермь (только пятница)
                                      </Label>
                                    </div>
                                  </RadioGroup>
                                  {totalPrice < 2500 && (
                                    <p className="text-sm text-muted-foreground">
                                      Бесплатная доставка от 2500 ₽
                                    </p>
                                  )}
                                </div>

                                <div className="space-y-2">
                                  <Label>Способ оплаты</Label>
                                  <RadioGroup defaultValue="qr">
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem value="qr" id="qr" />
                                      <Label htmlFor="qr">QR-кодом при получении</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem value="cash" id="cash" />
                                      <Label htmlFor="cash">Наличными при получении</Label>
                                    </div>
                                  </RadioGroup>
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor="address">Адрес</Label>
                                  <Input id="address" placeholder="Укажите адрес доставки" />
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor="comment">Комментарий к заказу</Label>
                                  <Input id="comment" placeholder="Дополнительная информация" />
                                </div>
                              </div>

                              <div className="border-t pt-4">
                                <div className="flex justify-between text-lg font-semibold mb-4">
                                  <span>Итого:</span>
                                  <span className="text-primary">{totalPrice} ₽</span>
                                </div>
                                <div className="flex gap-2">
                                  <Button variant="outline" className="flex-1">
                                    Вернуться в корзину
                                  </Button>
                                  <Button className="flex-1">
                                    Подтвердить заказ
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <section id="home" className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(https://cdn.poehali.dev/projects/40e54eb3-e9e5-456d-b5ae-d343fa5b8727/files/7f6e72ed-ae7e-482f-b041-f7c06c6954f4.jpg)`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-secondary/90 to-secondary/70" />
        </div>
        
        <div className="container relative z-10 text-center text-secondary-foreground animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Сыроварня SOBKO
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
            Премиальные сыры ручной работы от мастеров своего дела
          </p>
          <Button size="lg" className="text-lg px-8">
            <a href="#catalog">Смотреть каталог</a>
          </Button>
        </div>
      </section>

      <section id="catalog" className="py-16 container">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl font-bold mb-4">Наш каталог</h2>
          <p className="text-muted-foreground text-lg">
            Отборные сыры премиального качества
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, index) => (
            <Card 
              key={product.id} 
              className="overflow-hidden hover:shadow-lg transition-all duration-300 animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="aspect-square overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold">{product.name}</h3>
                  <Badge variant="secondary">{product.weight}</Badge>
                </div>
                <p className="text-muted-foreground mb-4">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-primary">{product.price} ₽</span>
                </div>
              </CardContent>
              <CardFooter className="p-6 pt-0">
                <Button 
                  className="w-full" 
                  onClick={() => addToCart(product)}
                >
                  <Icon name="ShoppingCart" size={18} className="mr-2" />
                  В корзину
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      <section id="about" className="py-16 bg-muted">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h2 className="text-4xl font-bold mb-6">О нас</h2>
              <p className="text-lg mb-4">
                Сыроварня SOBKO — это семейное предприятие, где традиции сыроделия 
                передаются из поколения в поколение.
              </p>
              <p className="text-lg mb-4">
                Мы используем только натуральное молоко от проверенных фермеров 
                и создаём сыры по классическим рецептам с соблюдением всех технологий.
              </p>
              <p className="text-lg">
                Каждый наш сыр — это результат кропотливого труда и любви к своему делу.
              </p>
            </div>
            <div className="relative h-[400px] rounded-lg overflow-hidden animate-scale-in">
              <img 
                src="https://cdn.poehali.dev/projects/40e54eb3-e9e5-456d-b5ae-d343fa5b8727/files/a2bc09bb-62ec-46b0-bc5f-0fbd4d3e9542.jpg"
                alt="О нас"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="contacts" className="py-16 container">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl font-bold mb-4">Контакты</h2>
          <p className="text-muted-foreground text-lg">
            Свяжитесь с нами удобным способом
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <Card className="text-center p-6 hover:shadow-lg transition-shadow">
            <div className="mb-4 flex justify-center">
              <div className="p-3 bg-primary/10 rounded-full">
                <Icon name="MapPin" size={24} className="text-primary" />
              </div>
            </div>
            <h3 className="font-semibold mb-2">Адрес</h3>
            <p className="text-muted-foreground">г. Пермь</p>
          </Card>

          <Card className="text-center p-6 hover:shadow-lg transition-shadow">
            <div className="mb-4 flex justify-center">
              <div className="p-3 bg-primary/10 rounded-full">
                <Icon name="Phone" size={24} className="text-primary" />
              </div>
            </div>
            <h3 className="font-semibold mb-2">Телефон</h3>
            <p className="text-muted-foreground">+7 (___) ___-__-__</p>
          </Card>

          <Card className="text-center p-6 hover:shadow-lg transition-shadow">
            <div className="mb-4 flex justify-center">
              <div className="p-3 bg-primary/10 rounded-full">
                <Icon name="MessageCircle" size={24} className="text-primary" />
              </div>
            </div>
            <h3 className="font-semibold mb-2">ВКонтакте</h3>
            <a 
              href="https://vk.com/sirovarnya_sobko" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              @sirovarnya_sobko
            </a>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">
            Доставка: каждую пятницу по г. Пермь
          </p>
          <p className="text-sm text-muted-foreground">
            Бесплатная доставка от 2500 ₽
          </p>
        </div>
      </section>

      <footer className="bg-secondary text-secondary-foreground py-8">
        <div className="container text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="text-2xl">🧀</div>
            <h3 className="text-xl font-bold text-primary">SOBKO</h3>
          </div>
          <p className="text-sm">© 2024 Сыроварня SOBKO. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
}
