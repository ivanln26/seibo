import Add from "./add";
import Check from "./check";
import CheckList from "./checklist";
import Clock from "./clock";
import Description from "./description";
import Home from "./home";
import Mail from "./mail";
import Menu from "./menu";
import Person from "./person";
import Search from "./search";

export type Icon =
  | "add"
  | "check"
  | "checklist"
  | "clock"
  | "description"
  | "home"
  | "menu"
  | "person"
  | "search"
  | "mail";

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
    case "check":
      return <Check {...props} />;
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
    case "search":
      return <Search {...props} />;
    case "mail":
      return <Mail {...props} />;
    default:
      return <Add {...props} />;
  }
}
