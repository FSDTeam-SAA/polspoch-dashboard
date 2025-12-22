"use client";
import { useServicesCalculation } from "@/lib/hooks/useServicesCalculation";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { RebarMaterialData, ServiceDetail } from "@/types/servicesCalculation";
import React, { useState } from "react";

export default function Calculation() {
  const { data: servicesCalculation, isLoading } = useServicesCalculation();

  if (isLoading) {
    return (
      <div className="p-6 text-center text-xl">Loading Calculation Data...</div>
    );
  }

  if (!servicesCalculation?.rebar) {
    return (
      <div className="p-6 text-center text-xl text-red-500">
        No Rebar Data Found
      </div>
    );
  }

  return <RebarForm initialData={servicesCalculation.rebar} />;
}

function RebarForm({
  initialData,
}: {
  initialData: ServiceDetail<RebarMaterialData>;
}) {
  const [rows, setRows] = useState<RebarMaterialData[]>(
    initialData.materialData || []
  );

  const [labour, setLabour] = useState(
    initialData.labour || {
      startingPrice: 10,
      pricePerKg: 0.2,
    }
  );

  const [margin, setMargin] = useState({
    value: initialData.margin || 1.6,
  });

  const handleChange = (index: number, value: string) => {
    const updated = [...rows];
    updated[index].price = Number(value);
    setRows(updated);
  };

  const handleSubmit = () => {
    console.log("Rebar Data:", rows);
    console.log("Labour Data:", labour);
    console.log("Margin Data:", margin);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-4xl font-bold mb-6 text-center">Rebar Calculation</h2>
      <div className="flex justify-between items-center mb-6">
        <Link href="/services">
          <button className="px-4 py-2  text-black border border-[#7E1800] cursor-pointer font-semibold rounded-lg  hover:border hover:border-[#7E1800] hover:text-[#7E1800] flex items-center gap-2">
            <ArrowLeftIcon className="w-4 h-4" /> Back
          </button>
        </Link>
      </div>

      {/* REBAR TABLE */}
      <table className="w-full border border-black mb-10">
        <thead>
          <tr className="bg-green-300">
            <th className="border border-black p-2">DIAMETER</th>
            <th className="border border-black p-2 bg-yellow-300">€/KG</th>
            <th className="border border-black p-2">WEIGHT/M</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={row.diameter} className="text-center">
              <td className="border border-black p-2">{row.diameter}</td>

              <td className="border border-black p-2 bg-yellow-200">
                <input
                  type="number"
                  value={row.price}
                  onChange={(e) => handleChange(index, e.target.value)}
                  className="w-full bg-transparent text-center outline-none"
                />
              </td>

              <td className="border border-black p-2">{row.weight}</td>
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
                    setLabour({
                      ...labour,
                      startingPrice: +e.target.value,
                    })
                  }
                  className="w-20 bg-yellow-200 text-center outline-none"
                />
              </td>
            </tr>

            <tr>
              <td className="border border-black p-2 flex justify-between">
                PRICE €/KG
                <input
                  type="number"
                  value={labour.pricePerKg}
                  onChange={(e) =>
                    setLabour({
                      ...labour,
                      pricePerKg: +e.target.value,
                    })
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
                  value={margin.value}
                  onChange={(e) => setMargin({ value: +e.target.value })}
                  className="w-20 bg-yellow-200 text-center outline-none"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* SUBMIT */}
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
