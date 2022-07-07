import Card from "../Card";
import { LockClosedIcon } from "@heroicons/react/solid";
import { useLocalStorageState } from "ahooks";
import validator from "validator";
import { toast } from "react-toastify";
import countries from "countries-list/dist/countries.json";
import { Country } from "countries-list";
import { DISALLOWED_COUNTRIES } from "../../utils/countries";

const styles = {
  input:
    "block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm",
  label: "block text-sm font-medium text-gray-700",
  nextButton:
    "flex items-center justify-center w-full px-8 py-3 mt-8 text-base font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500",
  backButton:
    "flex items-center justify-center w-full px-8 py-3 mt-2 text-base font-medium text-indigo-600 border-2 border-transparent border-indigo-600 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500",
};

const Example = ({ value }: { value: string }) => {
  return <p className="text-xs italic mt-[5px] ml-[5px]">Example: {value}</p>;
};

const Shipping = ({ setStep }: { setStep: (arg: number) => void }) => {
  const [email, setEmail] = useLocalStorageState("email", { defaultValue: "" });
  const [firstName, setFirstName] = useLocalStorageState("firstName", {
    defaultValue: "",
  });
  const [lastName, setLastName] = useLocalStorageState("lastName", {
    defaultValue: "",
  });
  const [address, setAddress] = useLocalStorageState("address", {
    defaultValue: "",
  });
  const [apartment, setApartment] = useLocalStorageState("apartment", {
    defaultValue: "",
  });
  const [city, setCity] = useLocalStorageState("city", { defaultValue: "" });
  const [country, setCountry] = useLocalStorageState("country", {
    defaultValue: "",
  });
  const [state, setState] = useLocalStorageState("state", { defaultValue: "" });
  const [postalCode, setPostalCode] = useLocalStorageState("postalCode", {
    defaultValue: "",
  });
  const [phone, setPhone] = useLocalStorageState("phone", { defaultValue: "" });
  const [discord, setDiscord] = useLocalStorageState("discord", {
    defaultValue: "",
  });

  const canSubmit =
    email &&
    firstName &&
    lastName &&
    address &&
    // apartment && // Don't make appartment mandatory
    city &&
    country &&
    state &&
    postalCode &&
    phone;

  const handleSubmit = () => {
    console.log(country);
    if (!email || !validator.isEmail(email)) {
      return toast.info("Invalid email");
    }
    if (!firstName || !validator.isAlpha(firstName.split(" ").join(""))) {
      return toast.info("Invalid first name");
    }
    if (!lastName || !validator.isAlpha(lastName.split(" ").join(""))) {
      return toast.info("Invalid last name");
    }
    if (!address) {
      return toast.info("Invalid address");
    }
    // Do not validate apartment
    if (!city || !validator.isAlpha(city.split(" ").join(""))) {
      return toast.info("Invalid city");
    }
    if (!country) {
      return toast.info("Invalid country");
    }
    if (!state || !validator.isAlpha(state.split(" ").join(""))) {
      return toast.info("Invalid state");
    }
    if (!postalCode || !validator.isPostalCode(postalCode, "any")) {
      return toast.info("Invalid postal code");
    }
    if (!phone || !validator.isMobilePhone(phone)) {
      return toast.info("Invalid phone number");
    }
    setStep(3);
  };

  return (
    <Card>
      <div className="w-full">
        <h2 className="sr-only">Checkout</h2>

        <form className="w-full">
          <div>
            <div>
              <h2 className="pl-10 text-lg font-medium text-gray-900">
                Contact information
              </h2>

              <div className="mt-4">
                <label htmlFor="email-address" className={styles.label}>
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value.trim())}
                    type="email"
                    id="email-address"
                    name="email-address"
                    autoComplete="email"
                    className={styles.input}
                  />
                </div>
                <Example value="jason@gmail.com" />
              </div>
            </div>

            <div className="pt-10 mt-10 border-t border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">
                Shipping information
              </h2>

              <div className="grid grid-cols-1 mt-4 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                <div>
                  <label htmlFor="first-name" className={styles.label}>
                    First name
                  </label>
                  <div className="mt-1">
                    <input
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      type="text"
                      id="first-name"
                      name="first-name"
                      autoComplete="given-name"
                      className={styles.input}
                    />
                  </div>
                  <Example value="Jason" />
                </div>

                <div>
                  <label htmlFor="last-name" className={styles.label}>
                    Last name
                  </label>
                  <div className="mt-1">
                    <input
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      type="text"
                      id="last-name"
                      name="last-name"
                      autoComplete="family-name"
                      className={styles.input}
                    />
                  </div>
                  <Example value="Montoya" />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="address" className={styles.label}>
                    Address
                  </label>
                  <div className="mt-1">
                    <input
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      type="text"
                      name="address"
                      id="address"
                      autoComplete="street-address"
                      className={styles.input}
                    />
                  </div>
                  <Example value="677 Black Oak Hollow Road" />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="apartment" className={styles.label}>
                    Apartment, suite, etc.
                  </label>
                  <div className="mt-1">
                    <input
                      value={apartment}
                      onChange={(e) => setApartment(e.target.value)}
                      type="text"
                      name="apartment"
                      id="apartment"
                      className={styles.input}
                    />
                  </div>
                  <Example value="3rd floor" />
                </div>

                <div>
                  <label htmlFor="city" className={styles.label}>
                    City
                  </label>
                  <div className="mt-1">
                    <input
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      type="text"
                      name="city"
                      id="city"
                      autoComplete="address-level2"
                      className={styles.input}
                    />
                  </div>
                  <Example value="Santa Clara" />
                </div>

                <div>
                  <label htmlFor="country" className={styles.label}>
                    Country
                  </label>
                  <div className="mt-1">
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      id="country"
                      name="country"
                      autoComplete="country-name"
                      className={styles.input}
                    >
                      <option></option>
                      {Object.keys(countries).map((e) => {
                        // @ts-ignore
                        const country = countries[e as string] as Country;
                        if (DISALLOWED_COUNTRIES.includes(e)) {
                          return null;
                        }
                        return <option>{country.name}</option>;
                      })}
                    </select>
                  </div>
                  <Example value="United States" />
                </div>

                <div>
                  <label htmlFor="region" className={styles.label}>
                    State / Province
                  </label>
                  <div className="mt-1">
                    <input
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      type="text"
                      name="region"
                      id="region"
                      autoComplete="address-level1"
                      className={styles.input}
                    />
                  </div>
                  <Example value="California" />
                </div>

                <div>
                  <label htmlFor="postal-code" className={styles.label}>
                    Postal code
                  </label>
                  <div className="mt-1">
                    <input
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      type="text"
                      name="postal-code"
                      id="postal-code"
                      autoComplete="postal-code"
                      className={styles.input}
                    />
                  </div>
                  <Example value="CA 95054" />
                </div>

                <div>
                  <label htmlFor="phone" className={styles.label}>
                    Phone
                  </label>
                  <div className="mt-1">
                    <input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      type="text"
                      name="phone"
                      id="phone"
                      autoComplete="tel"
                      className={styles.input}
                    />
                  </div>
                  <Example value="+14088458654" />
                </div>

                <div>
                  <label htmlFor="discord" className={styles.label}>
                    Discord
                  </label>
                  <div className="mt-1">
                    <input
                      value={discord}
                      onChange={(e) => setDiscord(e.target.value)}
                      type="text"
                      name="discord"
                      id="discord"
                      autoComplete="discord"
                      className={styles.input}
                    />
                  </div>
                  <Example value="jason#3309" />
                </div>
              </div>
            </div>
          </div>
          <p className="flex justify-center mt-6 text-sm font-medium text-gray-500">
            <LockClosedIcon
              className="w-5 h-5 text-gray-400 mr-1.5"
              aria-hidden="true"
            />
            Shipping details are stored encrypted
          </p>
        </form>
        <button
          disabled={!canSubmit}
          onClick={handleSubmit}
          type="submit"
          className={styles.nextButton}
        >
          Next
        </button>
        <button
          onClick={() => setStep(1)}
          type="submit"
          className={styles.backButton}
        >
          Back
        </button>
      </div>
    </Card>
  );
};

export default Shipping;
