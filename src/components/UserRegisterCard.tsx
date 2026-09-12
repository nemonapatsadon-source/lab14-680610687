import type { Registrant } from "../libs/Registrant";

interface UserRegisterCardProps {
  registrant: Registrant;
}

export default function UserRegisterCard({
  registrant,
}: UserRegisterCardProps) {
  // registrant.gender === "male"   -> "👨 Male"
  // registrant.gender === "female" -> "👩 Female"
  const genderLabel = registrant.gender === "male" ? "👨 Male" : "👩 Female";

  return (
    <div className="card p-3">
      <h5 className="card-title fw-bold">{registrant.fullName}</h5>
      <p className="card-text mb-1">Gender : {genderLabel}</p>
      <p className="card-text mb-1">Plan : {registrant.plan}</p>
      <p className="card-text mb-0 text-success fw-semibold">
        Total Paid : {registrant.total.toLocaleString()} THB
      </p>
    </div>
  );
}
