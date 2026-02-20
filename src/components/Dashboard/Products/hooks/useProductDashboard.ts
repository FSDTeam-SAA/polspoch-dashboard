import { useState, useEffect, useRef } from "react";
import {
  useProducts,
  useDeleteProduct,
  useBulkUpdateProducts,
} from "@/lib/hooks/useProduct";
import { Product } from "@/lib/types/product";
import { BulkUpdateResponse } from "@/lib/services/productService";

export function useProductDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  // Modal states
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // Bulk update states
  const [isBulkResultsModalOpen, setIsBulkResultsModalOpen] = useState(false);
  const [bulkUpdateResults, setBulkUpdateResults] =
    useState<BulkUpdateResponse | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Search debounce effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1); // Reset to first page on search
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const {
    data: response,
    isLoading,
    error,
    isFetching,
  } = useProducts(currentPage, itemsPerPage, debouncedSearch);

  const deleteMutation = useDeleteProduct();
  const bulkUpdateMutation = useBulkUpdateProducts();

  const products = response?.data || [];

  const handleBulkUpdate = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const result = await bulkUpdateMutation.mutateAsync(formData);
      setBulkUpdateResults(result);
      setIsBulkResultsModalOpen(true);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      console.error("Bulk update handle error:", err);
    }
  };

  // API Alignment: Use response.meta.totalPages or calculate defensively
  const totalItems =
    response?.meta?.totalItems || response?.totalItems || response?.total || 0;
  const totalPages =
    response?.meta?.totalPages ||
    response?.totalPages ||
    Math.ceil(totalItems / itemsPerPage) ||
    1;

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (productToDelete) {
      await deleteMutation.mutateAsync(productToDelete._id);
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
    }
  };

  return {
    // State
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,

    // UI Data
    products,
    totalPages,
    totalItems,
    isLoading,
    isFetching,
    error,

    // Modal states
    selectedProduct,
    isModalOpen,
    setIsModalOpen,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    productToDelete,

    // Bulk update states
    isBulkResultsModalOpen,
    setIsBulkResultsModalOpen,
    bulkUpdateResults,
    fileInputRef,
    isBulkUpdatePending: bulkUpdateMutation.isPending,

    // Actions
    handleViewProduct,
    handleDeleteClick,
    confirmDelete,
    deletePending: deleteMutation.isPending,
    handleBulkUpdate,
  };
}
