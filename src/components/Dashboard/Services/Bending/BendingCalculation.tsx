"use client";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

const initialTable = [
  {
    thickness: 0.6,
    rawsteel: "",
    galvanized: 1.41,
    corten: "",
    teardrod: "",
    white: 1.96,
    red: 1.96,
    darkGreen: 1.96,
  },
  {
    thickness: 0.8,
    rawsteel: "",
    galvanized: 1.35,
    corten: "",
    teardrod: "",
    white: "",
    red: "",
    darkGreen: "",
  },
  {
    thickness: 1,
    rawsteel: "",
    galvanized: 1.29,
    corten: "",
    teardrod: "",
    white: "",
    red: "",
    darkGreen: "",
  },
  {
    thickness: 1.5,
    rawsteel: 1.08,
    galvanized: 1.26,
    corten: 1.7,
    teardrod: "",
    white: "",
    red: "",
    darkGreen: "",
  },
  {
    thickness: 2,
    rawsteel: 1.0,
    galvanized: 1.26,
    corten: 1.64,
    teardrod: "",
    white: "",
    red: "",
    darkGreen: "",
  },
  {
    thickness: 3,
    rawsteel: 0.99,
    galvanized: 1.26,
    corten: 1.55,
    teardrod: 1.38,
    white: "",
    red: "",
    darkGreen: "",
  },
  {
    thickness: 4,
    rawsteel: 0.99,
    galvanized: "",
    corten: 1.55,
    teardrod: 1.38,
    white: "",
    red: "",
    darkGreen: "",
  },
  {
    thickness: 5,
    rawsteel: 0.99,
    galvanized: "",
    corten: 1.55,
    teardrod: 1.38,
    white: "",
    red: "",
    darkGreen: "",
  },
  {
    thickness: 6,
    rawsteel: 1.008,
    galvanized: "",
    corten: 1.55,
    teardrod: "",
    white: "",
    red: "",
    darkGreen: "",
  },
];

export default function BendingCalculation() {
  const [rows, setRows] = useState(initialTable);

  const [labour, setLabour] = useState({
    startingPrice: 20,
    pricePerKg: 8,
  });

  const [margin, setMargin] = useState({
    value: 1.8,
  });

  const handleChange = (index: number, key: string, value: string) => {
    const updated = [...rows];
    // @ts-expect-error: key is typed as string but used to index specific object shape
    updated[index][key] = Number(value);
    setRows(updated);
  };

  const handleSubmit = () => {
    console.log("BENDING DATA:", rows);
    console.log("LABOUR", labour);
    console.log("MARGIN", margin);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-4xl font-bold mb-6 text-center">
        Bending Calculation
      </h2>
      <div className="flex justify-between items-center mb-6">
        <Link href="/services">
          <button className="px-4 py-2  text-black border border-[#7E1800] cursor-pointer font-semibold rounded-lg  hover:border hover:border-[#7E1800] hover:text-[#7E1800] flex items-center gap-2">
            <ArrowLeftIcon className="w-4 h-4" /> Back
          </button>
        </Link>
      </div>

      {/* MATERIAL TABLE */}
      <table className="w-full border border-black text-sm">
        <thead>
          <tr className="bg-gray-300">
            <th rowSpan={2} className="border border-black p-2">
              THICKNESS
            </th>
            <th colSpan={8} className="border border-black p-2">
              MATERIAL
            </th>
          </tr>
          <tr className="bg-gray-200">
            {[
              "RAWSTEEL",
              "GALVANIZED",
              "CORTEN",
              "TEARDROD",
              "WHITE",
              "RED",
              "DARK GREEN",
            ].map((h) => (
              <th key={h} className="border border-black p-2">
                {h}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((row, index) => (
            <tr key={row.thickness}>
              <td className="border border-black p-2 bg-gray-100 text-right">
                {row.thickness}
              </td>

              {(
                [
                  "rawsteel",
                  "galvanized",
                  "corten",
                  "teardrod",
                  "white",
                  "red",
                  "darkGreen",
                ] as const
              ).map((key) => (
                <td
                  key={key}
                  className={`border border-black p-1 text-center ${
                    row[key] !== "" ? "bg-yellow-200" : "bg-gray-200"
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
      <div className="flex gap-16 mb-10 mt-8">
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
              <td className="border border-black p-2 flex justify-between items-center">
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
              <td className="border border-black p-2 flex justify-between items-center">
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
              <td className="border border-black p-2 flex justify-between items-center">
                Cost × Margin
                <input
                  type="number"
                  step="0.1"
                  value={margin.value}
                  onChange={(e) => setMargin({ value: +e.target.value })}
                  className="w-20 bg-yellow-200 text-center outline-none"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="text-center mt-6">
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
