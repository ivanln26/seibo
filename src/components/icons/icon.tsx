import Add from "./add";
import CheckList from "./checklist";
import Clock from "./clock";
import Description from "./description";
import Home from "./home";

export type Icon = "add" | "checklist" | "clock" | "description" | "home";

export type IconProps = {
  height: number;
  width: number;
};

type IconPickerProps = {
  icon: Icon;
} & IconProps;

export default function Icon({ icon, ...props }: IconPickerProps) {
  switch (icon) {
    case "clock":
      return <Clock {...props} />;
    case "checklist":
      return <CheckList {...props} />;
    case "description":
      return <Description {...props} />;
    case "home":
      return <Home {...props} />;
    default:
      return <Add {...props} />;
  }
}
