"use client";
import { useServicesCalculation } from "@/lib/hooks/useServicesCalculation";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import {
  CuttingMaterialData,
  ServiceDetail,
} from "@/types/servicesCalculation";
import { useState } from "react";

export default function CuttingCalculation() {
  const { data: servicesCalculation, isLoading } = useServicesCalculation();

  if (isLoading) {
    return (
      <div className="p-6 text-center text-xl">Loading Calculation Data...</div>
    );
  }

  if (!servicesCalculation?.cutting) {
    return (
      <div className="p-6 text-center text-xl text-red-500">
        No Cutting Data Found
      </div>
    );
  }

  return <CuttingForm initialData={servicesCalculation.cutting} />;
}

function CuttingForm({
  initialData,
}: {
  initialData: ServiceDetail<CuttingMaterialData>;
}) {
  const [rows, setRows] = useState<CuttingMaterialData[]>(
    initialData.materialData || []
  );

  const [labour, setLabour] = useState(
    initialData.labour || {
      startingPrice: 20,
      priceInternal: 1.5,
    }
  );

  const [margin, setMargin] = useState(initialData.margin || 1.6);

  const handleChange = (
    index: number,
    key: keyof CuttingMaterialData,
    value: string
  ) => {
    setRows((prev) =>
      prev.map((row, i) =>
        i === index ? { ...row, [key]: Number(value) } : row
      )
    );
  };

  const handleSubmit = () => {
    console.log("Cutting Material Data:", rows);
    console.log("Cutting Labour Data:", labour);
    console.log("Cutting Margin Data:", margin);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold mb-4 text-center">
        Cutting Calculation
      </h1>

      <div className="flex justify-between items-center mb-6">
        <Link href="/services">
          <button className="px-4 py-2 border border-[#7E1800] rounded-lg flex items-center gap-2 hover:text-[#7E1800] cursor-pointer">
            <ArrowLeftIcon className="w-4 h-4" /> Back
          </button>
        </Link>
      </div>

      {/* MATERIAL TABLE */}
      <table className="border border-black w-full text-sm mb-8">
        <thead>
          <tr className="bg-gray-300">
            <th rowSpan={2} className="border border-black p-2">
              THICKNESS
            </th>
            <th colSpan={3} className="border border-black p-2">
              MATERIAL
            </th>
          </tr>
          <tr className="bg-gray-200">
            <th className="border border-black p-2">RAWSTEEL</th>
            <th className="border border-black p-2">GALVANIZED</th>
            <th className="border border-black p-2">CORTEN</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((row, index) => (
            <tr key={row.thickness}>
              <td className="border border-black p-2 text-right bg-gray-100">
                {row.thickness}
              </td>

              {(["rawsteel", "galvanized", "corten"] as const).map((key) => (
                <td
                  key={key}
                  className={`border border-black p-1 text-center ${
                    row[key] !== 0 ? "bg-yellow-200" : "bg-gray-300"
                  }`}
                >
                  {row[key] !== 0 && (
                    <input
                      type="number"
                      value={row[key]}
                      onChange={(e) => handleChange(index, key, e.target.value)}
                      className="w-full bg-transparent text-center outline-none"
                    />
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* LABOUR & MARGIN */}
      <div className="flex gap-16 mb-10">
        {/* LABOUR */}
        <table className="border border-black w-80">
          <thead>
            <tr>
              <th className="bg-blue-300 text-left p-2 border border-black">
                LABOUR
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-black p-2 flex justify-between">
                STARTING PRICE
                <input
                  type="number"
                  value={labour.startingPrice}
                  onChange={(e) =>
                    setLabour({ ...labour, startingPrice: +e.target.value })
                  }
                  className="w-20 bg-yellow-200 text-center outline-none"
                />
              </td>
            </tr>

            <tr>
              <td className="border border-black p-2 flex justify-between">
                PRICE × INTERNAL
                <input
                  type="number"
                  value={labour.priceInternal}
                  onChange={(e) =>
                    setLabour({ ...labour, priceInternal: +e.target.value })
                  }
                  className="w-20 bg-yellow-200 text-center outline-none"
                />
              </td>
            </tr>
          </tbody>
        </table>

        {/* MARGIN */}
        <table className="border border-black w-64">
          <thead>
            <tr>
              <th className="bg-blue-300 text-left p-2 border border-black">
                MARGIN
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-black p-2 flex justify-between">
                Cost × Margin
                <input
                  type="number"
                  step="0.1"
                  value={margin}
                  onChange={(e) => setMargin(+e.target.value)}
                  className="w-20 bg-yellow-200 text-center outline-none"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="text-center">
        <button
          onClick={handleSubmit}
          className="px-8 py-2 bg-[#7E1800] text-white font-semibold rounded-lg hover:bg-[#7E1800] cursor-pointer"
        >
          Submit
        </button>
      </div>
    </div>
  );
}
