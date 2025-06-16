import { FaRegStar } from 'react-icons/fa';
import { CiFlag1 } from 'react-icons/ci';
import { FaRunning } from 'react-icons/fa';
import { VscSmiley } from 'react-icons/vsc';

const Testimonial = () => {
  return (
    <div>
      <div className="content bg-customGray-300 p-10">
        <div className="flex items-center justify-center">
          <div className="mb-5 font-myFont text-4xl italic">
            TRIED AND TESTED
          </div>
        </div>
        <div className="mb-10 flex flex-col items-stretch justify-center gap-10 md:flex-row">
          <div className="flex-1 rounded-2xl bg-white p-4 text-center shadow-lg ">
            <div className="flex flex-col gap-5">
              <div className="flex flex-row justify-center">
                <FaRegStar />
                <FaRegStar />
                <FaRegStar />
                <FaRegStar />
                <FaRegStar />
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
                <FaRegStar />
                <FaRegStar />
                <FaRegStar />
                <FaRegStar />
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
                <FaRegStar />
                <FaRegStar />
                <FaRegStar />
                <FaRegStar />
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
        <div className="mb-10 flex flex-col items-stretch justify-center gap-10 md:flex-row p-4">
          <div className="flex-1 p-4 text-center bg-blue-300">
            <div className="flex flex-col gap-5 w-3/4">
              <div className="flex flex-row justify-center">
                <CiFlag1 className="text-2xl mr-2" />
                <div>Sapot Lokal</div>
              </div>
              <div className="text-justify">
                Malaysia’s homegrown sports brand, wear it with pride.
              </div>
              {/* <div>Bazly Ahmad</div> */}
            </div>
          </div>

          <div className="flex-1 bg-white p-4 text-center ">
            <div className="flex flex-col gap-5 w-3/4">
              <div className="flex flex-row justify-center ">
                <FaRunning className="text-2xl mr-2" />
                <div>Performance First</div>
              </div>
              <div className="text-justify">
                Gear that enhances your performance with every play.{' '}
              </div>
              {/* <div>Anonymous</div> */}
            </div>
          </div>

          <div className="flex-1  bg-white p-4 text-center ">
            <div className="flex flex-col gap-5 w-3/4">
              <div className="flex flex-row justify-center">
                <VscSmiley className="text-2xl mr-2" />
                <div>Crafted with Care</div>
              </div>
              <div className="text-justify">
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
