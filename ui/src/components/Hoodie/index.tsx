import { RadioGroup } from "@headlessui/react";
// import { useLocalStorageState } from "ahooks";
import clsx from "clsx";
import Card from "../Card";
import { useState } from "react";
import { DetailsDialog } from "../Details";
import cap1 from "../../assets/cap/cap-1.png";
import cap2 from "../../assets/cap/cap-2.png";
import cap3 from "../../assets/cap/cap-3.png";
import { Carousel } from "../Carousel";

const product = {
  name: "Bonfida - Cap",
  description: "",
  price: "$50",
  href: "#",
  imageSrc: cap1,
  imageAlt: "bonfida hoodie",
  colors: [
    { name: "Black", bgColor: "bg-[#021227]", selectedColor: "ring-[#021227]" },
  ],
  sizes: [
    { name: "XXS" },
    { name: "XS" },
    { name: "S" },
    { name: "M" },
    { name: "L" },
    { name: "XL" },
    { name: "XXL" },
  ],
};

export default function Hoodie({
  setStep,
}: {
  setStep: (arg: number) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedColor = product.colors[0];
  // const [selectedSize, setSelectedSize] = useLocalStorageState("size");

  return (
    <>
      <Card>
        <div className="grid items-start w-full grid-cols-1 md:mt-10 md:ml-10 gap-y-8 gap-x-6 sm:grid-cols-12 lg:items-center lg:gap-x-8">
          <div className="w-full h-auto bg-gray-100 rounded-lg aspect-square sm:col-span-4 lg:col-span-6">
            <Carousel items={[cap1, cap2, cap3]} />
          </div>
          <div className="sm:col-span-8 lg:col-span-6">
            <h2 className="text-xl font-medium text-gray-900 sm:pr-12">
              {product.name}
            </h2>

            <section aria-labelledby="information-heading" className="mt-1">
              <h3 id="information-heading" className="sr-only">
                Product information
              </h3>
            </section>
            <p className="mt-1 mb-3 text-xs text-black text-opacity-90">
              A premium quality adjustable snapback, carefully embroidered with
              the Bonfida logo. Exclusively produced for Bonfida Wolf holders.
            </p>

            <p className="text-lg font-medium text-gray-900">{product.price}</p>

            <section aria-labelledby="options-heading" className="mt-8">
              <h3 id="options-heading" className="sr-only">
                Product options
              </h3>

              <form>
                {/* Color picker */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Color</h4>

                  <RadioGroup
                    value={selectedColor}
                    onChange={() => console.log()}
                    className="mt-2"
                  >
                    <RadioGroup.Label className="sr-only">
                      Choose a color
                    </RadioGroup.Label>
                    <div className="flex items-center space-x-3">
                      {product.colors.map((color) => (
                        <RadioGroup.Option
                          key={color.name}
                          value={color}
                          className={({ active, checked }) =>
                            clsx(
                              color.selectedColor,
                              active && checked ? "ring ring-offset-1" : "",
                              !active && checked ? "ring-2" : "",
                              "-m-0.5 relative p-0.5 rounded-full flex items-center justify-center cursor-pointer focus:outline-none"
                            )
                          }
                        >
                          <RadioGroup.Label as="p" className="sr-only">
                            {color.name}
                          </RadioGroup.Label>
                          <span
                            aria-hidden="true"
                            className={clsx(
                              color.bgColor,
                              "h-8 w-8 rounded-full"
                            )}
                          />
                        </RadioGroup.Option>
                      ))}
                    </div>
                  </RadioGroup>
                </div>

                <button
                  // disabled={!selectedSize}
                  onClick={() => setStep(1)}
                  type="submit"
                  className="flex items-center justify-center w-full px-8 py-3 mt-8 text-base font-medium text-white bg-black border border-transparent rounded-[8px] focus:outline-none"
                >
                  Add to bag
                </button>
              </form>
              <p className="mt-4 text-center top-4 left-4">
                <button
                  onClick={() => setIsOpen(true)}
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  View full details
                </button>
              </p>
            </section>
          </div>
        </div>
      </Card>
      <DetailsDialog isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
}
