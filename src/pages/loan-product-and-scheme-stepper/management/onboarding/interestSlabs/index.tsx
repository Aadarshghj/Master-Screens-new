import React from "react";
import { useAppSelector } from "@/hooks/store";
import {
  useGetInterestSlabsQuery,
  useCreateInterestSlabMutation,
} from "@/global/service/end-points/loan-product-and-scheme/interest-slab";
import { InterestSlabForm } from "./components/Form/InterestSlabs";

interface InterestSlabPageProps {
  onComplete?: () => void;
  onSave?: () => void;
  loanSchemeFromStepper?: string;
}

export const InterestSlabPage: React.FC<InterestSlabPageProps> = props => {
  const { currentSchemeId } = useAppSelector(state => state.loanProduct);
  const schemeId = currentSchemeId;

  const { data: interestSlabs, refetch } = useGetInterestSlabsQuery(
    { schemeId: schemeId || "" },
    { skip: false }
  );

  const [createInterestSlab] = useCreateInterestSlabMutation();

  return (
    <InterestSlabForm
      {...props}
      interestSlabs={interestSlabs ? { interestSlabs } : undefined}
      refetch={refetch}
      schemeId={schemeId || undefined}
      createInterestSlab={
        createInterestSlab as (params: {
          schemeId: string;
          payload: unknown;
        }) => { unwrap: () => Promise<unknown> }
      }
    />
  );
};
