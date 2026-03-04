import { cn } from "@/utils";
import incede from "@/assets/incede.png";
import { Flex } from "@/components";
import { Bell, EllipsisVertical, Mic, Settings } from "lucide-react";
import NeumorphicButton from "@/components/ui/neumorphic-button/neumorphic-button";
import { getJwtData } from "@/utils/get-jwt-data";
import { getShortName } from "@/utils/short-name-generator";
import { getTodayDate } from "@/utils/date-formatter";

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const data = getJwtData();
  // const { logout } = useAuth();
  const branch = 152;
  const date = new Date();
  const cbDate = getTodayDate(date);
  const dpName = getShortName(data?.name ?? "");
  const name = data?.name;

  return (
    <header
      className={cn(
        "border-border bg-background fixed top-0 right-0 left-0 z-40 border-b px-2 py-3 pr-4",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="flex items-center">
            <img src={incede} className="w-[120px] md:w-[200px]" />
          </div>
        </div>
        <div className="flex items-center justify-center gap-2 sm:gap-3">
          <Flex
            direction="row"
            gap={3}
            className="hidden rounded-full border-1 border-cyan-800/50 py-[6px] pr-[8px] pl-[12px] text-xs font-medium md:flex lg:text-sm"
          >
            <p className="py-[2px] text-cyan-400">BRANCH : {branch}</p>
            <div className="rounded-full bg-blue-300 px-[12px] py-[2px]">
              <p className="text-white">CBD : {cbDate}</p>
            </div>
          </Flex>
          <Mic className="w-[18px] text-blue-200 md:w-[22px]" />
          <Bell className="w-[18px] text-yellow-300 md:w-[22px]" />
          <Settings className="text-red-1000 w-[18px] md:w-[22px]" />
          <EllipsisVertical className="w-[18px] text-cyan-700 md:w-[22px]" />
          <Flex
            justify="center"
            align="center"
            className="h-[26px] w-[26px] rounded-full bg-blue-100/60 text-[10px] font-bold text-blue-700 uppercase lg:text-[12px]"
          >
            {dpName}
          </Flex>
          <p className="hidden text-xs font-medium text-blue-700 capitalize md:flex lg:text-sm">
            {name}
          </p>
          <NeumorphicButton className="max-h-[10px] py-1 text-xs lg:text-sm">
            CRE
          </NeumorphicButton>
        </div>
      </div>
    </header>
  );
}
