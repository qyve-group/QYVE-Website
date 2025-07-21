import { CiFlag1 } from 'react-icons/ci';
import { FaRegStar, FaRunning, FaStar } from 'react-icons/fa';
import { VscSmiley } from 'react-icons/vsc';

const Testimonial = () => {
  return (
    <div>
      <div className="content bg-customGray-300 p-10">
        <div className="flex items-center justify-center">
          <div className="mb-5 font-myFont text-2xl italic lg:text-4xl">
            TRIED AND TESTED
          </div>
        </div>
        <div className="mb-10 flex flex-col items-stretch justify-center gap-10 md:flex-row">
          <div className="flex-1 rounded-2xl bg-white p-4 text-center shadow-lg ">
            <div className="flex flex-col gap-5">
              <div className="flex flex-row justify-center">
                <FaStar className="text-primary" />
                <FaStar className="text-primary" />
                <FaStar className="text-primary" />
                <FaStar className="text-primary" />
                <FaStar className="text-primary" />
              </div>
              <div>
                “Fit dia sedap untuk sejenis kaki lebar... dalam lembut...
                kualiti berbaloi dengan harga.”
              </div>
              <div>Bazly Ahmad</div>
            </div>
          </div>

          <div className="flex-1 rounded-2xl bg-white p-4 text-center shadow-lg ">
            <div className="flex flex-col gap-5">
              <div className="flex flex-row justify-center">
                <FaStar className="text-primary" />
                <FaStar className="text-primary" />
                <FaStar className="text-primary" />
                <FaStar className="text-primary" />
                <FaRegStar />
              </div>
              <div>
                “I’ve used it for 3 games this week and I gotta say the socks is
                really good. Material and the grip is really outstanding.”
              </div>
              <div>Anonymous</div>
            </div>
          </div>

          <div className="flex-1 rounded-2xl bg-white p-4 text-center shadow-lg ">
            <div className="flex flex-col gap-5">
              <div className="flex flex-row justify-center">
                <FaStar className="text-primary" />
                <FaStar className="text-primary" />
                <FaStar className="text-primary" />
                <FaStar className="text-primary" />
                <FaRegStar />
              </div>
              <div className="h-">
                “Material superb. Quality beyond expectation.”
              </div>
              <div className="h-10">Razman</div>
            </div>
          </div>
        </div>
      </div>
      <div className="content bg-white p-10">
        {/* <div className="flex items-center justify-center">
          <div className="font-myFont italic text-4xl mb-5">
            TRIED AND TESTED
          </div>
        </div> */}
        <div className="mb-10 flex flex-col items-stretch justify-center gap-10 p-4 md:flex-row">
          <div className="flex items-center justify-center p-4">
            <div className="flex w-full flex-col gap-5 md:w-3/4">
              <div className="flex flex-row justify-center">
                <CiFlag1 className="font bold mr-2 text-4xl" />
                <div className=" text-2xl font-bold">Sapot Lokal</div>
              </div>
              <div className="text-center">
                Malaysia’s homegrown sports brand, wear it with pride.
              </div>
              {/* <div>Bazly Ahmad</div> */}
            </div>
          </div>

          <div className="flex-1 bg-white p-4 text-center ">
            <div className="flex w-full flex-col gap-5 md:w-3/4">
              <div className="flex flex-row justify-center ">
                <FaRunning className="mr-2 text-4xl" />
                <div className="text-2xl font-bold">Performance First</div>
              </div>
              <div className="text-center">
                Gear that enhances your performance with every play.{' '}
              </div>
              {/* <div>Anonymous</div> */}
            </div>
          </div>

          <div className="flex-1 bg-white p-4 text-center ">
            <div className="flex w-full flex-col gap-5 md:w-3/4">
              <div className="flex flex-row justify-center">
                <VscSmiley className="mr-2 text-4xl" />
                <div className="text-2xl font-bold">Crafted with Care</div>
              </div>
              <div className="text-center">
                Made by craftsmen who ensures every stitch is perfect.{' '}
              </div>
              {/* <div className="h-10">Razman</div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonial;
