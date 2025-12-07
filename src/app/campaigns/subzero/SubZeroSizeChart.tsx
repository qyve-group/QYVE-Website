import React from 'react';

const SubZeroSizeChart = () => {
  const sizeData = [
    { us: '6', uk: '5', eu: '37', cm: '24' },
    { us: '6.5', uk: '5.5', eu: '38.5', cm: '24.5' },
    { us: '7', uk: '6', eu: '39', cm: '25' },
    { us: '7.5', uk: '6.5', eu: '40', cm: '25.5' },
    { us: '8', uk: '7', eu: '40.5', cm: '26' },
    { us: '8.5', uk: '7.5', eu: '41', cm: '26.5' },
    { us: '9', uk: '8', eu: '42', cm: '27' },
    { us: '9.5', uk: '8.5', eu: '42.5', cm: '27.5' },
    { us: '10', uk: '9', eu: '43', cm: '28' },
    { us: '10.5', uk: '9.5', eu: '43', cm: '28.5' },
    { us: '11', uk: '10', eu: '44.5', cm: '29' },
    { us: '11.5', uk: '10.5', eu: '45', cm: '29.5' },
  ];

  return (
    <section className="from-gray-50 bg-gradient-to-b to-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-12 text-center text-4xl font-bold italic md:text-5xl">
            Size Chart
          </h2>

          <div className="border-gray-200 overflow-x-auto rounded-lg border bg-white shadow-lg">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-[#0d3d5c] to-[#1a5a7a] text-white">
                  <th className="px-6 py-4 text-center text-sm font-bold uppercase tracking-wider">
                    EU Size
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-bold uppercase tracking-wider">
                    UK Size
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-bold uppercase tracking-wider">
                    Foot Length (cm)
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
                    <td className="text-gray-900 whitespace-nowrap px-6 py-4 text-center text-lg font-semibold">
                      {size.us}
                    </td>
                    <td className="text-gray-900 whitespace-nowrap px-6 py-4 text-center text-lg font-semibold">
                      {size.eu}
                    </td>
                    <td className="text-gray-700 whitespace-nowrap px-6 py-4 text-center text-lg">
                      {size.uk}
                    </td>
                    <td className="text-gray-700 whitespace-nowrap px-6 py-4 text-center text-lg">
                      {size.cm} cm
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* <div className="mt-8 rounded-lg border border-blue-200 bg-blue-50 p-6">
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
                <span>Mark the longest point of your foot on the paper</span>
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
          </div> */}
        </div>
      </div>
    </section>
  );
};

export default SubZeroSizeChart;
