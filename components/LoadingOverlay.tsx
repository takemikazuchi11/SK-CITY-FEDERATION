'use client'
import { useLoading } from "@/lib/loading-context";
import LoadingSpinner from "@/components/loading-spinner";

export default function LoadingOverlay() {
  const { loading } = useLoading();
  return <LoadingSpinner show={loading} />;
} 