import { Spinner } from "@mynaui/icons-react";
import { Modal } from "../modal";

interface LoadingModalProps {
  isOpen: boolean;
  loader: string;
}
export const Loading: React.FC<LoadingModalProps> = ({ isOpen, loader }) => {
  return (
    <Modal isOpen={isOpen} width="lg" isClosable={false}>
      <div className="text-dark flex w-sm flex-row justify-evenly p-6 font-bold">
        <Spinner className="animate-spin duration-800" />
        {loader}
      </div>
    </Modal>
  );
};
