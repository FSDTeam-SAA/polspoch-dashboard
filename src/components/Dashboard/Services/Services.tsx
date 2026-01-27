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
import {
  Ruler,
  CheckCircle2,
  ArrowRight,
  Pencil,
  Layers,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { EditServiceDialog } from "./EditServiceDialog";
import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useRebarTemplates,
  useDeleteRebarTemplate,
} from "@/lib/hooks/useRebarServices";
import {
  useBendingTemplates,
  useDeleteBendingTemplate,
} from "@/lib/hooks/useBendingServices";
import {
  useCuttingTemplates,
  useDeleteCuttingTemplate,
} from "@/lib/hooks/useCuttingServices";
import { RebarTemplate } from "@/types/rebar";
import { BendingTemplate } from "@/types/bending";
import { CuttingTemplate } from "@/types/cutting";
import { CreateRebarTemplateDialog } from "./Rebar/CreateRebarTemplateDialog";
import { CreateBendingTemplateDialog } from "./Bending/CreateBendingTemplateDialog";
import { CreateCuttingTemplateDialog } from "./Cutting/CreateCuttingTemplateDialog";
import { CuttingMaterial } from "@/types/cutting";

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
  id?: string;
  templateId?: string;
  shepName: string;
  type: "rebar" | "bending" | "cutting";
  title: string;
  description: string;
  specs: ShapeSpec;
  dimensions: ShapeDimension[];
  image?: string;
  cuts?: number;
  bend?: number;
  rawMaterials?: CuttingMaterial[];
}

export default function Services() {
  const [activeTab, setActiveTab] = useState("rebar");

  // State for each service type
  const { data: rebarData, isLoading: isRebarLoading } = useRebarTemplates();

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
      return baseItem;
    });
  }, [rebarData]);

  const { data: cuttingData, isLoading: isCuttingLoading } =
    useCuttingTemplates();

  const cuttingServices = useMemo<ServiceItem[]>(() => {
    if (!cuttingData) return [];

    return cuttingData.map((t: CuttingTemplate) => ({
      id: t._id,
      templateId: t.templateId,
      shepName: t.shapeName,
      type: "cutting",
      title: t.shapeName,
      description: "Cutting template specification",
      image: t.imageUrl,
      cuts: t.cuts,
      specs: {
        material: t.materials.map((m) => m.material),
        thickness: Array.from(
          new Set(t.materials.flatMap((m) => m.thickness)),
        ).map(String),
        // We store the full materials structure in an extra property if needed for EditDialog,
        // but since EditDialog will likely fetch fresh or we can cast specs.material back.
        // Actually, let's keep ServiceItem specs compatible with UI and cast in Dialog.
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
      // Adding raw materials for EditDialog to access easily
      rawMaterials: t.materials,
    }));
  }, [cuttingData]);

  const { data: bendingData, isLoading: isBendingLoading } =
    useBendingTemplates();

  const bendingServices = useMemo<ServiceItem[]>(() => {
    if (!bendingData) return [];

    return bendingData.map((t: BendingTemplate) => {
      const baseItem: ServiceItem = {
        id: t._id,
        templateId: t.templateId,
        shepName: t.shapeName,
        type: "bending",
        title: t.shapeName,
        description: "Bending template specification",
        image: t.imageUrl,
        bend: t.bend,
        specs: {
          material: t.materials.map((m) => m.material),
          thickness: Array.from(
            new Set(t.materials.flatMap((m) => m.thickness)),
          ).map(String),
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
        rawMaterials: t.materials as unknown as CuttingMaterial[],
      };
      return baseItem;
    });
  }, [bendingData]);

  const [editingService, setEditingService] = useState<ServiceItem | null>(
    null,
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const deleteRebarTemplateMutation = useDeleteRebarTemplate();
  const deleteBendingTemplateMutation = useDeleteBendingTemplate();
  const deleteCuttingTemplateMutation = useDeleteCuttingTemplate();

  const handleEditClick = (service: ServiceItem) => {
    setEditingService(service);
    setIsDialogOpen(true);
  };

  const handleDeleteRebar = async (templateId: string) => {
    try {
      await deleteRebarTemplateMutation.mutateAsync(templateId);
      toast.success("Rebar template deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete rebar template");
    }
  };

  const handleDeleteBending = async (templateId: string) => {
    try {
      await deleteBendingTemplateMutation.mutateAsync(templateId);
      toast.success("Bending template deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete bending template");
    }
  };

  const handleDeleteCutting = async (templateId: string) => {
    try {
      await deleteCuttingTemplateMutation.mutateAsync(templateId);
      toast.success("Cutting template deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete cutting template");
    }
  };

  return (
    <div className="container mx-auto py-10 space-y-8">
      <EditServiceDialog
        key={editingService?.shepName ?? "dialog"}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        service={editingService}
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
          <div className="flex gap-2">
            <Link href={`/services/${activeTab}/calculation`}>
              <button className="bg-[#7E1800] cursor-pointer text-primary-foreground px-4 py-2 rounded-md hover:bg-[#7E1800]/90 transition-colors font-medium">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}{" "}
                Calculation
              </button>
            </Link>
            {activeTab === "rebar" && <CreateRebarTemplateDialog />}
            {activeTab === "bending" && <CreateBendingTemplateDialog />}
            {activeTab === "cutting" && <CreateCuttingTemplateDialog />}
          </div>
        </div>

        {/* Rebar Tab Content */}
        <TabsContent
          value="rebar"
          className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-2 duration-500"
        >
          {isRebarLoading ? (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {[...Array(4)].map((_, i) => (
                <ShapeCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {rebarServices.map((item) => (
                <ShapeCard
                  key={item.shepName}
                  item={item}
                  onEdit={() => handleEditClick(item)}
                  onDelete={() =>
                    item.templateId && handleDeleteRebar(item.templateId)
                  }
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
          {isCuttingLoading ? (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {[...Array(4)].map((_, i) => (
                <ShapeCardSkeleton key={i} />
              ))}
            </div>
          ) : cuttingServices.length === 0 ? (
            <div className="flex justify-center items-center py-20">
              <span className="text-muted-foreground">
                No cutting templates available.
              </span>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {cuttingServices.map((item) => (
                <ShapeCard
                  key={item.shepName}
                  item={item}
                  onEdit={() => handleEditClick(item)}
                  onDelete={() =>
                    item.templateId && handleDeleteCutting(item.templateId)
                  }
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Bending Tab Content */}
        <TabsContent
          value="bending"
          className="space-y-6 mt-6 animate-in fade-in-50 slide-in-from-bottom-2 duration-500"
        >
          {isBendingLoading ? (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {[...Array(4)].map((_, i) => (
                <ShapeCardSkeleton key={i} />
              ))}
            </div>
          ) : bendingServices.length === 0 ? (
            <div className="flex justify-center items-center py-20">
              <span className="text-muted-foreground">
                No bending templates available.
              </span>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {bendingServices.map((item) => (
                <ShapeCard
                  key={item.shepName}
                  item={item}
                  onEdit={() => handleEditClick(item)}
                  onDelete={() =>
                    item.templateId && handleDeleteBending(item.templateId)
                  }
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Reusable Shape Card Component
function ShapeCard({
  item,
  onEdit,
  onDelete,
}: {
  item: ServiceItem;
  onEdit: () => void;
  onDelete?: () => void;
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
        <div className="space-y-6">
          {(item.type === "cutting" || item.type === "bending") &&
          item.rawMaterials ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                <Layers className="h-4 w-4 text-[#7E1800]" />
                Materials & Thicknesses
              </div>
              <div className="grid grid-cols-1 gap-4">
                {item.rawMaterials.map((mat: CuttingMaterial, idx: number) => (
                  <div
                    key={idx}
                    className="flex flex-col gap-3 p-4 rounded-lg bg-[#7E1800]/5 border border-[#7E1800]/10 hover:bg-[#7E1800]/10 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="secondary"
                        className="font-bold bg-[#7E1800]/10 text-[#7E1800] border-transparent px-3 py-1"
                      >
                        {mat.material}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-2 ml-1">
                      {mat.thickness.map((t: number, tIdx: number) => (
                        <div
                          key={tIdx}
                          className="h-8 w-8 rounded-full flex items-center justify-center text-[10px] font-bold border border-[#7E1800]/20 bg-white text-[#7E1800] shadow-sm transform hover:scale-110 transition-transform"
                        >
                          {t}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
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
          )}
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

      {/* Edit & Delete Button Overlay or Footer */}
      <div className="px-6 pb-6 pt-0 flex gap-2">
        <button
          onClick={onEdit}
          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors border border-[#7E1800] text-[#7E1800] hover:bg-[#7E1800] hover:text-white cursor-pointer"
        >
          <Pencil className="h-4 w-4" />
          Edit Service Details
        </button>
        {onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="flex-none flex items-center justify-center p-2 rounded-lg text-sm font-medium transition-colors border border-destructive text-destructive hover:bg-destructive hover:text-white cursor-pointer"
            title="Delete Template"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>
    </Card>
  );
}

function ShapeCardSkeleton() {
  return (
    <Card className="overflow-hidden pt-0! pb-0! border-[#7E1800]/20 animate-pulse">
      <CardHeader className="bg-[#7E1800]/5 border-b border-[#7E1800]/20 pb-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-1/2 bg-[#7E1800]/10" />
          <Skeleton className="h-4 w-3/4 bg-[#7E1800]/5" />
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-8">
        <div className="flex justify-center">
          <Skeleton className="h-68 w-68 rounded-lg bg-[#7E1800]/5" />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Skeleton className="h-4 w-24 bg-[#7E1800]/10" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-16 rounded-full bg-[#7E1800]/5" />
              <Skeleton className="h-6 w-20 rounded-full bg-[#7E1800]/5" />
            </div>
          </div>
          <div className="space-y-3">
            <Skeleton className="h-4 w-24 bg-[#7E1800]/10" />
            <div className="flex gap-1.5">
              {[...Array(5)].map((_, i) => (
                <Skeleton
                  key={i}
                  className="h-8 w-8 rounded-full bg-[#7E1800]/5"
                />
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-2">
          <Skeleton className="h-4 w-40 bg-[#7E1800]/10" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-[#7E1800]/5 p-4 rounded-lg space-y-2">
                <Skeleton className="h-3 w-12 bg-[#7E1800]/5" />
                <Skeleton className="h-6 w-16 bg-[#7E1800]/10" />
              </div>
            ))}
          </div>
        </div>
      </CardContent>

      <div className="px-6 pb-6 pt-0">
        <Skeleton className="h-10 w-full rounded-lg bg-[#7E1800]/10" />
      </div>
    </Card>
  );
}
