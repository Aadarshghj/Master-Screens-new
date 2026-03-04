import { Button, Flex, TitleHeader } from "@/components";
import type { LandingPageContentProps } from "@/types";
import type { FC } from "react";
const LandingPageContent: FC<LandingPageContentProps> = ({
  description,
  title,
  buttonData,
}) => {
  return (
    <Flex
      direction="col"
      justify="center"
      className="h-[80vh] w-full px-6 pt-10 md:w-1/2 md:px-10"
    >
      <article>
        <TitleHeader
          title={title}
          className="ml-8 max-w-[350px] text-xl font-normal text-white/60 md:text-2xl lg:ml-10  lg:text-3xl"
          as="h1"
        />
        <p className="mt-3 text-sm text-balance text-white/60 lg:mt-5">
          {" "}
          {description}
        </p>{" "}
      </article>{" "}
      <Button
        variant="bordered"
        className="hover:text-primary-dark mt-3 border-1 border-white/50 bg-transparent text-xs text-white hover:bg-white sm:h-[38px] sm:min-w-[100px] lg:mt-5"
      >
        Read More
      </Button>
      <Flex className="mt-5 lg:mt-7">
        {buttonData.map(item => (
          <Button className="hover:text-primary-dark h-[43px]  w-[41px] rounded-xl  border-1 border-white/50 bg-transparent text-[200px] text-white hover:bg-white lg:h-[55px] lg:w-[51px] lg:rounded-2xl">
            <item.label
              className="hidden md:block"
              width={36}
              height={36}
              strokeWidth={1}
            />
            <item.label
              className="md:hidden"
              width={28}
              height={28}
              strokeWidth={1}
            />
          </Button>
        ))}
      </Flex>
    </Flex>
  );
};

export default LandingPageContent;
