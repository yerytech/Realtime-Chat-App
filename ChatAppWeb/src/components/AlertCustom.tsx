import Swal from "sweetalert2";
interface AlertOptions {
  title: string;
  text?: string;
  icon?: "success" | "error" | "warning" | "info" | "question";
  confirmButtonText?: string;
  showCancelButton?: boolean;
  cancelButtonText?: string;
  position?: "top" | "top-end" | "center" | "bottom" | "bottom-end";
  timer?: number;
}
export const AlertCustom = (options: AlertOptions) => {
  return Swal.fire({
    position: options.position || "center",
    icon: options.icon || "success",
    title: options.title || "Your work has been saved",
    text: options.text || "",
    confirmButtonText: options.confirmButtonText || "OK",
    showCancelButton: options.showCancelButton || false,
    cancelButtonText: options.cancelButtonText || "Cancel",
    timer: options.timer || 1500,
  });
};
