import { RadioGroup } from "@headlessui/react";
import { useLocalStorageState } from "ahooks";
import clsx from "clsx";
import Card from "../Card";

const product = {
  name: "Bonfida - Unisex hoodie",
  price: "$32",
  href: "#",
  imageSrc: "https://i.imgur.com/5RobrP1.png",
  imageAlt: "bonfida hoodie",
  colors: [
    { name: "Black", bgColor: "bg-[#34354a]", selectedColor: "ring-[#34354a]" },
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
  const selectedColor = product.colors[0];
  const [selectedSize, setSelectedSize] = useLocalStorageState("size");

  return (
    <Card>
      <div className="grid items-start w-full grid-cols-1 gap-y-8 gap-x-6 sm:grid-cols-12 lg:items-center lg:gap-x-8">
        <div className="overflow-hidden bg-gray-100 rounded-lg aspect-w-2 aspect-h-3 sm:col-span-4 lg:col-span-5">
          <img
            src={product.imageSrc}
            alt={product.imageAlt}
            className="object-cover object-center"
          />
        </div>
        <div className="sm:col-span-8 lg:col-span-7">
          <h2 className="text-xl font-medium text-gray-900 sm:pr-12">
            {product.name}
          </h2>

          <section aria-labelledby="information-heading" className="mt-1">
            <h3 id="information-heading" className="sr-only">
              Product information
            </h3>

            <p className="font-medium text-gray-900">{product.price}</p>
          </section>

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
                            "h-8 w-8 border border-black border-opacity-10 rounded-full"
                          )}
                        />
                      </RadioGroup.Option>
                    ))}
                  </div>
                </RadioGroup>
              </div>

              {/* Size picker */}
              <div className="mt-8">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-gray-900">Size</h4>
                  <a
                    href="#"
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Size guide
                  </a>
                </div>

                <RadioGroup
                  value={selectedSize}
                  onChange={setSelectedSize}
                  className="mt-2"
                >
                  <RadioGroup.Label className="sr-only">
                    Choose a size
                  </RadioGroup.Label>
                  <div className="grid grid-cols-7 gap-2">
                    {product.sizes.map((size) => (
                      <RadioGroup.Option
                        key={size.name}
                        value={size}
                        className={({ active, checked }) =>
                          clsx(
                            "cursor-pointer focus:outline-none",
                            active
                              ? "ring-2 ring-offset-2 ring-indigo-500"
                              : "",
                            checked
                              ? "bg-indigo-600 border-transparent text-white hover:bg-indigo-700"
                              : "bg-white border-gray-200 text-gray-900 hover:bg-gray-50",
                            "border rounded-md py-3 px-3 flex items-center justify-center text-sm font-medium uppercase sm:flex-1"
                          )
                        }
                      >
                        <RadioGroup.Label as="p">{size.name}</RadioGroup.Label>
                      </RadioGroup.Option>
                    ))}
                  </div>
                </RadioGroup>
              </div>

              <button
                disabled={!selectedSize}
                onClick={() => setStep(1)}
                type="submit"
                className="flex items-center justify-center w-full px-8 py-3 mt-8 text-base font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Add to bag
              </button>

              <p className="mt-4 text-center top-4 left-4">
                <a
                  href={product.href}
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  View full details
                </a>
              </p>
            </form>
          </section>
        </div>
      </div>
    </Card>
  );
}
