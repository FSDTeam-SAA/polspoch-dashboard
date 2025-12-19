"use client";

import { useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Layers,
  Ruler,
  CheckCircle2,
  ArrowRight,
  Maximize2,
  Pencil,
} from "lucide-react";
import { EditServiceDialog } from "./EditServiceDialog";
import Image from "next/image";

// --- Demo Data ---
interface ShapeDimension {
  label: string;
  value: string;
}

interface ShapeSpec {
  material: string[];
  thickness: string[];
}

interface ServiceItem {
  id: string;
  title: string;
  description: string;
  specs: ShapeSpec;
  dimensions: ShapeDimension[];
  colorTheme: "blue" | "green" | "orange" | "purple";
  image?: string;
}

const initialRebarData: ServiceItem[] = [
  {
    id: "shape-l",
    title: "Shape L",
    description:
      "Standard L-shaped rebar specification for structural corners.",
    colorTheme: "blue",
    image: "/images/shape-l.png",
    specs: {
      material: ["Rawseel", "Galvanized", "Corten", "Teardrop"],
      thickness: ["1", "1.5", "2", "2.5", "3", "4", "5", "6", "8"],
    },
    dimensions: [
      { label: "Size L", value: "50 – 1980" },
      { label: "Size A", value: "30 – 250" },
      { label: "Size B", value: "30 – 250" },
      { label: "Degree 1 (A-B)", value: "80 – 135" },
    ],
  },
  {
    id: "shape-z",
    title: "Shape Z",
    description: "Z-shaped rebar configuration for complex reinforcements.",
    colorTheme: "purple",
    image: "/images/shape-z.png",
    specs: {
      material: ["Rawseel", "Galvanized", "Corten", "Teardrop"],
      thickness: ["1", "1.5", "2", "2.5", "3", "4", "5", "6", "8"],
    },
    dimensions: [
      { label: "Size Z", value: "100 – 1980" },
      { label: "Size A", value: "30 – 180" },
      { label: "Size C", value: "30 – 180" },
      { label: "Degree 1 (A-B)", value: "90" },
      { label: "Degree 2", value: "90" },
    ],
  },
];

export default function Services() {
  const [rebarServices, setRebarServices] =
    useState<ServiceItem[]>(initialRebarData);
  const [editingService, setEditingService] = useState<ServiceItem | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleEditClick = (service: ServiceItem) => {
    setEditingService(service);
    setIsDialogOpen(true);
  };

  const handleSaveService = (updatedService: ServiceItem) => {
    setRebarServices((prev) =>
      prev.map((item) =>
        item.id === updatedService.id ? updatedService : item
      )
    );
  };

  return (
    <div className="container mx-auto py-10 space-y-8">
      <EditServiceDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        service={editingService}
        onSave={handleSaveService}
      />
      <div className="flex flex-col space-y-2 ">
        <h1 className="text-3xl font-bold tracking-tight bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent w-fit">
          Our Processing Services
        </h1>
        <p className="text-muted-foreground max-w-2xl">
          Explore our comprehensive range of metal processing services. Select a
          category below to view detailed specifications and pricing.
        </p>
      </div>

      <Tabs defaultValue="rebar" className="w-full">
        <div className="flex items-center justify-between mb-8">
          <TabsList className="grid w-full max-w-[400px] grid-cols-3 h-11 p-1">
            <TabsTrigger
              value="rebar"
              className="data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all"
            >
              Rebar
            </TabsTrigger>
            <TabsTrigger
              value="cutting"
              className="data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all"
            >
              Cutting
            </TabsTrigger>
            <TabsTrigger
              value="bending"
              className="data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all"
            >
              Bending
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Rebar Tab Content */}
        <TabsContent
          value="rebar"
          className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-2 duration-500"
        >
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {rebarServices.map((item) => (
              <ShapeCard
                key={item.id}
                item={item}
                onEdit={() => handleEditClick(item)}
              />
            ))}
          </div>
        </TabsContent>

        {/* Cutting Tab Content - Placeholder */}
        <TabsContent
          value="cutting"
          className="space-y-6 mt-6 animate-in fade-in-50 slide-in-from-bottom-2 duration-500"
        >
          <Card className="border-dashed">
            <CardHeader>
              <CardTitle>Cutting Services</CardTitle>
              <CardDescription>
                Precision cutting services for various materials.
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] flex flex-col items-center justify-center text-muted-foreground gap-4">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                <Layers className="h-8 w-8 opacity-50" />
              </div>
              <p>Cutting service specifications coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Bending Tab Content - Placeholder */}
        <TabsContent
          value="bending"
          className="space-y-6 mt-6 animate-in fade-in-50 slide-in-from-bottom-2 duration-500"
        >
          <Card className="border-dashed">
            <CardHeader>
              <CardTitle>Bending Services</CardTitle>
              <CardDescription>
                Custom bending solutions for your construction needs.
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] flex flex-col items-center justify-center text-muted-foreground gap-4">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                <Maximize2 className="h-8 w-8 opacity-50" />
              </div>
              <p>Bending service specifications coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Reusable Shape Card Component
function ShapeCard({
  item,
  onEdit,
}: {
  item: ServiceItem;
  onEdit: () => void;
}) {
  // Dynamic styles based on theme
  const themeStyles = {
    blue: {
      border: "border-blue-200 dark:border-blue-900",
      bg: "bg-blue-50/50 dark:bg-blue-950/10",
      badge:
        "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 hover:bg-blue-200",
      icon: "text-blue-600 dark:text-blue-400",
    },
    purple: {
      border: "border-purple-200 dark:border-purple-900",
      bg: "bg-purple-50/50 dark:bg-purple-950/10",
      badge:
        "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300 hover:bg-purple-200",
      icon: "text-purple-600 dark:text-purple-400",
    },
    green: {
      border: "border-green-200 dark:border-green-900",
      bg: "bg-green-50/50 dark:bg-green-950/10",
      badge:
        "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 hover:bg-green-200",
      icon: "text-green-600 dark:text-green-400",
    },
    orange: {
      border: "border-orange-200 dark:border-orange-900",
      bg: "bg-orange-50/50 dark:bg-orange-950/10",
      badge:
        "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300 hover:bg-orange-200",
      icon: "text-orange-600 dark:text-orange-400",
    },
  }[item.colorTheme];

  return (
    <Card
      className={`overflow-hidden transition-all duration-300 hover:shadow-lg ${themeStyles.border} group`}
    >
      <CardHeader
        className={`${themeStyles.bg} border-b ${themeStyles.border} pb-6`}
      >
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <CardTitle className="text-2xl flex items-center gap-2">
              {item.title}
            </CardTitle>
            <CardDescription className="text-balance">
              {item.description}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-8">
        {/* Shape Image */}
        {item.image && (
          <div className="flex justify-center py-4">
            <div className="relative w-48 h-48">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-contain opacity-80"
              />
            </div>
          </div>
        )}

        {/* Material & Thickness Section */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              <Layers className={`h-4 w-4 ${themeStyles.icon}`} />
              Materials
            </div>
            <div className="flex flex-wrap gap-2">
              {item.specs.material.map((mat) => (
                <Badge
                  key={mat}
                  variant="secondary"
                  className="font-normal bg-secondary/50 hover:bg-secondary"
                >
                  {mat}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              <CheckCircle2 className={`h-4 w-4 ${themeStyles.icon}`} />
              Thickness (mm)
            </div>
            <div className="flex flex-wrap gap-1.5">
              {item.specs.thickness.map((t) => (
                <div
                  key={t}
                  className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-medium border border-border/50 ${themeStyles.bg}`}
                >
                  {t}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dimensions Section */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider border-b pb-2">
            <Ruler className={`h-4 w-4 ${themeStyles.icon}`} />
            Dimensions Specification
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {item.dimensions.map((dim, idx) => (
              <div
                key={idx}
                className="bg-muted/30 p-4 rounded-lg border border-border/40 hover:border-primary/20 transition-colors"
              >
                <span className="text-xs text-muted-foreground mb-1.5 flex items-center gap-1">
                  <ArrowRight className="h-3 w-3 opacity-50" />
                  {dim.label}
                </span>
                <span className="font-bold text-base md:text-lg tabular-nums tracking-tight text-foreground/90">
                  {dim.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>

      {/* Edit Button Overlay or Footer */}
      <div className="px-6 pb-6 pt-0">
        <button
          onClick={onEdit}
          className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors border ${themeStyles.border} hover:bg-muted/50 cursor-pointer`}
        >
          <Pencil className="h-4 w-4" />
          Edit Service Details
        </button>
      </div>
    </Card>
  );
}
