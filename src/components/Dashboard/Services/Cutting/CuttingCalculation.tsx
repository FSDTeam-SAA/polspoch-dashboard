"use client";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const initialTable = [
  { thickness: 1.5, rawsteel: 1.08, galvanized: 1.29, corten: 1.7 },
  { thickness: 2, rawsteel: 1.0, galvanized: 1.26, corten: 1.64 },
  { thickness: 3, rawsteel: 0.99, galvanized: 1.26, corten: 1.55 },
  { thickness: 4, rawsteel: 0.99, galvanized: 1.26, corten: 1.55 },
  { thickness: 5, rawsteel: 0.96, galvanized: "", corten: 1.55 },
  { thickness: 6, rawsteel: 0.96, galvanized: "", corten: 1.55 },
  { thickness: 8, rawsteel: 0.96, galvanized: "", corten: "" },
  { thickness: 10, rawsteel: 0.99, galvanized: "", corten: "" },
  { thickness: 12, rawsteel: 0.99, galvanized: "", corten: "" },
  { thickness: 14, rawsteel: 0.99, galvanized: "", corten: "" },
  { thickness: 15, rawsteel: 0.99, galvanized: "", corten: "" },
  { thickness: 16, rawsteel: 0.99, galvanized: "", corten: "" },
  { thickness: 18, rawsteel: 0.99, galvanized: "", corten: "" },
  { thickness: 20, rawsteel: 1.02, galvanized: "", corten: "" },
  { thickness: 22, rawsteel: 1.02, galvanized: "", corten: "" },
  { thickness: 25, rawsteel: 1.02, galvanized: "", corten: "" },
  { thickness: 30, rawsteel: 1.02, galvanized: "", corten: "" },
  { thickness: 32, rawsteel: 1.08, galvanized: "", corten: "" },
  { thickness: 35, rawsteel: 1.08, galvanized: "", corten: "" },
  { thickness: 40, rawsteel: 1.08, galvanized: "", corten: "" },
  { thickness: 45, rawsteel: 1.08, galvanized: "", corten: "" },
  { thickness: 50, rawsteel: 1.12, galvanized: "", corten: "" },
  { thickness: 55, rawsteel: 1.12, galvanized: "", corten: "" },
  { thickness: 60, rawsteel: 1.12, galvanized: "", corten: "" },
  { thickness: 70, rawsteel: 1.18, galvanized: "", corten: "" },
  { thickness: 80, rawsteel: 1.18, galvanized: "", corten: "" },
  { thickness: 90, rawsteel: 1.22, galvanized: "", corten: "" },
  { thickness: 100, rawsteel: 1.28, galvanized: "", corten: "" },
];

export default function CuttingCalculation() {
  const [rows, setRows] = useState(initialTable);

  const [labour, setLabour] = useState({
    startingPrice: 20,
    priceInternal: 1.5,
    numberCutting: 4,
  });

  const [margin, setMargin] = useState(1.6);

  const handleChange = (
    index: number,
    key: "rawsteel" | "galvanized" | "corten",
    value: string
  ) => {
    const updated = [...rows];
    updated[index][key] = Number(value);
    setRows(updated);
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
                    row[key] !== "" ? "bg-yellow-200" : "bg-gray-300"
                  }`}
                >
                  {row[key] !== "" && (
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

            <tr>
              <td className="border border-black p-2 flex justify-between">
                NUMBER CUTTING
                <input
                  type="number"
                  value={labour.numberCutting}
                  onChange={(e) =>
                    setLabour({ ...labour, numberCutting: +e.target.value })
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
