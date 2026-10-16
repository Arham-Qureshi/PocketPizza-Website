import { CustomerGate } from "@/components/auth/CustomerGate";
import { SettingsContent } from "./SettingsContent";

export default function SettingsPage() {
  return (
    <CustomerGate returnTo="/settings">
      <SettingsContent />
    </CustomerGate>
  );
}
