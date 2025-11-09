import React from 'react';

const SubZeroSizeChart = () => {
  const sizeData = [
    { eu: '38', uk: '5.5', mm: '252.99' },
    { eu: '39', uk: '6', mm: '259.66' },
    { eu: '40', uk: '7', mm: '266.33' },
    { eu: '41', uk: '7.5', mm: '273' },
    { eu: '42', uk: '8-8.5', mm: '279.67' },
    { eu: '43', uk: '9', mm: '286.34' },
    { eu: '44', uk: '10', mm: '293.01' },
  ];

  return (
    <section className="bg-gradient-to-b from-gray-50 to-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="mb-12 text-center text-4xl font-bold italic md:text-5xl">
            Size Chart
          </h2>

          <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-lg">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-[#0d3d5c] to-[#1a5a7a] text-white">
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">
                    EU Size
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">
                    UK Size
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">
                    Foot Length (mm)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sizeData.map((size, index) => (
                  <tr
                    key={size.eu}
                    className={`transition-colors hover:bg-gray-50 ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    }`}
                  >
                    <td className="whitespace-nowrap px-6 py-4 text-lg font-semibold text-gray-900">
                      {size.eu}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-lg text-gray-700">
                      {size.uk}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-lg text-gray-700">
                      {size.mm} mm
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 rounded-lg bg-blue-50 p-6 border border-blue-200">
            <h3 className="mb-3 text-lg font-bold text-blue-900">
              📏 How to Measure Your Foot
            </h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start">
                <span className="mr-2 font-bold">1.</span>
                <span>
                  Stand on a piece of paper with your heel against a wall
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 font-bold">2.</span>
                <span>
                  Mark the longest point of your foot on the paper
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 font-bold">3.</span>
                <span>
                  Measure the distance from the wall to the mark in millimeters
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 font-bold">4.</span>
                <span>
                  Find your size in the chart above based on your measurement
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SubZeroSizeChart;
