import { RoastLevel } from "@/src/app/generated/prisma/enums";
import { Coffee } from "lucide-react";
interface Props {
  roastLevel: RoastLevel;
}

export const RoastBadge = ({ roastLevel }: Props) => {
  const activeCount =
    roastLevel === RoastLevel.LIGHT ? 1 : roastLevel === RoastLevel.MEDIUM ? 2 : 3;

  return (
    <div className="flex gap-1">
      {Array.from({ length: 3 }).map((_, index) => (
        <Coffee
          key={`roast-icon-${index}`}
          className={index < activeCount ? "" : "opacity-40"}
        />
      ))}
    </div>
  );
};
