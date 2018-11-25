import { Toast } from "native-base";

export function showToastsInArr(arr, params = {}) {
  arr.forEach(message => {
    Toast.show({
      text: message,
      buttonText: params.buttonText || "OK",
      type: params.type || "danger",
      position: params.position || "top",
      duration: params.duration || 5000
    });
  });
}

export async function handleError(component, result) {
  var error = result.ApiErr || result.err;
  var name = result.ApiErr ? "ApiErrors" : "Errors";
  component.setState({ [name]: error });
  showToastsInArr(error);
}
