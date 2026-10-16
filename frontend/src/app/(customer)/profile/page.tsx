import { CustomerGate } from "@/components/auth/CustomerGate";
import { ProfileContent } from "./ProfileContent";

export default function ProfilePage() {
  return (
    <CustomerGate returnTo="/profile">
      <ProfileContent />
    </CustomerGate>
  );
}
