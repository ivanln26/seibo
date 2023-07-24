import Add from "./add";
import CheckList from "./checklist";
import Clock from "./clock";
import Description from "./description";
import Home from "./home";
import Menu from "./menu";
import Person from "./person";

export type Icon =
  | "add"
  | "checklist"
  | "clock"
  | "description"
  | "home"
  | "menu"
  | "person";

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
    case "menu":
      return <Menu {...props} />;
    case "person":
      return <Person {...props} />;
    default:
      return <Add {...props} />;
  }
}
