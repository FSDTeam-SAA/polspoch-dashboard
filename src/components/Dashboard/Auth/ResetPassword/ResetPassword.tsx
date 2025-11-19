"use client";
import { useState } from "react";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import useAuth from "@/lib/hooks/useAuth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function ResetPassword() {
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { handleResetPassword, loading } = useAuth();
  const router = useRouter();

  // Handle Save
  const handleSave = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    const res = await handleResetPassword(newPassword);
    if (res.success) {
      toast.success("Password reset successfully!");
      router.push("/login");
    } else {
      toast.error(res.message || "Something went wrong!");
    }
  };

  return (
    <div className="mx-auto container">
      <div className="bg-white rounded-2xl shadow-md p-10">
        {/* Header */}
        <h2 className="text-3xl font-semibold text-gray-800 mb-2">
          Create a New Password
        </h2>
        <p className="text-gray-500 mb-6">
          Set a strong password to secure your account.
        </p>

        {/* New Password */}
        <label className="block text-gray-700 font-medium mb-1">
          New Password
        </label>
        <div className="relative mb-5">
          <input
            type={showPassword1 ? "text" : "password"}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-gray-500"
            placeholder="********"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowPassword1(!showPassword1)}
            className="absolute right-3 top-3 text-gray-500"
          >
            {showPassword1 ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* Confirm Password */}
        <label className="block text-gray-700 font-medium mb-1">
          Confirm New Password
        </label>
        <div className="relative mb-8">
          <input
            type={showPassword2 ? "text" : "password"}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-gray-500"
            placeholder="********"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowPassword2(!showPassword2)}
            className="absolute right-3 top-3 text-gray-500"
          >
            {showPassword2 ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* Save Button */}
        <button
          className={`w-full bg-red-700 text-white py-3 rounded-md text-lg font-medium hover:bg-red-800 transition flex justify-center items-center gap-2 cursor-pointer ${
            loading ? "cursor-not-allowed opacity-70" : ""
          }`}
          onClick={handleSave}
          disabled={loading}
        >
          {loading && <LoaderCircle />}
          {loading ? "Saving..." : "Confirm"}
        </button>
      </div>
    </div>
  );
}
