import React from 'react';

const SubZeroSizeChart = () => {
  const sizeData = [
    { uk: '5.5', eu: '39', cm: '24.5' },
    { uk: '6', eu: '40', cm: '25' },
    { uk: '6.5', eu: '40.5', cm: '25.5' },
    { uk: '7', eu: '41', cm: '26' },
    { uk: '7.5', eu: '42', cm: '26.5' },
    { uk: '8', eu: '42.5', cm: '27' },
    { uk: '8.5', eu: '43', cm: '27.5' },
    { uk: '9', eu: '44', cm: '28' },
    { uk: '9.5', eu: '44.5', cm: '28.5' },
    { uk: '10', eu: '45', cm: '29' },
    { uk: '10.5', eu: '45.5', cm: '29.5' },
  ];

  return (
    <section
      id="subzero_size"
      className="from-gray-50 bg-gradient-to-b to-white py-12 sm:py-16 md:py-24"
    >
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-8 text-center text-3xl font-bold italic sm:mb-10 sm:text-4xl md:mb-12 md:text-5xl">
            Size Chart
          </h2>

          {/* Mobile: Card Layout */}
          <div className="grid gap-2 sm:hidden">
            {sizeData.map((size) => (
              <div
                key={size.eu}
                className="border-gray-200 flex items-center justify-between rounded-lg border bg-white p-4 shadow-sm"
              >
                <div className="text-center">
                  <div className="text-gray-500 text-xs font-medium uppercase">
                    UK
                  </div>
                  <div className="text-gray-900 text-lg font-bold">
                    {size.uk}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-gray-500 text-xs font-medium uppercase">
                    EU
                  </div>
                  <div className="text-gray-700 text-lg font-semibold">
                    {size.eu}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-gray-500 text-xs font-medium uppercase">
                    CM
                  </div>
                  <div className="text-gray-700 text-lg font-semibold">
                    {size.cm}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Tablet & Desktop: Table Layout */}
          <div className="border-gray-200 hidden overflow-hidden rounded-lg border bg-white shadow-lg sm:block">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-[#0d3d5c] to-[#1a5a7a] text-white">
                  <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider sm:px-6 sm:py-4 sm:text-sm">
                    UK Size
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider sm:px-6 sm:py-4 sm:text-sm">
                    EU Size
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider sm:px-6 sm:py-4 sm:text-sm">
                    CM Length
                  </th>
                </tr>
              </thead>
              <tbody className="divide-gray-200 divide-y">
                {sizeData.map((size, index) => (
                  <tr
                    key={size.eu}
                    className={`hover:bg-gray-50 transition-colors ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    }`}
                  >
                    <td className="text-gray-900 whitespace-nowrap px-4 py-3 text-center text-base font-semibold sm:px-6 sm:py-4 sm:text-lg">
                      {size.uk}
                    </td>
                    <td className="text-gray-700 whitespace-nowrap px-4 py-3 text-center text-base sm:px-6 sm:py-4 sm:text-lg">
                      {size.eu}
                    </td>
                    <td className="text-gray-700 whitespace-nowrap px-4 py-3 text-center text-base sm:px-6 sm:py-4 sm:text-lg">
                      {size.cm}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SubZeroSizeChart;
