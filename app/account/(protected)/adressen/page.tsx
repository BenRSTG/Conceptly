import type { Metadata } from "next";
import { requireCustomer } from "@/lib/auth/customer";
import { createAddress, updateAddress, deleteAddress } from "./actions";
import { AddressForm } from "./AddressForm";

export const metadata: Metadata = { title: "Meine Adressen" };

export default async function AddressesPage() {
  const { supabase, user } = await requireCustomer();
  const { data: addresses } = await supabase
    .from("addresses")
    .select("*")
    .eq("customer_id", user.id)
    .order("is_default", { ascending: false });

  return (
    <div>
      <h1 className="font-script text-3xl text-anthracite">Meine Adressen</h1>

      <div className="mt-6 space-y-6">
        {(addresses ?? []).map((address) => (
          <div key={address.id} className="rounded-2xl border border-anthracite/10 p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-anthracite">
                {address.label || "Adresse"} {address.is_default && "· Standard"}
              </p>
              <form action={deleteAddress.bind(null, address.id)}>
                <button type="submit" className="text-xs text-red-600 hover:underline">
                  Löschen
                </button>
              </form>
            </div>
            <div className="mt-3">
              <AddressForm
                action={updateAddress.bind(null, address.id)}
                defaultValues={address}
                submitLabel="Speichern"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-dashed border-anthracite/20 p-4">
        <h2 className="text-sm font-semibold tracking-wide text-anthracite uppercase">
          Neue Adresse
        </h2>
        <div className="mt-3">
          <AddressForm action={createAddress} submitLabel="Hinzufügen" />
        </div>
      </div>
    </div>
  );
}
