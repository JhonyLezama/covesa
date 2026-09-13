import { Head } from '@inertiajs/react';
import AppLayout from '../Layouts/AppLayout';
import { Button } from '../Components/ui/button';
import { Badge } from '../Components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../Components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../Components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../Components/ui/select';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../Components/ui/carousel';

const sectionClass = 'mb-10';
const h2Class = 'mb-4 text-lg font-medium text-gray-text';

export default function DemoDiseno() {
  return (
    <AppLayout>
      <Head title="Demo de diseño" />
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-medium text-gray-text mb-2">Sistema de diseño COVESA (shadcn + paleta)</h1>
        <p className="text-sm text-gray-muted mb-8">
          Página temporal de aprobación visual — Día 1 Semana 4. Se retira antes del pase a producción.
        </p>

        <section className={sectionClass}>
          <h2 className={h2Class}>Botones</h2>
          <div className="flex flex-wrap gap-3">
            <Button>Primario (navy)</Button>
            <Button variant="secondary">Secundario (gold)</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="pill">Pill “Ver más”</Button>
            <Button variant="ghost">Ghost</Button>
          </div>
        </section>

        <section className={sectionClass}>
          <h2 className={h2Class}>Badges (estados del PDF)</h2>
          <div className="flex flex-wrap gap-3">
            <Badge variant="brand">Terreno Comercial</Badge>
            <Badge variant="secondary">EN VENTA</Badge>
            <Badge variant="default">En alquiler</Badge>
            <Badge variant="outline">Concluido</Badge>
          </div>
        </section>

        <section className={sectionClass}>
          <h2 className={h2Class}>Card (estilo ficha del PDF)</h2>
          <Card className="max-w-sm overflow-hidden !p-0">
            <img
              src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80"
              alt="Demo"
              className="h-44 w-full object-cover"
            />
            <div className="bg-navy p-5 text-white">
              <CardHeader className="!p-0 mb-2">
                <CardTitle className="text-white">Carretera Huanchaco</CardTitle>
                <CardDescription className="text-white/70">6,692.33 m2 · Ideal para almacenes</CardDescription>
              </CardHeader>
              <CardContent className="!p-0 mb-4">
                <Badge variant="secondary">EN VENTA</Badge>
              </CardContent>
              <CardFooter className="!p-0">
                <Button variant="secondary" size="sm">Más información</Button>
              </CardFooter>
            </div>
          </Card>
        </section>

        <section className={sectionClass}>
          <h2 className={h2Class}>Tabs (Todos / Venta / Alquiler)</h2>
          <Tabs defaultValue="todos">
            <TabsList>
              <TabsTrigger value="todos">Todos</TabsTrigger>
              <TabsTrigger value="venta">Venta</TabsTrigger>
              <TabsTrigger value="alquiler">Alquiler</TabsTrigger>
            </TabsList>
            <TabsContent value="todos">Contenido: todas las propiedades.</TabsContent>
            <TabsContent value="venta">Contenido: solo venta.</TabsContent>
            <TabsContent value="alquiler">Contenido: solo alquiler.</TabsContent>
          </Tabs>
        </section>

        <section className={sectionClass}>
          <h2 className={h2Class}>Select (filtros Tipo / Lugar / Precio)</h2>
          <div className="grid max-w-xl grid-cols-1 gap-3 sm:grid-cols-3">
            <Select>
              <SelectTrigger><SelectValue placeholder="Tipo" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="terreno-comercial">Terreno Comercial</SelectItem>
                <SelectItem value="terreno-industrial">Terreno Industrial</SelectItem>
                <SelectItem value="local-comercial">Local Comercial</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger><SelectValue placeholder="Lugar" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="trujillo">Trujillo</SelectItem>
                <SelectItem value="huanchaco">Huanchaco</SelectItem>
                <SelectItem value="piura">Piura</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger><SelectValue placeholder="Precio" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="0-100000">Hasta $100,000</SelectItem>
                <SelectItem value="100000-400000">$100,000 - $400,000</SelectItem>
                <SelectItem value="400000+">Más de $400,000</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </section>

        <section className={sectionClass}>
          <h2 className={h2Class}>Carousel (base del hero)</h2>
          <div className="px-12">
            <Carousel>
              <CarouselContent>
                {[1, 2, 3].map((n) => (
                  <CarouselItem key={n}>
                    <div className="flex h-40 items-center justify-center rounded-xl bg-navy text-xl text-white">
                      Slide {n}
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
