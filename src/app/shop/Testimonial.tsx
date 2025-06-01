import { FaRegStar } from 'react-icons/fa';

const Testimonial = () => {
  return (
    <div>
      <div className="content bg-customGray-300 p-10">
        <div className="flex items-center justify-center">
          <div className="font-myFont italic text-4xl mb-5">
            TRIED AND TESTED
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-stretch justify-center gap-10 mb-10">
          <div className="flex-1 rounded-2xl bg-white text-center p-4 shadow-lg ">
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

          <div className="flex-1 rounded-2xl bg-white text-center p-4 shadow-lg ">
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

          <div className="flex-1 rounded-2xl bg-white text-center p-4 shadow-lg ">
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
        <div className="flex flex-col md:flex-row items-stretch justify-center gap-10 mb-10">
          <div className="flex-1 bg-white text-center p-4  ">
            <div className="flex flex-col gap-5">
              <div className="flex flex-row justify-center">Sapot Lokal</div>
              <div>Malaysia’s homegrown sports brand, wear it with pride.</div>
              {/* <div>Bazly Ahmad</div> */}
            </div>
          </div>

          <div className="flex-1 bg-white text-center p-4 ">
            <div className="flex flex-col gap-5">
              <div className="flex flex-row justify-center">
                Performance First
              </div>
              <div>Gear that enhances your performance with every play. </div>
              {/* <div>Anonymous</div> */}
            </div>
          </div>

          <div className="flex-1  bg-white text-center p-4 ">
            <div className="flex flex-col gap-5">
              <div className="flex flex-row justify-center">
                Crafted with Care
              </div>
              <div className="h-">
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
