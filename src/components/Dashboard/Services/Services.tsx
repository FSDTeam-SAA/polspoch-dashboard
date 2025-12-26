// Services.tsx
"use client";

import { useState, useMemo } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Ruler, CheckCircle2, ArrowRight, Pencil, Layers } from "lucide-react";
import { EditServiceDialog } from "./EditServiceDialog";
import Image from "next/image";
import Link from "next/link";
import { useRebarTemplates } from "@/lib/hooks/useRebarServices";
import { RebarTemplate } from "@/types/rebar";

// --- Demo Data ---
export interface ShapeDimension {
  label: string;
  value: string;
  key?: string; // Added for Rebar API
  min?: number;
  max?: number;
}

export interface ShapeSpec {
  material: string[];
  thickness: string[];
}

export interface ServiceItem {
  id?: string; // Added for API mapping
  templateId?: string; // Added for Rebar ID
  shepName: string;
  type: "rebar" | "cutting" | "bending";
  title: string;
  description: string;
  specs: ShapeSpec;
  dimensions: ShapeDimension[];
  image?: string;
}

// --- Cutting Data ---
const initialCuttingData: ServiceItem[] = [
  {
    shepName: "cut-laser",
    type: "cutting",
    title: "Laser Cutting",
    description: "High-precision laser cutting for detailed shapes.",
    image: "/images/laser-cutting.png",
    specs: {
      material: ["Steel", "Stainless", "Aluminum", "Copper"],
      thickness: [
        "0.5",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "8",
        "10",
        "12",
        "15",
        "20",
      ],
    },
    dimensions: [
      { label: "Max Width", value: "1500" },
      { label: "Max Length", value: "3000" },
      { label: "Tolerance", value: "±0.1" },
    ],
  },
  {
    shepName: "cut-plasma",
    type: "cutting",
    title: "Plasma Cutting",
    description: "Cost-effective cutting for thick metal plates.",
    image: "/images/plasma-cutting.png",
    specs: {
      material: ["Steel", "Stainless", "Aluminum"],
      thickness: ["5", "10", "15", "20", "25", "30", "40", "50"],
    },
    dimensions: [
      { label: "Max Width", value: "2000" },
      { label: "Max Length", value: "6000" },
      { label: "Tolerance", value: "±1.0" },
    ],
  },
];

// --- Bending Data ---
const initialBendingData: ServiceItem[] = [
  {
    shepName: "bend-sheet",
    type: "bending",
    title: "Sheet Bending",
    description: "Precision bending for metal sheets and plates.",
    image: "/images/sheet-bending.png",
    specs: {
      material: ["Steel", "Stainless", "Aluminum"],
      thickness: ["0.5", "1", "2", "3", "4", "5", "6"],
    },
    dimensions: [
      { label: "Max Length", value: "3000" },
      { label: "Min Angle", value: "30°" },
      { label: "Accuracy", value: "±0.5°" },
    ],
  },
  {
    shepName: "bend-tube",
    type: "bending",
    title: "Tube Bending",
    description: "Custom bending for round and square tubes.",
    image: "/images/tube-bending.png",
    specs: {
      material: ["Steel", "Stainless", "Aluminum"],
      thickness: ["1", "1.5", "2", "3"],
    },
    dimensions: [
      { label: "Max Diameter", value: "100" },
      { label: "Min Radius", value: "150" },
      { label: "Max Angle", value: "180°" },
    ],
  },
];

export default function Services() {
  const [activeTab, setActiveTab] = useState("rebar");

  // State for each service type
  const { data: rebarData, isLoading: isRebarLoading } = useRebarTemplates();
  // Store local edits by ID (or shepName if ID is missing/unstable, but ideally ID)
  // We use shepName as the key because handleSaveService currently matches by shepName
  const [localRebarEdits, setLocalRebarEdits] = useState<
    Record<string, ServiceItem>
  >({});

  // Derive rebarServices from data + local edits
  const rebarServices = useMemo(() => {
    if (!rebarData) return [];

    return rebarData.map((t: RebarTemplate) => {
      // Base mapped item
      const baseItem: ServiceItem = {
        id: t._id,
        templateId: t.templateId,
        shepName: t.shapeName,
        type: "rebar",
        title: t.shapeName,
        description: "Rebar template specification",
        image: t.imageUrl,
        specs: {
          material: ["Rawseel", "Galvanized", "Corten", "Teardrop"],
          thickness: t.availableDiameters.map(String),
        },
        dimensions: t.dimensions.map((d) => ({
          label: d.label,
          value:
            d.minRange === d.maxRange
              ? `${d.minRange} ${d.unit}`
              : `${d.minRange} – ${d.maxRange} ${d.unit}`,
          key: d.key,
          min: d.minRange,
          max: d.maxRange,
        })),
      };

      // Check for local overrides
      const override = localRebarEdits[t.shapeName];
      return override ? override : baseItem;
    });
  }, [rebarData, localRebarEdits]);

  const [cuttingServices, setCuttingServices] =
    useState<ServiceItem[]>(initialCuttingData);
  const [bendingServices, setBendingServices] =
    useState<ServiceItem[]>(initialBendingData);

  const [editingService, setEditingService] = useState<ServiceItem | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleEditClick = (service: ServiceItem) => {
    setEditingService(service);
    setIsDialogOpen(true);
  };
  const handleSaveService = (updatedService: ServiceItem) => {
    // Helper to update a specific list
    const updateList = (list: ServiceItem[]) =>
      list.map((item) =>
        item.shepName === updatedService.shepName ? updatedService : item
      );

    if (activeTab === "rebar") {
      // Save to local edits map
      setLocalRebarEdits((prev) => ({
        ...prev,
        [updatedService.shepName]: updatedService,
      }));
    } else if (activeTab === "cutting") {
      setCuttingServices((prev) => updateList(prev));
    } else if (activeTab === "bending") {
      setBendingServices((prev) => updateList(prev));
    }
  };

  return (
    <div className="container mx-auto py-10 space-y-8">
      <EditServiceDialog
        key={editingService?.shepName ?? "dialog"}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        service={editingService}
        onSave={handleSaveService}
      />
      <div className="flex flex-col space-y-2 ">
        <h1 className="text-3xl font-bold tracking-tight bg-linear-to-r from-[#7E1800] to-[#7E1800]/60 bg-clip-text text-transparent w-fit">
          Our Processing Services
        </h1>
        <p className="text-muted-foreground max-w-2xl">
          Explore our comprehensive range of metal processing services. Select a
          category below to view detailed specifications and pricing.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex items-center justify-between mb-8">
          <TabsList className="grid w-full max-w-[400px] grid-cols-3 h-11 p-1">
            <TabsTrigger
              value="rebar"
              className="data-[state=active]:bg-background data-[state=active]:text-[#7E1800] data-[state=active]:shadow-sm transition-all cursor-pointer"
            >
              Rebar
            </TabsTrigger>
            <TabsTrigger
              value="cutting"
              className="data-[state=active]:bg-background data-[state=active]:text-[#7E1800] data-[state=active]:shadow-sm transition-all cursor-pointer"
            >
              Cutting
            </TabsTrigger>
            <TabsTrigger
              value="bending"
              className="data-[state=active]:bg-background data-[state=active]:text-[#7E1800] data-[state=active]:shadow-sm transition-all cursor-pointer"
            >
              Bending
            </TabsTrigger>
          </TabsList>
          <Link href={`/services/${activeTab}/calculation`}>
            <button className="bg-[#7E1800] cursor-pointer text-primary-foreground px-4 py-2 rounded-md hover:bg-[#7E1800]/90 transition-colors font-medium">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}{" "}
              Calculation
            </button>
          </Link>
        </div>

        {/* Rebar Tab Content */}
        <TabsContent
          value="rebar"
          className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-2 duration-500"
        >
          {isRebarLoading ? (
            <div className="flex justify-center items-center py-20">
              <span className="text-muted-foreground animate-pulse">
                Loading templates...
              </span>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {rebarServices.map((item) => (
                <ShapeCard
                  key={item.shepName}
                  item={item}
                  onEdit={() => handleEditClick(item)}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Cutting Tab Content */}
        <TabsContent
          value="cutting"
          className="space-y-6 mt-6 animate-in fade-in-50 slide-in-from-bottom-2 duration-500 "
        >
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {cuttingServices.map((item) => (
              <ShapeCard
                key={item.shepName}
                item={item}
                onEdit={() => handleEditClick(item)}
              />
            ))}
          </div>
        </TabsContent>

        {/* Bending Tab Content */}
        <TabsContent
          value="bending"
          className="space-y-6 mt-6 animate-in fade-in-50 slide-in-from-bottom-2 duration-500"
        >
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {bendingServices.map((item) => (
              <ShapeCard
                key={item.shepName}
                item={item}
                onEdit={() => handleEditClick(item)}
              />
            ))}
          </div>
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
  return (
    <Card className="overflow-hidden pt-0! pb-0! transition-all duration-300 hover:shadow-lg border-[#7E1800]/20 dark:border-[#7E1800]/40 group">
      <CardHeader className="bg-[#7E1800]/5 border-b border-[#7E1800]/20 pb-6">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <CardTitle className="text-2xl py-2 flex items-center gap-2 text-[#7E1800]">
              {item.title}
            </CardTitle>
            <CardDescription className="text-balance text-muted-foreground">
              {item.description}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-8">
        {/* Shape Image */}
        {item.image && (
          <div className="flex justify-center py-0!">
            <div className="relative w-68 h-68">
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
          {item.specs.material && item.specs.material.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                <Layers className="h-4 w-4 text-[#7E1800]" />
                Materials
              </div>
              <div className="flex flex-wrap gap-2">
                {item.specs.material.map((mat) => (
                  <Badge
                    key={mat}
                    variant="secondary"
                    className="font-normal bg-[#7E1800]/10 text-[#7E1800] border-transparent hover:bg-[#7E1800]/20"
                  >
                    {mat}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              <CheckCircle2 className="h-4 w-4 text-[#7E1800]" />
              Thickness (mm)
            </div>
            <div className="flex flex-wrap gap-1.5">
              {item.specs.thickness.map((t) => (
                <div
                  key={t}
                  className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-medium border border-[#7E1800]/20 bg-[#7E1800]/5 text-[#7E1800]"
                >
                  {t}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dimensions Section */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider border-b border-[#7E1800]/10 pb-2">
            <Ruler className="h-4 w-4 text-[#7E1800]" />
            Dimensions Specification
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {item.dimensions.map((dim, idx) => (
              <div
                key={idx}
                className="bg-[#7E1800]/5 p-4 rounded-lg border border-[#7E1800]/10 hover:border-[#7E1800]/30 transition-colors"
              >
                <span className="text-xs text-muted-foreground mb-1.5 flex items-center gap-1">
                  <ArrowRight className="h-3 w-3 opacity-50 text-[#7E1800]" />
                  {dim.label}
                </span>
                <span className="font-bold text-base md:text-lg tabular-nums tracking-tight text-[#7E1800]/90">
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
          className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors border border-[#7E1800] text-[#7E1800] hover:bg-[#7E1800] hover:text-white cursor-pointer"
        >
          <Pencil className="h-4 w-4" />
          Edit Service Details
        </button>
      </div>
    </Card>
  );
}
