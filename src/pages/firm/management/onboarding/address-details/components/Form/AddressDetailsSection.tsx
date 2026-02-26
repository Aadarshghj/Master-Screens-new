import React from "react";
import { Card } from "@/components/ui/card";
import { TitleHeader } from "@/components/ui/title-header/TitleHeader";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import type { Address } from "@/types/firm/firm-address.types";

interface AddressDetailsSectionProps {
  savedAddresses: Address[];
  onEdit: (addressId: string) => void;
  onDelete: (addressId: string) => void;
  readonly?: boolean;
}

interface AddressCardProps {
  address: Address;
  onEdit: (addressId: string) => void;
  onDelete: (addressId: string) => void;
  readonly?: boolean;
}

const AddressCard: React.FC<AddressCardProps> = ({
  address,
  onEdit,
  onDelete,
  readonly = false,
}) => {
  const truncateText = (text: string, maxLength = 60) => {
    if (!text) return "";
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  };

  const line1 = truncateText(
    [address.streetLaneName, address.placeName].filter(Boolean).join(", "),
    70
  );

  const line2 = truncateText(address.landmark || "", 70);

  const line3 = truncateText(
    [address.state, address.district, address.city].filter(Boolean).join(", "),
    60
  );

  const line4 = address.pinCode || "";
  const line5 = truncateText(address.postOffice || "", 70);
  const countryLine = address.country || "";

  return (
    <Card className="relative w-full bg-blue-50 p-3">
      <div className="flex items-start justify-between">
        <div className="mt-5 text-[11px] leading-tight text-gray-600">
          <h3 className="mb-2 text-sm font-semibold text-gray-900">
            {address.addressType}
          </h3>

          {line1 && <p>{line1}</p>}
          {line2 && <p>{line2}</p>}
          {line3 && <p>{line3}</p>}
          {line4 && <p>{line4}</p>}
          {line5 && <p>{line5}</p>}
          {countryLine && <p>{countryLine}</p>}
        </div>

        <div className="flex gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-5 w-5"
            onClick={() => !readonly && onEdit(address.addressId || "")}
            disabled={readonly}
          >
            <Pencil className="text-primary h-3 w-3" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-5 w-5"
            onClick={() => !readonly && onDelete(address.addressId || "")}
            disabled={readonly}
          >
            <Trash2 className="text-destructive h-3 w-3" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export const AddressDetailsSection: React.FC<AddressDetailsSectionProps> = ({
  savedAddresses,
  onEdit,
  onDelete,
  readonly = false,
}) => {
  if (savedAddresses.length === 0) {
    return (
      <div className="mt-8">
        <TitleHeader title="Address Details" />
        <div className="mt-4 min-h-[600px] rounded-lg border border-gray-200 bg-white p-4">
          <div className="flex items-start justify-center pt-8">
            <p className="text-xs text-gray-400">No Address Details Found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <TitleHeader title="Address Details" />

      {/* Outer container box with reduced padding for wider cards */}
      <div className="mt-4 min-h-[400px]  border bg-gray-50 p-4">
        <div className="space-y-2.5">
          {savedAddresses.map((address, index) => (
            <AddressCard
              key={address.addressId || `${address.addressType}-${index}`}
              address={address}
              onEdit={onEdit}
              onDelete={onDelete}
              readonly={readonly}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
