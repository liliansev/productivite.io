import { AlertDialog as AlertDialogPrimitive } from "bits-ui";
import Root from "./alert-dialog.svelte";
import Content from "./alert-dialog-content.svelte";
import Description from "./alert-dialog-description.svelte";
import Footer from "./alert-dialog-footer.svelte";
import Header from "./alert-dialog-header.svelte";
import Title from "./alert-dialog-title.svelte";
import Action from "./alert-dialog-action.svelte";
import Cancel from "./alert-dialog-cancel.svelte";

const Trigger = AlertDialogPrimitive.Trigger;
const Portal = AlertDialogPrimitive.Portal;

export {
  Root,
  Content,
  Description,
  Footer,
  Header,
  Title,
  Action,
  Cancel,
  Trigger,
  Portal,
  //
  Root as AlertDialog,
  Content as AlertDialogContent,
  Description as AlertDialogDescription,
  Footer as AlertDialogFooter,
  Header as AlertDialogHeader,
  Title as AlertDialogTitle,
  Action as AlertDialogAction,
  Cancel as AlertDialogCancel,
  Trigger as AlertDialogTrigger,
  Portal as AlertDialogPortal,
};
