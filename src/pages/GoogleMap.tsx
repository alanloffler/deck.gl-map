import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function GoogleMap() {
  return (
    <main className="flex flex-col gap-6 md:flex-row">
      <Card className="w-full md:w-2/3">
        <CardHeader>
          <CardTitle>Redes de agua potable</CardTitle>
          <CardDescription>Visualización de conexiones</CardDescription>
        </CardHeader>
        <CardContent>My google map here</CardContent>
      </Card>
      <Card className="w-full md:w-1/3">
        <CardHeader>
          <CardTitle>Datos de la selección</CardTitle>
        </CardHeader>
        <CardContent>Contenido de la selección acá</CardContent>
      </Card>
    </main>
  );
}
