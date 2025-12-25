
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price INTEGER NOT NULL,
    weight VARCHAR(50) NOT NULL,
    image VARCHAR(500),
    category VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS site_content (
    id SERIAL PRIMARY KEY,
    section VARCHAR(100) NOT NULL UNIQUE,
    title VARCHAR(255),
    subtitle TEXT,
    content TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    phone VARCHAR(50),
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    total_price INTEGER NOT NULL,
    delivery_type VARCHAR(50) NOT NULL,
    payment_type VARCHAR(50) NOT NULL,
    address TEXT,
    comment TEXT,
    status VARCHAR(50) DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id),
    product_id INTEGER REFERENCES products(id),
    product_name VARCHAR(255),
    product_price INTEGER,
    quantity INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO products (name, description, price, weight, image, category) VALUES
('Камамбер', 'Мягкий сыр с нежной плесневой корочкой', 890, '200г', 'https://cdn.poehali.dev/projects/40e54eb3-e9e5-456d-b5ae-d343fa5b8727/files/7f6e72ed-ae7e-482f-b041-f7c06c6954f4.jpg', 'soft'),
('Пармезан выдержанный', 'Твёрдый сыр 24 месяца выдержки', 1290, '250г', 'https://cdn.poehali.dev/projects/40e54eb3-e9e5-456d-b5ae-d343fa5b8727/files/f8435276-2ccb-4f41-a4fc-10d5e5788bad.jpg', 'hard'),
('Моцарелла буффало', 'Свежий сыр из молока буйволиц', 750, '150г', 'https://cdn.poehali.dev/projects/40e54eb3-e9e5-456d-b5ae-d343fa5b8727/files/a2bc09bb-62ec-46b0-bc5f-0fbd4d3e9542.jpg', 'soft'),
('Рокфор', 'Сыр с благородной голубой плесенью', 990, '180г', 'https://cdn.poehali.dev/projects/40e54eb3-e9e5-456d-b5ae-d343fa5b8727/files/7f6e72ed-ae7e-482f-b041-f7c06c6954f4.jpg', 'blue'),
('Гауда', 'Полутвёрдый сыр с ореховым вкусом', 690, '200г', 'https://cdn.poehali.dev/projects/40e54eb3-e9e5-456d-b5ae-d343fa5b8727/files/f8435276-2ccb-4f41-a4fc-10d5e5788bad.jpg', 'semi-hard'),
('Бри', 'Французский сыр с мягкой текстурой', 850, '200г', 'https://cdn.poehali.dev/projects/40e54eb3-e9e5-456d-b5ae-d343fa5b8727/files/a2bc09bb-62ec-46b0-bc5f-0fbd4d3e9542.jpg', 'soft');

INSERT INTO site_content (section, title, subtitle, content) VALUES
('hero', 'Сыроварня SOBKO', 'Премиальные сыры ручной работы от мастеров своего дела', ''),
('about', 'О нас', '', 'Сыроварня SOBKO — это семейное предприятие, где традиции сыроделия передаются из поколения в поколение. Мы используем только натуральное молоко от проверенных фермеров и создаём сыры по классическим рецептам с соблюдением всех технологий. Каждый наш сыр — это результат кропотливого труда и любви к своему делу.'),
('contacts', 'Контакты', 'Свяжитесь с нами удобным способом', 'г. Пермь');
