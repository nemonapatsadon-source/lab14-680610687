import { useEffect, useState } from "react";
import UserRegisterCard from "../components/UserRegisterCard";
import type { Registrant } from "../libs/Registrant";

export default function DashboardPage() {
  const [registrants, setRegistrants] = useState<Registrant[]>([]);

  // ---- อ่านข้อมูลจาก LocalStorage ----
  useEffect(() => {
    const loadData = () => {
      const data = localStorage.getItem("registrants");
      setRegistrants(data ? (JSON.parse(data) as Registrant[]) : []);
    };

    loadData(); // โหลดครั้งแรก
    window.addEventListener("registrants-updated", loadData);
    return () => window.removeEventListener("registrants-updated", loadData);
  }, []);

  // ---- ยอดรวมทั้งหมด ----
  const totalIncome = registrants.reduce((sum, r) => sum + r.total, 0);

  return (
    <div className="container mt-4">
      <h2>Dashboard</h2>

      {/* Conditional Rendering + Render Component */}
      {registrants.length === 0 ? (
        <div className="alert alert-warning mt-3" role="alert">
          No registrant found. 🙅‍♂️
        </div>
      ) : (
        <>
          <p className="text-muted">
            Total {registrants.length} registrant(s) • Income{" "}
            {totalIncome.toLocaleString()} THB
          </p>

          <div className="row g-3">
            {registrants.map((registrant) => (
              <div className="col-12 col-md-6 col-lg-4" key={registrant.id}>
                <UserRegisterCard registrant={registrant} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
