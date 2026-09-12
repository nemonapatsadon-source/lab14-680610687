import { useRef, useState } from "react";
import type { Registrant } from "../libs/Registrant";

//---- แผนการวิ่ง ----
const plans = [
  { id: "funrun", label: "Fun run 5.5 Km", price: 500 },
  { id: "mini", label: "Mini Marathon 10 Km", price: 800 },
  { id: "half", label: "Half Marathon 21 Km", price: 1200 },
  { id: "full", label: "Full Marathon 42.195 Km", price: 1500 },
];
// ---- สินค้าเสริม ----
const extraItems = [
  { id: "bottle", label: "Bottle 🍼", price: 200 },
  { id: "shoes", label: "Shoes 👟", price: 600 },
  { id: "cap", label: "Cap 🧢", price: 400 },
];

export default function ModalRegister() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [plan, setPlan] = useState("");
  const [gender, setGender] = useState("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [agree, setAgree] = useState(false);

  // ---- error states ----
  const [errFirstName, setErrFirstName] = useState(false);
  const [errLastName, setErrLastName] = useState(false);
  const [errPlan, setErrPlan] = useState(false);
  const [errGender, setErrGender] = useState(false);

  const closeBtnRef = useRef<HTMLButtonElement>(null);

  // ---- ส่วนลด 20% เมื่อเลือกครบทุกชิ้น ----
  const hasDiscount = selectedItems.length === extraItems.length;

  // ---- คำนวณราคารวม ----
  const planPrice = plans.find((p) => p.id === plan)?.price ?? 0;
  const itemsPrice = selectedItems.reduce(
    (sum, id) => sum + (extraItems.find((i) => i.id === id)?.price ?? 0),
    0,
  );
  const total = hasDiscount
    ? (planPrice + itemsPrice) * 0.8
    : planPrice + itemsPrice;

  // ---- toggle สินค้าเสริม ----
  const toggleItem = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setPlan("");
    setGender("");
    setSelectedItems([]);
    setAgree(false);
    setErrFirstName(false);
    setErrLastName(false);
    setErrPlan(false);
    setErrGender(false);
  };

  // ---- กดปุ่ม Register ----
  const handleRegister = () => {
    const eFirst = firstName.trim() === "";
    const eLast = lastName.trim() === "";
    const ePlan = plan === "";
    const eGender = gender === "";

    setErrFirstName(eFirst);
    setErrLastName(eLast);
    setErrPlan(ePlan);
    setErrGender(eGender);

    if (eFirst || eLast || ePlan || eGender) return;

    const registrant: Registrant = {
      id: Date.now(),
      fullName: `${firstName.trim()} ${lastName.trim()}`,
      gender: gender,
      plan: plans.find((p) => p.id === plan)?.label ?? "",
      total: total,
    };

    // บันทึกลง LocalStorage
    const old: Registrant[] = JSON.parse(
      localStorage.getItem("registrants") ?? "[]",
    );
    localStorage.setItem("registrants", JSON.stringify([...old, registrant]));

    alert(
      `Registration complete. Please pay money for ${total.toLocaleString()} THB.`,
    );

    resetForm();
    closeBtnRef.current?.click(); // ปิด modal
  };

  return (
    <div
      className="modal fade"
      id="modalregister"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabIndex={-1}
      aria-labelledby="modalregisterLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Register CMU Marathon 🏃‍♂️</h5>
            <button
              ref={closeBtnRef}
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={resetForm}
            ></button>
          </div>

          <div className="modal-body">
            {/* ---- ชื่อ - นามสกุล ---- */}
            <div className="d-flex gap-2">
              <div>
                <label className="form-label">First name</label>
                <input
                  className={`form-control ${errFirstName ? "is-invalid" : ""}`}
                  value={firstName}
                  onChange={(e) => {
                    setFirstName(e.target.value);
                    setErrFirstName(false);
                  }}
                />
                {errFirstName && (
                  <div className="invalid-feedback">Invalid first name</div>
                )}
              </div>
              <div>
                <label className="form-label">Last name</label>
                <input
                  className={`form-control ${errLastName ? "is-invalid" : ""}`}
                  value={lastName}
                  onChange={(e) => {
                    setLastName(e.target.value);
                    setErrLastName(false);
                  }}
                />
                {errLastName && (
                  <div className="invalid-feedback">Invalid last name</div>
                )}
              </div>
            </div>

            {/* ---- Plan ---- */}
            <div className="mt-2">
              <label className="form-label">Plan</label>
              <select
                className={`form-select ${errPlan ? "is-invalid" : ""}`}
                value={plan}
                onChange={(e) => {
                  setPlan(e.target.value);
                  setErrPlan(false);
                }}
              >
                <option value="">Please select..</option>
                {plans.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label} ({p.price.toLocaleString()} THB)
                  </option>
                ))}
              </select>
              {errPlan && (
                <div className="invalid-feedback">Please select a plan</div>
              )}
            </div>

            {/* ---- Gender ---- */}
            <div className="mt-2">
              <label className="form-label">Gender</label>
              <div>
                <input
                  className="me-2 form-check-input"
                  type="radio"
                  name="gender"
                  checked={gender === "male"}
                  onChange={() => {
                    setGender("male");
                    setErrGender(false);
                  }}
                />
                Male 👨
                <input
                  className="mx-2 form-check-input"
                  type="radio"
                  name="gender"
                  checked={gender === "female"}
                  onChange={() => {
                    setGender("female");
                    setErrGender(false);
                  }}
                />
                Female 👩
              </div>
              {errGender && (
                <div className="text-danger small">Please select gender</div>
              )}
            </div>

            {/* ---- Extra Items ---- */}
            <div>
              <label className="form-label">Extra Item(s)</label>
              {extraItems.map((item) => (
                <div key={item.id}>
                  <input
                    className="me-2 form-check-input"
                    type="checkbox"
                    checked={selectedItems.includes(item.id)}
                    onChange={() => toggleItem(item.id)}
                  />
                  <label className="form-check-label">
                    {item.label} ({item.price.toLocaleString()} THB)
                  </label>
                </div>
              ))}
              {/* conditional เมื่อเลือกสินค้าเสริมทั้งหมด ให้แสดง discount*/}
              {hasDiscount && (
                <span className="text-success d-block">(20% Discounted)</span>
              )}
            </div>

            <div className="alert alert-primary mt-3" role="alert">
              Promotion📢 Buy all items to get 20% Discount
            </div>

            <div>Total Payment : {total.toLocaleString()} THB</div>
          </div>

          <div className="modal-footer">
            <div>
              <input
                className="me-2 form-check-input"
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
              />
              I agree to the terms and conditions
            </div>
            <button
              className="btn btn-success my-2"
              disabled={!agree}
              onClick={handleRegister}
            >
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
