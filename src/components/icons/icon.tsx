import Add from "./add";
import Check from "./check";
import CheckList from "./checklist";
import Clock from "./clock";
import Delete from "./delete";
import Description from "./description";
import Expand from "./expand";
import History from "./history";
import Home from "./home";
import Mail from "./mail";
import Menu from "./menu";
import Person from "./person";
import Search from "./search";
import Chart from "./chart";
import Edit from "./edit";

export type Icon =
  | "add"
  | "check"
  | "checklist"
  | "clock"
  | "delete"
  | "description"
  | "expand"
  | "history"
  | "home"
  | "menu"
  | "person"
  | "search"
  | "mail"
  | "chart"
  | "edit";

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
    case "delete":
      return <Delete {...props} />;
    case "description":
      return <Description {...props} />;
    case "edit":
      return <Edit {...props}/>;
    case "expand":
      return <Expand {...props} />;
    case "history":
      return <History {...props} />;
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
    case "chart":
      return <Chart {...props} />;
    default:
      return <Add {...props} />;
  }
}
