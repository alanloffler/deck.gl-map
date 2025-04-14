import { Settings2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { GMap } from "./components/GMap";
import { useState } from "react";
import type { IDetails } from "../interfaces/details.interface";

export function GoogleMap() {
  const [details, setDetails] = useState<IDetails | null>(null);
  const [clickableIcons, setClickableIcons] = useState<boolean>(false);
  const [colorScheme, setColorScheme] = useState<string>(
    localStorage.getItem("colorScheme") ?? "LIGHT",
  );

  return (
    <main className="flex flex-col gap-6 md:flex-row">
      <Card className="w-full md:w-2/3">
        <CardHeader>
          <CardTitle>Redes de agua potable</CardTitle>
          <CardDescription>Visualización de conexiones</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <section className="flex justify-between rounded-md bg-slate-100 px-3 py-2">
            <div className="flex items-center space-x-3">
              <Settings2 size={17} strokeWidth={2} />
              <span className="text-sm font-medium">Controles</span>
            </div>
            <div className="flex items-center space-x-3">
              <Label className="font-normal text-slate-500">Tema</Label>
              <Select
                defaultValue={colorScheme}
                onValueChange={(item) => {
                  setColorScheme(item);
                  localStorage.setItem("colorScheme", item);
                }}
              >
                <SelectTrigger className="bg-card w-fit" size="sm">
                  <SelectValue placeholder="Tema" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="LIGHT" size="sm">
                      Claro
                    </SelectItem>
                    <SelectItem value="DARK" size="sm">
                      Oscuro
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </section>
          <div className="h-[450px] w-full">
            <GMap
              setDetails={setDetails}
              clickableIcons={clickableIcons}
              colorScheme={colorScheme || "FOLLOW_SYSTEM"}
            />
          </div>
        </CardContent>
      </Card>
      <Card className="w-full md:w-1/3">
        <CardHeader>
          <CardTitle>Datos de la selección</CardTitle>
        </CardHeader>
        <CardContent className="h-full">
          <section className="flex h-full flex-col">
            {details && (
              <section>
                <div className="flex items-center space-x-3 text-base font-semibold">
                  <span>{details.name}</span>
                  <span
                    className={`h-1.5 w-7 rounded-sm bg-[${details.color}]`}
                  ></span>
                </div>
              </section>
            )}
            <section className="mt-auto pt-8 md:pt-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  onCheckedChange={() => setClickableIcons(!clickableIcons)}
                />
                <label
                  htmlFor="terms"
                  className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Elementos interactivos
                </label>
              </div>
            </section>
          </section>
        </CardContent>
      </Card>
    </main>
  );
}
