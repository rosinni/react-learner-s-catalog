CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  image_url TEXT,
  category TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.products TO anon;
GRANT SELECT ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Products are viewable by everyone"
  ON public.products FOR SELECT
  USING (true);

INSERT INTO public.products (name, description, price, image_url, category) VALUES
('Auriculares Inalámbricos', 'Auriculares bluetooth con cancelación de ruido y 30 horas de batería.', 89.99, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800', 'Audio'),
('Teclado Mecánico', 'Teclado mecánico RGB con switches azules, ideal para escribir y programar.', 129.50, 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800', 'Accesorios'),
('Mouse Ergonómico', 'Mouse inalámbrico con diseño ergonómico y sensor de alta precisión.', 45.00, 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800', 'Accesorios'),
('Monitor 27 pulgadas', 'Monitor QHD 144Hz con panel IPS, perfecto para trabajo y gaming.', 349.99, 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800', 'Monitores'),
('Silla Gamer', 'Silla ergonómica reclinable con soporte lumbar ajustable.', 249.00, 'https://images.unsplash.com/photo-1541558869434-2840d308329a?w=800', 'Mobiliario'),
('Webcam Full HD', 'Cámara web 1080p con micrófono integrado y enfoque automático.', 59.90, 'https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=800', 'Video'),
('Lámpara de Escritorio', 'Lámpara LED con brillo ajustable y puerto USB para cargar dispositivos.', 34.50, 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800', 'Mobiliario'),
('Disco SSD 1TB', 'Unidad de estado sólido NVMe de alta velocidad para tu computadora.', 99.99, 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800', 'Almacenamiento');