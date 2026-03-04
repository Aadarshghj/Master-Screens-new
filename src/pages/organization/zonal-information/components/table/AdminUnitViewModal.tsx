import React from "react";
import { CircleX } from "lucide-react";
import { FormContainer } from "@/components/ui/form-container";
import { Input } from "@/components/ui";
import { Form } from "@/components";
import NeumorphicButton from "@/components/ui/neumorphic-button/neumorphic-button";
import type { BranchResponseDto } from "@/types/organisation/admin-unit";

interface AdminUnitViewModalProps {
  row: BranchResponseDto | null;
  onClose: () => void;
  adminUnitTypeLabel?: string;
}

const ReadOnlyInput: React.FC<{ value?: string | number | boolean | null }> = ({
  value,
}) => (
  <Input
    readOnly
    value={value === true ? "Yes" : value === false ? "No" : (value ?? "-")}
    size="form"
    variant="form"
    className="bg-gray-50"
  />
);

export const AdminUnitViewModal: React.FC<AdminUnitViewModalProps> = ({
  row,
  onClose,
  adminUnitTypeLabel = "Branch",
}) => {
  if (!row) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 p-4">
      <div
        role="dialog"
        aria-modal="true"
        className="relative z-60 mx-auto mt-[5vh] w-full max-w-6xl rounded-lg bg-white shadow-xl"
      >
        <div className="max-h-[90vh] overflow-x-visible overflow-y-auto p-6">
          <FormContainer className="relative">
            <header>
              <div className="flex justify-end">
                <NeumorphicButton
                  type="button"
                  variant="default"
                  onClick={onClose}
                  className="bottom-2 left-8 bg-transparent p-1 shadow-none hover:bg-transparent"
                  aria-label="Close"
                >
                  <CircleX className="h-6 w-6 text-red-500" />
                </NeumorphicButton>
              </div>

              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-gray-800">
                  {adminUnitTypeLabel} Details
                </h2>
              </div>
            </header>

            <section className="mt-3 rounded-lg border bg-white p-3">
              <p className="mb-2 text-xs font-semibold text-gray-800">
                General Information
              </p>

              <Form onSubmit={e => e.preventDefault()}>
                <Form.Row>
                  <Form.Col lg={2} md={6} span={12}>
                    <Form.Field label="Admin Unit Type">
                      <ReadOnlyInput value={adminUnitTypeLabel} />
                    </Form.Field>
                  </Form.Col>

                  <Form.Col lg={2} md={6} span={12}>
                    <Form.Field label={`${adminUnitTypeLabel} Code`}>
                      <ReadOnlyInput value={row.branchCode} />
                    </Form.Field>
                  </Form.Col>

                  <Form.Col lg={3} md={6} span={12}>
                    <Form.Field label={`${adminUnitTypeLabel} Name`}>
                      <ReadOnlyInput value={row.branchName} />
                    </Form.Field>
                  </Form.Col>

                  <Form.Col lg={3} md={6} span={12}>
                    <Form.Field label={`${adminUnitTypeLabel} Short Name`}>
                      <ReadOnlyInput value={row.branchShortName} />
                    </Form.Field>
                  </Form.Col>

                  <Form.Col lg={2} md={6} span={12}>
                    <Form.Field label="Status">
                      <ReadOnlyInput
                        value={row.isActive ? "ACTIVE" : "INACTIVE"}
                      />
                    </Form.Field>
                  </Form.Col>
                </Form.Row>

                <Form.Row>
                  <Form.Col lg={2} md={6} span={12}>
                    <Form.Field label="Registration Date">
                      <ReadOnlyInput value={row.registrationDate} />
                    </Form.Field>
                  </Form.Col>

                  <Form.Col lg={2} md={6} span={12}>
                    <Form.Field label="Opening Date">
                      <ReadOnlyInput value={row.openingDate} />
                    </Form.Field>
                  </Form.Col>

                  {row.closingDate && (
                    <Form.Col lg={2} md={6} span={12}>
                      <Form.Field label="Closing Date">
                        <ReadOnlyInput value={row.closingDate} />
                      </Form.Field>
                    </Form.Col>
                  )}

                  {row.dateOfShift && (
                    <Form.Col lg={2} md={6} span={12}>
                      <Form.Field label="Date of Shift">
                        <ReadOnlyInput value={row.dateOfShift} />
                      </Form.Field>
                    </Form.Col>
                  )}

                  {row.mergedOn && (
                    <Form.Col lg={2} md={6} span={12}>
                      <Form.Field label="Merged On">
                        <ReadOnlyInput value={row.mergedOn} />
                      </Form.Field>
                    </Form.Col>
                  )}

                  {row.mergedToBranchIdentity && (
                    <Form.Col lg={2} md={6} span={12}>
                      <Form.Field label="Merged To">
                        <ReadOnlyInput value={row.mergedToBranchIdentity} />
                      </Form.Field>
                    </Form.Col>
                  )}

                  <Form.Col lg={2} md={6} span={12}>
                    <Form.Field label="Language">
                      <ReadOnlyInput value={row.language} />
                    </Form.Field>
                  </Form.Col>

                  <Form.Col lg={2} md={6} span={12}>
                    <Form.Field label="Timezone">
                      <ReadOnlyInput value={row.timezone} />
                    </Form.Field>
                  </Form.Col>

                  <Form.Col lg={2} md={6} span={12}>
                    <Form.Field label={`Main ${adminUnitTypeLabel}`}>
                      <ReadOnlyInput
                        value={row.isMainBranchInLocation ? "Yes" : "No"}
                      />
                    </Form.Field>
                  </Form.Col>
                </Form.Row>
              </Form>
            </section>

            <section className="mt-3 rounded-lg border bg-white p-3">
              <p className="mb-2 text-xs font-semibold text-gray-800">
                Address
              </p>

              <Form onSubmit={e => e.preventDefault()}>
                <Form.Row>
                  <Form.Col lg={2} md={6} span={12}>
                    <Form.Field label="Door Number">
                      <ReadOnlyInput value={row.doorNumber} />
                    </Form.Field>
                  </Form.Col>

                  <Form.Col lg={4} md={6} span={12}>
                    <Form.Field label="Address Line 1">
                      <ReadOnlyInput value={row.addressLine1} />
                    </Form.Field>
                  </Form.Col>

                  <Form.Col lg={3} md={6} span={12}>
                    <Form.Field label="Address Line 2">
                      <ReadOnlyInput value={row.addressLine2} />
                    </Form.Field>
                  </Form.Col>

                  <Form.Col lg={3} md={6} span={12}>
                    <Form.Field label="Landmark">
                      <ReadOnlyInput value={row.landmark} />
                    </Form.Field>
                  </Form.Col>
                </Form.Row>

                <Form.Row>
                  <Form.Col lg={4} md={6} span={12}>
                    <Form.Field label="Place Name">
                      <ReadOnlyInput value={row.placeName} />
                    </Form.Field>
                  </Form.Col>

                  <Form.Col lg={2} md={6} span={12}>
                    <Form.Field label="PIN Code">
                      <ReadOnlyInput value={row.pincode} />
                    </Form.Field>
                  </Form.Col>

                  <Form.Col lg={3} md={6} span={12}>
                    <Form.Field label="Post Office">
                      <ReadOnlyInput value={row.postOffice} />
                    </Form.Field>
                  </Form.Col>

                  <Form.Col lg={3} md={6} span={12}>
                    <Form.Field label="District">
                      <ReadOnlyInput value={row.districtName} />
                    </Form.Field>
                  </Form.Col>
                </Form.Row>

                <Form.Row>
                  <Form.Col lg={3} md={6} span={12}>
                    <Form.Field label="State">
                      <ReadOnlyInput value={row.stateName} />
                    </Form.Field>
                  </Form.Col>

                  <Form.Col lg={2} md={6} span={12}>
                    <Form.Field label="Country">
                      <ReadOnlyInput value={"INDIA"} />
                    </Form.Field>
                  </Form.Col>
                </Form.Row>
              </Form>
            </section>

            <footer className="mt-3 flex items-center justify-end">
              <NeumorphicButton
                type="button"
                variant="secondary"
                size="secondary"
                onClick={onClose}
              >
                Close
              </NeumorphicButton>
            </footer>
          </FormContainer>
        </div>
      </div>
    </div>
  );
};
